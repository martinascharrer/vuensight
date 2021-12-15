import {
  cruise, ICruiseOptions, IDependency, IReporterOutput,
} from 'dependency-cruiser';
import { normalize } from 'path';
import { Dependency } from '../types/index.d';

const DEPCRUISE_OPTIONS: ICruiseOptions = {
  includeOnly: 'src',
};

export const cruiseComponents = (components: string[]):IReporterOutput | null => {
  let cruiseResult: IReporterOutput | null = null;
  try {
    cruiseResult = cruise(
      components,
      DEPCRUISE_OPTIONS,
    );
  } catch (error) {
    console.error(error);
  }
  return cruiseResult;
};

export const formatDependencies = (dependencies: IDependency[]): Dependency[] => {
  const newDependencies:Dependency[] = [];
  dependencies.forEach((dependency) => {
    newDependencies.push({
      fullPath: normalize(dependency.resolved),
      usedEvents: [],
      usedProps: [],
    });
  });
  return newDependencies;
};
