# vuensight 👀
Visualize Vue.js **component relationships** and **communication channels**, i.e. props, events and slots. This tool operates on the
command line and is made for developers. The aim of vuensight is to provide visual insight into the components of a
Vue.js project and to support developers before and during refactoring, e.g. by visually analyzing which prop is used
in which parent component or by highlighting unused components or channels.

An example visualization of vuensight itself:
![demo image of vuensight](docs/vuensight-demo.png)

This tool is built on top of the two awesome packages:
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) for building the dependency tree
- [vue-docgen-api](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-docgen-api) for parsing the Vue files

## Getting started 🚀
### Install
First, install the cli package either locally in the project you want to visualize:
```
npm i -D @vuensight/cli
```

Or globally on your machine if you plan to visualize multiple projects:
```
npm i -g @vuensight/cli
```

### Run
Then run the tool in your project folder:
```
vuensight
```

#### Options
- `--dir` or `-d` (optional): Specify the directory that should be parsed relative from your current working directory, default is `src`
- `--port` or `-p` (optional): Start the application in a different port, default is 4444
- `--webpack-config` or `-wpc` (optional): Specify the path to your webpack-config (from your current working directory). This is particularly important if you use aliases.
- `--ts-config` or `-tsc` (optional): Specify the path to your TypeScript config file (from your current working directory).

An example usage:
```
vuensight --dir resources/js --port 9999 --webpack-config ./webpack-config.json --ts-config ./tsconfig.json
```

## Licencse
[MIT](LICENSE.txt)
