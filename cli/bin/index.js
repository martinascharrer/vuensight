#! /usr/bin/env node

// script that runs when using the cli command `vci`
(async function main() {
  try {
    // eslint-disable-next-line import/extensions,global-require
    require('../../parser/dist'); // TODO: refactor this  - remove global require and include the parser package instead
  } catch (err) {
    console.log(err);
  }
}());
