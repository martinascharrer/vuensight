"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const dependencies_1 = require("./vue/dependencies");
const files_1 = require("./utils/files");
const parser_1 = require("./vue/parser");
const parse = async (directory, fileType = 'vue') => {
    const paths = await files_1.getFilePathsByType(process.cwd(), fileType);
    const modules = dependencies_1.findDependencies(paths, directory);
    if (!modules)
        return new Array();
    const components = await parser_1.analyzeComponents(modules);
    return parser_1.analyzeCommunicationChannelUsage(components);
};
exports.parse = parse;
//# sourceMappingURL=index.js.map