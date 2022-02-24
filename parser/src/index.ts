import { VueComponent } from '../types';

import { findDependencies } from './vue/dependencies';
import { getFilePathsByType } from './utils/files';
import { analyzeComponents, analyzeCommunicationChannelUsage } from './vue/parser';

export const parse = async (directory: string, fileType = 'vue'): Promise<VueComponent[]> => {
  const paths = await getFilePathsByType(process.cwd(), fileType);
  const modules = findDependencies(paths, directory);
  if (!modules) return new Array<VueComponent>();
  const components: VueComponent[] = await analyzeComponents(modules);
  return analyzeCommunicationChannelUsage(components);
};
