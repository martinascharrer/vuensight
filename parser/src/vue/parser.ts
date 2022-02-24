import { readFileSync } from 'fs';
import { normalize } from 'path';
import { IModule } from 'dependency-cruiser';

import { VueComponent } from '../../types';

import { getFileNameFromPath } from '../utils/files';
import { getTemplateContent } from '../utils/template';
import { formatDependencies } from './dependencies';
import { findCommunicationChannels, getDependencyWithUsedChannelsAnalysis } from './communication-channels';

export const findComponentData = (components: VueComponent[], fullPath: string)
  : VueComponent | undefined => components.find((component) => component.fullPath === fullPath);

export const analyzeComponents = async (modules: IModule[]): Promise<VueComponent[]> => {
  return await Promise.all(modules.map(async (module) => {
    const fullPath = normalize(module.source);
    const fileName = getFileNameFromPath(fullPath);
    const [name, fileType] = fileName.split('.');

    const fileContent = readFileSync(fullPath, {encoding: 'utf-8'});
    const dependencies = formatDependencies(module.dependencies);
    const { props, events, slots } = await findCommunicationChannels(fullPath);

    return {
      name,
      fullPath,
      fileContent,
      fileName,
      fileType,
      props: props ?? [],
      events: events ?? [],
      slots: slots ??
        [],
      dependencies,
    };
  }));
};

export const analyzeCommunicationChannelUsage = (components: VueComponent[]): VueComponent[] => {
  return components.map((component) => {
    const dependencies = component.dependencies.map((dependency) => {
      const dependencyData = findComponentData(components, dependency.fullPath);
      if (dependencyData && dependencyData.fileType === 'vue') {
        const template = getTemplateContent(component.fileContent);
        if (template) return getDependencyWithUsedChannelsAnalysis(template, dependencyData);
      }
      return dependency;
    });
    return {
      ...component,
      dependencies,
    };
  });
};
