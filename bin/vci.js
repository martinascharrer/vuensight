#! /usr/bin/env node
(function main() {
  try {
    // eslint-disable-next-line global-require
    require('../src/index');
  } catch (err) {
    console.log('error');
  }
}());
