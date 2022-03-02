import { VueComponent } from '../types';

import { findDependencies } from './vue/dependencies';
import { analyzeComponents, analyzeCommunicationChannelUsage } from './vue/analyzer';

export const parse = async (directory: string, fileType = 'vue'): Promise<VueComponent[]> => {
  const modules = findDependencies(directory, fileType);
  if (!modules) return new Array<VueComponent>();
  const components: VueComponent[] = await analyzeComponents(modules);
  return analyzeCommunicationChannelUsage(components);
};
