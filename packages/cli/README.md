# @vuensight/cli
This is the actual command line interface.

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
## Development
Compile typescript files to `dist` folder
```
npm run build
```

Run eslint
```
npm run lint
```

## Licencse
[MIT](LICENSE.txt)