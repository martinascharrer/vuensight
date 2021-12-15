"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDependencies = exports.cruiseComponents = void 0;
const dependency_cruiser_1 = require("dependency-cruiser");
const path_1 = require("path");
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
//# sourceMappingURL=dependencies.js.map