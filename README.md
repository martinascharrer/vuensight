# vue-component-insight
`vue-component-insight` is a cli tool for parsing and visualizing Vue.js projects. The ultimate goal is to visualize the components 
communication e.g. their props, events and slots in an interactive web app. **This project is currently a work in progress!**

## Disclamer
This project is in development - bugs and uninentended behaviour may occur! Stay tuned for updates.

## Getting started
There is no readily distributed npm-version of this package **yet**. If you want to try it out anyway, clone the repository and link the parser package to the cli by calling `npm link` in `/parser` and  `npm link @vue-component-insight/parser` in `/cli`. Install all
dependencies in the parser, server and cli package (e.g. `cd parser` + `npm ci`). Afterwards link the `/cli` package with `npm link` and use it in the Vue.js project you want to analyze with: `npm link @vue-component-insight/cli`.

Use the cli command `vinsight` to start the tool. It is also possible to specifiy the root directory for parsing (default is src): `vinsight --dir exampleDir`.
