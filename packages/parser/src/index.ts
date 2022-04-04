import { VueComponent } from  '@vue-component-insight/types';

import { findDependencies, sanitizeUnresolvedDependencyPaths } from './vue/dependencies';
import { analyzeComponents, analyzeCommunicationChannelUsage } from './vue/analyzer';

export const parse = async (directory: string, fileType = 'vue'): Promise<VueComponent[]> => {
  const modules = findDependencies(directory, fileType);
  if (!modules) return new Array<VueComponent>();

  // temporal workaround for setup issues with dependency cruiser and path aliases
  const sanitizedModules = modules.filter(module => !module.source.includes('@/'));

  const components: VueComponent[] = await analyzeComponents(sanitizedModules);
  const sanitizedComponents = sanitizeUnresolvedDependencyPaths(components);
  return analyzeCommunicationChannelUsage(sanitizedComponents);
};
