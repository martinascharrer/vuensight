#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const dist_1 = require("@vue-component-insight/server/dist");
commander_1.program
    .description('Vue Component Insight CLI')
    .option('-d, --dir [dir]', 'specify the directory that should be analyzed', 'src')
    .option('-wpc, --webpack-config [webpackConfig]', 'path to webpack config file')
    .option('-tsc, --ts-config [tsConfig]', 'path to TypeScript config file')
    .parse();
const dir = commander_1.program.opts().dir;
const webpackConfig = commander_1.program.opts().webpackConfig;
const tsConfig = commander_1.program.opts().tsConfig;
const init = async () => {
    try {
        await (0, dist_1.startServer)(dir, webpackConfig, tsConfig);
    }
    catch (e) {
        console.error('Something went wrong parsing the project', e);
    }
};
init();
//# sourceMappingURL=index.js.map