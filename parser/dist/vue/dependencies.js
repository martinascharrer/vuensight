"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDependencies = exports.findDependencies = void 0;
const path_1 = require("path");
const dependency_cruiser_1 = require("dependency-cruiser");
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
//# sourceMappingURL=dependencies.js.map