"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsedChannels = exports.isSlotUsed = exports.isEventUsed = exports.isPropUsed = exports.findCommunicationChannels = void 0;
const vue_docgen_api_1 = require("vue-docgen-api");
const utils_1 = require("./utils");
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
        console.error('Something went wrong while parsing the components.', e);
    }
    return communicationChannels;
};
exports.findCommunicationChannels = findCommunicationChannels;
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
//# sourceMappingURL=parser.js.map