"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const dependencies_1 = require("./dependencies");
const files_1 = require("./files");
const parser_1 = require("./parser");
const component_1 = require("./component");
(async () => {
    const paths = await files_1.getVueFilePaths(process.cwd());
    console.log(`Found ${paths.length} Vue components`);
    const cruiseResult = dependencies_1.cruiseComponents(paths);
    if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
        const components = [];
        cruiseResult.output.modules.forEach((module) => {
            const pathNormalized = path_1.normalize(module.source);
            const fileContent = fs_1.readFileSync(pathNormalized, { encoding: 'utf-8' });
            const fileName = files_1.getFileNameFromPath(pathNormalized);
            const [name, fileType] = fileName.split('.');
            const dependencies = dependencies_1.formatDependencies(module.dependencies);
            const component = {
                name,
                fullPath: pathNormalized,
                fileContent,
                fileName,
                fileType,
                props: [],
                events: [],
                slots: [],
                dependencies,
            };
            parser_1.parseComponent(component);
            components.push(component);
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
})();
//# sourceMappingURL=index.js.map