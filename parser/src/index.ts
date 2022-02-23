import { VueComponent } from '../types';

import {
  findDependencies,
} from './dependencies';
import { getVueFilePaths } from './files';
import { getComponents, getFullyAnalyzedComponents } from './parser';
import { printComponent, printDependencies } from './component';

export const parse = async (directory: string): Promise<VueComponent[]> => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components in total`);

  const modules = findDependencies(paths, directory);
  if (!modules) return new Array<VueComponent>();

  const components: VueComponent[] = await getComponents(modules);
  const componentsFullyAnalyzed: VueComponent[] = getFullyAnalyzedComponents(components);

  componentsFullyAnalyzed.forEach((component) => {
    printComponent(component);
    printDependencies(component, components);
  });
  console.log(`Parsed ${components.length} Vue components`);

  return componentsFullyAnalyzed;
};
