# vuensight
This tool is for parsing and visualizing Vue.js projects. The ultimate goal is to visualize the components 
communication e.g. their props, events and slots in an interactive web app.

This tool is built on top of two awesome packages:
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) for building the dependency tree 
- [vue-docgen-api](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-docgen-api) for parsing the Vue files

## Getting started
First install the cli tool locally in the project you want to visualize:
```
npm i -D @vue-dependency-insight/cli
```

Or globally on your machine if you plan to visualize multiple projects:
```
npm i -g @vue-dependency-insight/cli
```

Then run the tool in your project folder:
```
vuensight
```
or:
```
npx vuensight
```


## Options
- `--dir` or `-d` (optional): Specify the directory that should be parsed relative from your current working directory, default is `src`
- `--webpack-config` or `-wpc` (optional): Specify the path to your webpack-config (from your current working directory). This is particularly important if you use aliases.
- `--ts-config` or `-tsc` (optional): Specify the path to your TypeScript config file (from your current working directory).

An example:
```
vuensight --dir resources/js --webpack-config ./webpack-config.json --ts-config ./tsconfig.json
```

## Licencse
[MIT](LICENSE.txt)


## Development
### Requirements
- `npm version >= 7` (the project is a monorepo and uses npm workspaces which require at least npm version 7)  

### Installing dependencies
- `npm i` (in root directory) to install all dependencies of all packages
- `npm i <package-name>` to add a global dependency for all packages 
- `npm i <package-name> --workspace @vuensight/<vuensight-package-name>` to add a new dependency to a specific package

### Build packages
- `npm run build` in root folder (to build all packages at the same time)
- `npm run build` in each package

### Build watcher
- `npm run build:watch` in every package separately 

### Unit tests
- `npm run test` in root (to run tests for all packages)
- `npm run test` in each package

### Publish
- `npm publish` in each package