# vue-component-insight
`vue-component-insight` is a cli tool for parsing and visualizing Vue.js projects. The ultimate goal is to visualize the components 
communication e.g. their props, events and slots in an interactive web app. **This project is currently a work in progress!**

## Disclamer
This project is in development - bugs and uninentended behaviour may occur! Stay tuned for updates.

## Getting started
There is no readily distributed npm-version of this package **yet**. If you want to try it out anyway, clone the repository and install all
dependencies in the parser, server and cli package (e.g. `cd parser` + `npm ci`). Afterwards call `npm link` in the cli package
and `npm link @vue-component-insight/cli` in the Vue.js project you want to analyze.

Use the cli command `vinsight` to start the tool. It is also possible to specifiy the root directory for parsing: `vinsight --dir exampleDir`.
