#!/usr/bin/env node

import { program } from 'commander';
import { parse } from '@vue-component-insight/parser/dist';

program
    .description('Vue Component Insight CLI')
    .option('--dir [dir]', 'specify the directory that should be analyzed', 'src')
    .parse();

const dir = program.opts().dir;

const init = async () => {
  try {
    await parse(dir);
  } catch (e) {
    console.error('Something went wrong parsing the project', e);
  }
};

init();

