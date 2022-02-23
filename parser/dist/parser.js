"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullyAnalyzedComponents = exports.getDependencyWithUsedChannelsAnalysis = exports.getUsedChannels = exports.isSlotUsed = exports.isEventUsed = exports.isPropUsed = exports.getComponents = exports.findCommunicationChannels = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const vue_docgen_api_1 = require("vue-docgen-api");
const utils_1 = require("./utils");
const files_1 = require("./files");
const dependencies_1 = require("./dependencies");
const findCommunicationChannels = async (fileContent) => {
    const communicationChannels = { props: [], events: [], slots: [] };
    try {
        const { props, events, slots } = await vue_docgen_api_1.parse(fileContent);
        if (props)
            communicationChannels.props = props;
        if (events)
            communicationChannels.events = events;
        if (slots)
            communicationChannels.slots = slots;
    }
    catch (e) {
        console.log('HERE');
        console.error('Something went wrong while parsing the components.', e);
    }
    return communicationChannels;
};
exports.findCommunicationChannels = findCommunicationChannels;
const getComponents = async (modules) => {
    return await Promise.all(modules.map(async (module) => {
        const fullPath = path_1.normalize(module.source);
        const fileName = files_1.getFileNameFromPath(fullPath);
        const [name, fileType] = fileName.split('.');
        const fileContent = fs_1.readFileSync(fullPath, { encoding: 'utf-8' });
        const dependencies = dependencies_1.formatDependencies(module.dependencies);
        const { props, events, slots } = await exports.findCommunicationChannels(fullPath);
        return {
            name,
            fullPath,
            fileContent,
            fileName,
            fileType,
            props: props ?? [],
            events: events ?? [],
            slots: slots ?? [],
            dependencies,
        };
    }));
};
exports.getComponents = getComponents;
const isPropUsed = (template, prop) => {
    const propFormats = [prop.name, `:${prop.name}`, `:${utils_1.kebabize(prop.name)}`, utils_1.kebabize(prop.name)];
    let isUsed = false;
    propFormats.forEach((format) => {
        if (!isUsed)
            isUsed = Boolean(template.attributes.getNamedItem(format));
    });
    return isUsed;
};
exports.isPropUsed = isPropUsed;
const isEventUsed = (template, event) => {
    const eventFormat = [`@${event.name}`, `v-on:${event.name}`];
    let isUsed = false;
    eventFormat.forEach((format) => (isUsed = isUsed || Boolean(template.attributes.getNamedItem(format))));
    return isUsed;
};
exports.isEventUsed = isEventUsed;
const isSlotUsed = (template, slot) => {
    const slotFormat = [`#${slot.name}`, `v-slot:${slot.name}`];
    let isUsed = false;
    slotFormat.forEach((format) => (isUsed = isUsed || Boolean(template.innerHTML.includes(format))));
    return isUsed;
};
exports.isSlotUsed = isSlotUsed;
const getUsedChannels = (dependencyInstances, channels, validator) => {
    const usedChannels = new Set();
    channels.forEach((channel, index) => {
        dependencyInstances.forEach((dependencyUsage) => validator(dependencyUsage, channel) && usedChannels.add(index));
    });
    return [...usedChannels];
};
exports.getUsedChannels = getUsedChannels;
const getDependencyWithUsedChannelsAnalysis = (template, { name, fullPath, props, events, slots }) => {
    const dependencyInstances = dependencies_1.findDependencyInstances(template, name);
    return {
        fullPath,
        usedProps: exports.getUsedChannels(dependencyInstances, props, exports.isPropUsed),
        usedEvents: exports.getUsedChannels(dependencyInstances, events, exports.isEventUsed),
        usedSlots: exports.getUsedChannels(dependencyInstances, slots, exports.isSlotUsed)
    };
};
exports.getDependencyWithUsedChannelsAnalysis = getDependencyWithUsedChannelsAnalysis;
const getFullyAnalyzedComponents = (components) => {
    return components.map((component) => {
        const dependencies = component.dependencies.map((dependency) => {
            const dependencyData = dependencies_1.getComponentData(components, dependency.fullPath);
            if (dependencyData && dependencyData.fileType === 'vue') {
                const template = files_1.getTemplate(component.fileContent);
                if (template)
                    return exports.getDependencyWithUsedChannelsAnalysis(template, dependencyData);
            }
            return dependency;
        });
        return {
            ...component,
            dependencies,
        };
    });
};
exports.getFullyAnalyzedComponents = getFullyAnalyzedComponents;
//# sourceMappingURL=parser.js.map