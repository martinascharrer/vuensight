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
    const modules = dependencies_1.findDependencies(paths, directory);
    const components = [];
    if (!modules)
        return components;
    await Promise.all(modules.map(async (module) => {
        const fullPath = path_1.normalize(module.source);
        const fileName = files_1.getFileNameFromPath(fullPath);
        const [name, fileType] = fileName.split('.');
        if (fileType !== 'vue')
            return;
        const fileContent = fs_1.readFileSync(fullPath, { encoding: 'utf-8' });
        const dependencies = dependencies_1.formatDependencies(module.dependencies);
        const { props, events, slots } = await parser_1.findCommunicationChannels(fullPath);
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
    }));
    components.forEach((component) => {
        component.dependencies.forEach((dependency) => {
            const dependencyData = dependencies_1.getDependencyData(components, dependency.fullPath);
            if (dependencyData && dependencyData.fileType === 'vue') {
                const template = files_1.getTemplate(component.fileContent);
                if (template) {
                    const dependencyInstances = dependencies_1.findDependencyInstances(template, dependencyData.name);
                    const isDependencyUsed = dependencyInstances.length > 0;
                    if (isDependencyUsed) {
                        dependency.usedProps = parser_1.getUsedChannels(dependencyInstances, dependencyData.props, parser_1.isPropUsed);
                        dependency.usedEvents = parser_1.getUsedChannels(dependencyInstances, dependencyData.events, parser_1.isEventUsed);
                        dependency.usedSlots = parser_1.getUsedChannels(dependencyInstances, dependencyData.slots, parser_1.isSlotUsed);
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
    return components;
};
exports.parse = parse;
//# sourceMappingURL=index.js.map