#! /usr/bin/env node

// script that runs when using the cli command `vci`
(async function main() {
  try {
    // eslint-disable-next-line import/extensions,global-require
    require('../dist/index.js');
  } catch (err) {
    console.log(err);
  }
}());
