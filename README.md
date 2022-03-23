# vue-component-insight
`vue-component-insight` is a cli tool for parsing and visualizing Vue.js projects. The ultimate goal is to visualize the components 
communication e.g. their props, events and slots in an interactive web app. **This project is currently a work in progress!**

## Disclamer
This project is in development - bugs and uninentended behaviour may occur! Stay tuned for updates.

## Getting started
Install with `npm i @vue-dependency-insight`
or globally with `npm i -g @vue-dependency-insight`

## Options
- `--dir`: specify the directory that should be parsed, default is `src`

## Development
This project is a monorepo and uses `npm workspaces` which require at least npm version 7.  

### Installing dependencies
`npm i` (in root directory)

### Build packages
all at the same time from the root directory:
`npm run build`

or every package on its own with: `npm run build` 

### Build watcher
in every package separately: `npm run build:watch` 

### Publish
