#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
commander_1.program
    .description('React Bratus CLI')
    .option('--dir [dir]', 'specify the directory that should be analyzed', 'src')
    .parse();
var dir = commander_1.program.opts().dir;
console.log(dir, 'HELLO!');
