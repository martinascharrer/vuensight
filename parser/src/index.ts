import { readFileSync } from 'fs';
import { normalize } from 'path';

import { VueComponent } from '../types';

import {
  formatDependencies,
  cruiseComponents,
  getDependencyData,
  findDependencyUsages,
} from './dependencies';
import { getFileNameFromPath, getTemplate, getVueFilePaths } from './files';
import { isPropUsed, isEventUsed, findCommunicationChannels } from './parser';
import { printComponent, printDependencies } from './component';

export const parse = async (directory: string): Promise<VueComponent[]> => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components in total`);

  const cruiseResult = cruiseComponents(paths, directory);
  const components: VueComponent[] = [];
  if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
    cruiseResult.output.modules.forEach((module) => {
      const fullPath = normalize(module.source);
      const fileName = getFileNameFromPath(fullPath);
      const [name, fileType] = fileName.split('.');

      if (fileType !== 'vue') return;

      const fileContent = readFileSync(fullPath, { encoding: 'utf-8' });
      const dependencies = formatDependencies(module.dependencies);
      const { props, events, slots } = findCommunicationChannels(fileContent);

      components.push({
        name,
        fullPath,
        fileContent,
        fileName,
        fileType,
        props,
        events,
        slots,
        dependencies,
      });
    });

    components.forEach((component) => {
      component.dependencies.forEach((dependency) => {
        const dependencyData = getDependencyData(components, dependency.fullPath);

        if (dependencyData && dependencyData.fileType === 'vue') {
          const template = getTemplate(component.fileContent);
          if (template) {
            const dependencyUsages = findDependencyUsages(template, dependencyData.name);
            const isDependencyUsed = dependencyUsages.length > 0;
            if (isDependencyUsed) {
              dependencyData.props.forEach((prop, propIndex) => {
                dependencyUsages.forEach((dependencyUsage: Element) => {
                  const isIndexIncluded = dependency.usedProps.includes(propIndex);
                  if (isPropUsed(dependencyUsage, prop) && !isIndexIncluded) {
                    dependency.usedProps.push(propIndex);
                  }
                });
              });

              dependencyData.events.forEach((event, eventIndex) => {
                dependencyUsages.forEach((dependencyUsage: Element) => {
                  const isIndexIncluded = dependency.usedEvents.includes(eventIndex);
                  if (isEventUsed(dependencyUsage, event) && !isIndexIncluded) {
                    dependency.usedEvents.push(eventIndex);
                  }
                });
              });
            }
          }
        }
      });
    });

    components.forEach((component) => {
      printComponent(component);
      printDependencies(component, components);
    });
    console.log(`Parsed ${components.length} Vue components`);
  }

  return components;
};
