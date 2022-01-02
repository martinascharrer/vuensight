"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplate = exports.getFileNameFromPath = exports.getVueFilePaths = void 0;
const glob_1 = require("glob");
const util_1 = require("util");
const getVueFilePaths = (src) => {
    const globPromisified = util_1.promisify(glob_1.glob);
    return globPromisified(`${src}/**/*.vue`, {
        ignore: '**/node_modules/**',
    });
};
exports.getVueFilePaths = getVueFilePaths;
const getFileNameFromPath = (path) => path.substring(path.lastIndexOf('\\') + 1, path.length);
exports.getFileNameFromPath = getFileNameFromPath;
const getTemplate = (fileContent) => {
    const templateBody = fileContent.match(/(?<template><template>[\s\S]*<\/template>)/u);
    const template = templateBody?.groups?.template || null;
    // remove <template> and </template> tags at the beginning and the end
    return template ? template.substring(11, template.length - 12) : null;
};
exports.getTemplate = getTemplate;
//# sourceMappingURL=files.js.map