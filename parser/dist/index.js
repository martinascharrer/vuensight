"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const dependencies_1 = require("./dependencies");
const files_1 = require("./files");
const parser_1 = require("./parser");
const component_1 = require("./component");
const parse = async (directory) => {
    const paths = await files_1.getVueFilePaths(process.cwd());
    console.log(`Found ${paths.length} Vue components in total`);
    const cruiseResult = dependencies_1.cruiseComponents(paths, directory);
    const components = [];
    if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
        cruiseResult.output.modules.forEach((module) => {
            const fullPath = path_1.normalize(module.source);
            const fileName = files_1.getFileNameFromPath(fullPath);
            const [name, fileType] = fileName.split('.');
            if (fileType !== 'vue')
                return;
            const fileContent = fs_1.readFileSync(fullPath, { encoding: 'utf-8' });
            const dependencies = dependencies_1.formatDependencies(module.dependencies);
            const { props, events, slots } = parser_1.findCommunicationChannels(fileContent);
            components.push({
                name,
                fullPath,
                fileContent,
                fileName,
                fileType,
                props,
                events,
                slots,
                dependencies,
            });
        });
        components.forEach((component) => {
            component.dependencies.forEach((dependency) => {
                const dependencyData = dependencies_1.getDependencyData(components, dependency.fullPath);
                if (dependencyData && dependencyData.fileType === 'vue') {
                    const template = files_1.getTemplate(component.fileContent);
                    if (template) {
                        const dependencyUsages = dependencies_1.findDependencyUsages(template, dependencyData.name);
                        const isDependencyUsed = dependencyUsages.length > 0;
                        if (isDependencyUsed) {
                            dependencyData.props.forEach((prop, propIndex) => {
                                dependencyUsages.forEach((dependencyUsage) => {
                                    const isIndexIncluded = dependency.usedProps.includes(propIndex);
                                    if (parser_1.isPropUsed(dependencyUsage, prop) && !isIndexIncluded) {
                                        dependency.usedProps.push(propIndex);
                                    }
                                });
                            });
                            dependencyData.events.forEach((event, eventIndex) => {
                                dependencyUsages.forEach((dependencyUsage) => {
                                    const isIndexIncluded = dependency.usedEvents.includes(eventIndex);
                                    if (parser_1.isEventUsed(dependencyUsage, event) && !isIndexIncluded) {
                                        dependency.usedEvents.push(eventIndex);
                                    }
                                });
                            });
                        }
                    }
                }
            });
        });
        components.forEach((component) => {
            component_1.printComponent(component);
            component_1.printDependencies(component, components);
        });
        console.log(`Parsed ${components.length} Vue components`);
    }
    return components;
};
exports.parse = parse;
//# sourceMappingURL=index.js.map