import { readFileSync } from 'fs';
import { normalize } from 'path';

import { VueComponent } from '../types/index.d';

import {
  formatDependencies,
  cruiseComponents,
  getDependencyData,
  findDependencyUsages,
} from './dependencies';
import { getFileNameFromPath, getTemplate, getVueFilePaths } from './files';
import { isPropUsed, parseComponent } from './parser';
import { printComponent, printDependencies } from './component';

(async () => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components`);

  const cruiseResult = cruiseComponents(paths);
  if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
    const components: VueComponent[] = [];
    cruiseResult.output.modules.forEach((module) => {
      const pathNormalized = normalize(module.source);
      const fileContent = readFileSync(pathNormalized, { encoding: 'utf-8' });
      const fileName = getFileNameFromPath(pathNormalized);
      const [name, fileType] = fileName.split('.');
      const dependencies = formatDependencies(module.dependencies);

      const component = {
        name,
        fullPath: pathNormalized,
        fileContent,
        fileName,
        fileType,
        props: [],
        events: [],
        slots: [],
        dependencies,
      };

      parseComponent(component);
      components.push(component);
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
})();
