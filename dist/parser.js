"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseComponent = void 0;
const parser_1 = require("@vuese/parser");
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
exports.default = {
    parseComponent: exports.parseComponent,
};
//# sourceMappingURL=parser.js.map