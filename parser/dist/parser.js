"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPropUsed = exports.parseComponent = void 0;
const parser_1 = require("@vuese/parser");
const utils_1 = require("./utils");
const parseComponent = (component) => {
    try {
        parser_1.parser(component.fileContent, {
            onProp: (prop) => {
                component.props.push({
                    name: prop.name,
                    type: prop.type,
                    required: prop.required,
                    default: prop.default,
                });
            },
            onEvent: (event) => {
                component.events.push({
                    name: event.name,
                    isSync: event.isSync,
                });
            },
            onSlot: (slot) => {
                component.slots.push({
                    name: slot.name,
                });
            },
        });
    }
    catch (e) {
        console.error('Error parsing components with vuese.', e);
    }
};
exports.parseComponent = parseComponent;
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
//# sourceMappingURL=parser.js.map