"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDependencyUsages = exports.getDependencyData = exports.formatDependencies = exports.cruiseComponents = void 0;
const dependency_cruiser_1 = require("dependency-cruiser");
const jsdom_1 = require("jsdom");
const path_1 = require("path");
const utils_1 = require("./utils");
const DEPCRUISE_OPTIONS = {
    includeOnly: 'src',
};
const cruiseComponents = (components) => {
    let cruiseResult = null;
    try {
        cruiseResult = dependency_cruiser_1.cruise(components, DEPCRUISE_OPTIONS);
    }
    catch (error) {
        console.error(error);
    }
    return cruiseResult;
};
exports.cruiseComponents = cruiseComponents;
const formatDependencies = (dependencies) => {
    const newDependencies = [];
    dependencies.forEach((dependency) => {
        newDependencies.push({
            fullPath: path_1.normalize(dependency.resolved),
            usedEvents: [],
            usedProps: [],
        });
    });
    return newDependencies;
};
exports.formatDependencies = formatDependencies;
// TODO: figure out a smarter way to get the dependency from the array
//  maybe save the indices in a separate loop beforehand?
const getDependencyData = (components, fullPath) => components.find((component) => component.fullPath === fullPath);
exports.getDependencyData = getDependencyData;
const findDependencyUsages = (template, name) => {
    const { document } = new jsdom_1.JSDOM(template).window;
    let dependencyUsages = document.querySelectorAll(name);
    if (dependencyUsages.length === 0) {
        dependencyUsages = document.querySelectorAll(utils_1.kebabize(name));
    }
    return dependencyUsages;
};
exports.findDependencyUsages = findDependencyUsages;
//# sourceMappingURL=dependencies.js.map