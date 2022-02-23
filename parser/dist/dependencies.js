"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDependencyInstances = exports.getDependencyData = exports.formatDependencies = exports.findDependencies = void 0;
const dependency_cruiser_1 = require("dependency-cruiser");
const jsdom_1 = require("jsdom");
const path_1 = require("path");
const utils_1 = require("./utils");
const findDependencies = (components, directory = 'src') => {
    let cruiseResult = null;
    try {
        cruiseResult = dependency_cruiser_1.cruise(components, {
            includeOnly: directory,
        });
    }
    catch (error) {
        console.error('Something went wrong cruising the project ', error);
    }
    if (cruiseResult && typeof cruiseResult?.output !== 'string')
        return cruiseResult?.output?.modules;
    return null;
};
exports.findDependencies = findDependencies;
const formatDependencies = (dependencies) => {
    return dependencies.map((dependency) => ({
        fullPath: path_1.normalize(dependency.resolved),
        usedEvents: [],
        usedProps: [],
        usedSlots: [],
    }));
};
exports.formatDependencies = formatDependencies;
// TODO: figure out a smarter way to get the dependency from the array
//  maybe save the indices in a separate loop beforehand?
const getDependencyData = (components, fullPath) => components.find((component) => component.fullPath === fullPath);
exports.getDependencyData = getDependencyData;
const findDependencyInstances = (template, name) => {
    const { document } = new jsdom_1.JSDOM(template).window;
    const dependencyUsages = [...document.querySelectorAll(name)];
    return dependencyUsages.concat([...document.querySelectorAll(utils_1.kebabize(name))]);
};
exports.findDependencyInstances = findDependencyInstances;
//# sourceMappingURL=dependencies.js.map