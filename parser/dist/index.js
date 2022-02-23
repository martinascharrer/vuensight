"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const dependencies_1 = require("./dependencies");
const files_1 = require("./files");
const parser_1 = require("./parser");
const component_1 = require("./component");
const parse = async (directory) => {
    const paths = await files_1.getVueFilePaths(process.cwd());
    console.log(`Found ${paths.length} Vue components in total`);
    const modules = dependencies_1.findDependencies(paths, directory);
    if (!modules)
        return new Array();
    const components = await parser_1.getComponents(modules);
    const componentsFullyAnalyzed = parser_1.getFullyAnalyzedComponents(components);
    componentsFullyAnalyzed.forEach((component) => {
        component_1.printComponent(component);
        component_1.printDependencies(component, components);
    });
    console.log(`Parsed ${components.length} Vue components`);
    return componentsFullyAnalyzed;
};
exports.parse = parse;
//# sourceMappingURL=index.js.map