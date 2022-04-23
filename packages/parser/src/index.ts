import { VueComponent } from  '@vuensight/types';

import { findDependencies } from './vue/dependencies';
import { analyzeComponents, analyzeCommunicationChannelUsage } from './vue/analyzer';

export const parse = async (
    directory: string,
    fileType = 'vue',
    webpackConfigPath?: string,
    tsConfigPath?: string
): Promise<VueComponent[]> => {
  const modules = findDependencies(directory, fileType, webpackConfigPath, tsConfigPath);
  if (!modules) return new Array<VueComponent>();

  const components: VueComponent[] = await analyzeComponents(modules);
  return analyzeCommunicationChannelUsage(components);
};
