"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNameFromPath = exports.getFilePathsByType = void 0;
const glob_1 = require("glob");
const util_1 = require("util");
const getFilePathsByType = (src, fileType) => {
    const globPromisified = util_1.promisify(glob_1.glob);
    return globPromisified(`${src}/**/*.${fileType}`, {
        ignore: '**/node_modules/**',
    });
};
exports.getFilePathsByType = getFilePathsByType;
const getFileNameFromPath = (path) => {
    const lastDirectoryIndex = path.lastIndexOf('\\') !== -1 ? path.lastIndexOf('\\') : path.lastIndexOf('/');
    return path.substring(lastDirectoryIndex + 1, path.length);
};
exports.getFileNameFromPath = getFileNameFromPath;
//# sourceMappingURL=files.js.map