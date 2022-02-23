import {
  cruise, IDependency, IReporterOutput, IModule
} from 'dependency-cruiser';
import { JSDOM } from 'jsdom';

import { normalize } from 'path';
import { Dependency, VueComponent } from '../types';
import { kebabize } from './utils';

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

// TODO: figure out a smarter way to get the dependency from the array
//  maybe save the indices in a separate loop beforehand?
export const getComponentData = (components: VueComponent[], fullPath: string)
  : VueComponent | undefined => components.find((component) => component.fullPath === fullPath);

export const findDependencyInstances = (template: string, name: string): Element[] => {
  const { document } = new JSDOM(template).window;
  const dependencyUsages = [...document.querySelectorAll(name)];
  return dependencyUsages.concat([...document.querySelectorAll(kebabize(name))]);
};
