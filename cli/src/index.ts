#!/usr/bin/env node

import { program } from 'commander';

program
    .description('React Bratus CLI')
    .option('--dir [dir]', 'specify the directory that should be analyzed', 'src')
    .parse();

const dir = program.opts().dir;

console.log(dir, 'HELLO!');
