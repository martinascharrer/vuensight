#!/usr/bin/env node

import { program } from 'commander';
import { startServer } from '@vue-component-insight/server/dist';

program
    .description('Vue Component Insight CLI')
    .option('--dir [dir]', 'specify the directory that should be analyzed', 'src')
    .parse();

const dir = program.opts().dir;

const init = async () => {
  try {
    await startServer(dir);
  } catch (e) {
    console.error('Something went wrong parsing the project', e);
  }
};

init();

