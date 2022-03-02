import { normalize } from 'path';
import {
  cruise, IDependency, IReporterOutput, IModule
} from 'dependency-cruiser';

import { Dependency } from '../../types';

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
