import { readFileSync } from 'fs';
import { normalize } from 'path';

import { VueComponent } from '../types';

import {
  formatDependencies,
  findDependencies,
  getDependencyData,
  findDependencyInstances,
} from './dependencies';
import { getFileNameFromPath, getTemplate, getVueFilePaths } from './files';
import { isPropUsed, isEventUsed, isSlotUsed, getUsedChannels, findCommunicationChannels } from './parser';
import { printComponent, printDependencies } from './component';

export const parse = async (directory: string): Promise<VueComponent[]> => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components in total`);

  const cruiseResult = findDependencies(paths, directory);
  const components: VueComponent[] = [];
  if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
    await Promise.all(cruiseResult.output.modules.map(async (module) => {
      const fullPath = normalize(module.source);
      const fileName = getFileNameFromPath(fullPath);
      const [name, fileType] = fileName.split('.');

      if (fileType !== 'vue') return;

      const fileContent = readFileSync(fullPath, { encoding: 'utf-8' });
      const dependencies = formatDependencies(module.dependencies);
      const { props, events, slots } = await findCommunicationChannels(fullPath);

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
    }));

    components.forEach((component) => {
      component.dependencies.forEach((dependency) => {
        const dependencyData = getDependencyData(components, dependency.fullPath);

        if (dependencyData && dependencyData.fileType === 'vue') {
          const template = getTemplate(component.fileContent);
          if (template) {
            const dependencyInstances = findDependencyInstances(template, dependencyData.name);
            const isDependencyUsed = dependencyInstances.length > 0;
            if (isDependencyUsed) {
              dependency.usedProps = getUsedChannels(dependencyInstances, dependencyData.props, isPropUsed);
              dependency.usedEvents = getUsedChannels(dependencyInstances, dependencyData.events, isEventUsed);
              dependency.usedSlots = getUsedChannels(dependencyInstances, dependencyData.slots, isSlotUsed);
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
