import { normalize } from 'path';
import {
  cruise, IDependency, IReporterOutput, IModule
} from 'dependency-cruiser';

import { Dependency, VueComponent } from '../../types';

import { findComponentDataByString } from './analyzer';

export const findDependencies = (directory = 'src', fileType: string):IModule[] | null => {
  let cruiseResult: IReporterOutput | null = null;
  try {
    cruiseResult = cruise(
        [directory],
        {
          includeOnly: `.${fileType}`,
          exclude: ['node_modules'],
          doNotFollow: {
             path: 'node_modules',
             dependencyTypes: [
                'npm',
                'npm-dev',
                'npm-optional',
                'npm-peer',
                'npm-bundled',
                'npm-no-pkg',
             ],
          },
        },
    );
  } catch (error) {
    console.error('Something went wrong cruising the project ', error);
  }
  if (cruiseResult && typeof cruiseResult?.output !== 'string') return cruiseResult?.output?.modules;
  return null;
};

export const formatDependencies = (dependencies: IDependency[]): Dependency[] => {
  return dependencies.map((dependency) => ({
      fullPath: normalize(dependency.resolved),
      usedEvents: [],
      usedProps: [],
      usedSlots: [],
  }));
};

// temporal (!) workaround for sanitizing path aliases with '@' that cannot be resolved by dependency-cruiser
export const sanitizeUnresolvedDependencyPaths = (components: VueComponent[]): VueComponent[] => {
    return components.map((component) => {
        const newDependencies = component.dependencies.map((dependency) => {
            const isWebPackAlias = dependency.fullPath.includes('@/');
            let path = dependency.fullPath;
            if (isWebPackAlias) {
                const slicedPath = dependency.fullPath.slice(2, dependency.fullPath.length);
                const dependencyComponent = findComponentDataByString(components, slicedPath);
                path = dependencyComponent?.fullPath || dependency.fullPath;
            }
            return {
                ...dependency,
                fullPath: path,
            };
        });
        return {
            ...component,
            dependencies: newDependencies,
        };
    });
};

