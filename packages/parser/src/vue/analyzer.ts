import { readFileSync } from 'fs';
import { normalize } from 'path';
import { IModule } from 'dependency-cruiser';

import { VueComponent } from '@vuensight/types';

import { getFileNameFromPath } from '../utils/files';
import { formatDependencies } from './dependencies';
import { parseComponentFile, getDependentWithUsedChannelsAnalysis } from './communication-channels';

export const findComponentData = (components: VueComponent[], fullPath: string)
  : VueComponent | undefined => components.find((component) => component.fullPath === fullPath);

export const findComponentDataByString = (components: VueComponent[], string: string)
    : VueComponent | undefined => components.find((component) => component.fullPath.includes(string));

export const analyzeComponents = async (modules: IModule[]): Promise<VueComponent[]> => {
    return await Promise.all(modules.map(async (module) => {
        const fullPath = normalize(module.source);
        const fileName = getFileNameFromPath(fullPath);
        const [name, fileType] = fileName.split('.');

        let fileContent = '';
        try {

            fileContent = readFileSync(fullPath, {encoding: 'utf-8'});
        } catch (e) {
            console.error(e);
        }
        const dependencies = formatDependencies(module.dependencies);
        const parsedComponentData = fileType === 'vue' ? await parseComponentFile(fullPath) : null;

        return {
            name: parsedComponentData?.name && parsedComponentData?.name !== name ?  parsedComponentData?.name : name,
            fullPath,
            fileContent,
            fileName,
            fileType,
            props: parsedComponentData?.props ?? [],
            events: parsedComponentData?.events ?? [],
            slots: parsedComponentData?.slots ?? [],
            dependencies,
            dependents: module.dependents.map(dependent => ({
                fullPath: dependent,
                name: '',
                usedProps: [],
                usedSlots: [],
                usedEvents: [],
            })),
        };
    }));
};

export const analyzeCommunicationChannelUsage = (components: VueComponent[]): VueComponent[] => {
    return components.map((component) => {
        const dependents = component.dependents.map((dependent) => {
            const dependentData = findComponentData(components, normalize(dependent.fullPath));
            if (dependentData && dependentData.fileType === 'vue') {
                return getDependentWithUsedChannelsAnalysis(dependentData, component);
            }
            return dependent;
        });

        component.props.sort((a) =>  a.isVModel ? -1 : 1);
        component.events.sort((a) =>  a.isVModel ? -1 : 1);

        return {
            ...component,
            dependents,
        };
    });
};
