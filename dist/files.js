"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNameFromPath = exports.getVueFilePaths = void 0;
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
//# sourceMappingURL=files.js.map