"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEventUsed = exports.isPropUsed = exports.findCommunicationChannels = void 0;
const parser_1 = require("@vuese/parser");
const utils_1 = require("./utils");
const findCommunicationChannels = (fileContent) => {
    const communicationChannels = { props: [], events: [], slots: [] };
    try {
        const { props, events, slots } = parser_1.parser(fileContent);
        if (props)
            communicationChannels.props = props;
        if (events)
            communicationChannels.events = events;
        if (slots)
            communicationChannels.slots = slots;
    }
    catch (e) {
        console.error('Error parsing components with vuese.', e);
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
    eventFormat.forEach((format) => {
        if (!isUsed)
            isUsed = Boolean(template.attributes.getNamedItem(format));
    });
    return isUsed;
};
exports.isEventUsed = isEventUsed;
//# sourceMappingURL=parser.js.map