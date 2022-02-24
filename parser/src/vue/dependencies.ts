import { normalize } from 'path';
import {
  cruise, IDependency, IReporterOutput, IModule
} from 'dependency-cruiser';

import { Dependency } from '../../types';

export const findDependencies = (components: string[], directory = 'src'):IModule[] | null => {
  let cruiseResult: IReporterOutput | null = null;
  try {
    cruiseResult = cruise(
      components,
      {
        includeOnly: directory,
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
    })
  );
};
