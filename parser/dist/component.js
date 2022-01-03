"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printDependencies = exports.printComponent = void 0;
const files_1 = require("./files");
const dependencies_1 = require("./dependencies");
const printComponent = (component) => {
    console.log('-', component.fileName, ':', 'props:', component.props.length, 'events:', component.events.length, 'slots:', component.slots.length, 'dependencies:', component.dependencies.map((dep) => files_1.getFileNameFromPath(dep.fullPath)).join(', '));
};
exports.printComponent = printComponent;
const printDependencies = (component, components) => {
    component.dependencies.forEach((dependency) => {
        const dependencyComponent = dependencies_1.getDependencyData(components, dependency.fullPath);
        const propsFormatted = [];
        const eventsFormatted = [];
        if (dependencyComponent) {
            dependency.usedProps.forEach((propIndex) => {
                propsFormatted.push(dependencyComponent.props[propIndex].name);
            });
            dependency.usedEvents.forEach((eventIndex) => {
                eventsFormatted.push(dependencyComponent.events[eventIndex].name);
            });
        }
        if (dependency.usedProps.length > 0)
            console.log(`     uses props of ${files_1.getFileNameFromPath(dependency.fullPath)}: ${propsFormatted.join(', ')}`);
        if (dependency.usedEvents.length > 0)
            console.log(`     uses events of ${files_1.getFileNameFromPath(dependency.fullPath)}: ${eventsFormatted.join(', ')}`);
    });
};
exports.printDependencies = printDependencies;
//# sourceMappingURL=component.js.map