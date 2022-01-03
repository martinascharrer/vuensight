import { VueComponent } from '../types';
import { getFileNameFromPath } from './files';
import { getDependencyData } from './dependencies';

export const printComponent = (component: VueComponent): void => {
  console.log(
    '-', component.fileName, ':',
    'props:', component.props.length,
    'events:', component.events.length,
    'slots:', component.slots.length,
    'dependencies:', component.dependencies.map((dep) => getFileNameFromPath(dep.fullPath)).join(', '),
  );
};

export const printDependencies = (component: VueComponent, components: VueComponent[]): void => {
  component.dependencies.forEach((dependency) => {
    const dependencyComponent = getDependencyData(components, dependency.fullPath);
    const propsFormatted:string[] = [];
    const eventsFormatted:string[] = [];
    if (dependencyComponent) {
      dependency.usedProps.forEach((propIndex) => {
        propsFormatted.push(dependencyComponent.props[propIndex].name);
      });
      dependency.usedEvents.forEach((eventIndex) => {
        eventsFormatted.push(dependencyComponent.events[eventIndex].name);
      });
    }
    if (dependency.usedProps.length > 0) console.log(`     uses props of ${getFileNameFromPath(dependency.fullPath)}: ${propsFormatted.join(', ')}`);
    if (dependency.usedEvents.length > 0) console.log(`     uses events of ${getFileNameFromPath(dependency.fullPath)}: ${eventsFormatted.join(', ')}`);
  });
};
