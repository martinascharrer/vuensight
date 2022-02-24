"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCommunicationChannelUsage = exports.analyzeComponents = exports.findComponentData = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const files_1 = require("../utils/files");
const template_1 = require("../utils/template");
const dependencies_1 = require("./dependencies");
const communication_channels_1 = require("./communication-channels");
const findComponentData = (components, fullPath) => components.find((component) => component.fullPath === fullPath);
exports.findComponentData = findComponentData;
const analyzeComponents = async (modules) => {
    return await Promise.all(modules.map(async (module) => {
        const fullPath = path_1.normalize(module.source);
        const fileName = files_1.getFileNameFromPath(fullPath);
        const [name, fileType] = fileName.split('.');
        const fileContent = fs_1.readFileSync(fullPath, { encoding: 'utf-8' });
        const dependencies = dependencies_1.formatDependencies(module.dependencies);
        const { props, events, slots } = await communication_channels_1.findCommunicationChannels(fullPath);
        return {
            name,
            fullPath,
            fileContent,
            fileName,
            fileType,
            props: props ?? [],
            events: events ?? [],
            slots: slots ??
                [],
            dependencies,
        };
    }));
};
exports.analyzeComponents = analyzeComponents;
const analyzeCommunicationChannelUsage = (components) => {
    return components.map((component) => {
        const dependencies = component.dependencies.map((dependency) => {
            const dependencyData = exports.findComponentData(components, dependency.fullPath);
            if (dependencyData && dependencyData.fileType === 'vue') {
                const template = template_1.getTemplateContent(component.fileContent);
                if (template)
                    return communication_channels_1.getDependencyWithUsedChannelsAnalysis(template, dependencyData);
            }
            return dependency;
        });
        return {
            ...component,
            dependencies,
        };
    });
};
exports.analyzeCommunicationChannelUsage = analyzeCommunicationChannelUsage;
//# sourceMappingURL=parser.js.map