"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const dependencies_1 = require("./dependencies");
const files_1 = require("./files");
const parser_1 = require("./parser");
(async () => {
    const paths = await files_1.getVueFilePaths(process.cwd());
    console.log(`Found ${paths.length} Vue components`);
    const cruiseResult = dependencies_1.cruiseComponents(paths);
    if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
        const components = [];
        cruiseResult.output.modules.forEach((module) => {
            const pathNormalized = path_1.normalize(module.source);
            const fileContent = fs_1.readFileSync(pathNormalized, { encoding: 'utf-8' });
            const fileName = files_1.getFileNameFromPath(pathNormalized);
            const dependencies = dependencies_1.formatDependencies(module.dependencies);
            components.push({
                fullPath: pathNormalized,
                fileContent,
                fileName,
                props: [],
                events: [],
                slots: [],
                dependencies,
            });
        });
        components.forEach((component) => {
            parser_1.parseComponent(component);
            console.log('component: ', component.fileName, 'props: ', component.props.length, 'events: ', component.events.length, 'slots: ', component.slots.length, 'dependencies: ', component.dependencies.length);
        });
        console.log(`Parsed ${components.length} Vue components`);
    }
})();
//# sourceMappingURL=index.js.map