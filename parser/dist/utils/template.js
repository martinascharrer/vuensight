"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateContent = exports.findTemplate = void 0;
const findTemplate = (fileContent) => {
    const templateBody = fileContent.match(/(?<template><template>[\s\S]*<\/template>)/u);
    return templateBody?.groups?.template || null;
};
exports.findTemplate = findTemplate;
const getTemplateContent = (fileContent) => {
    const template = exports.findTemplate(fileContent);
    // remove <template> and </template> tags at the beginning and the end
    return template ? template.substring(10, template.length - 11) : null;
};
exports.getTemplateContent = getTemplateContent;
//# sourceMappingURL=template.js.map