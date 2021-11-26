import { readdirSync, readFileSync } from 'fs';
import { parse } from 'vue-eslint-parser';
import { ESLintProgram } from 'vue-eslint-parser/ast/nodes';
import Parser from './Parser';
import { getImportDeclaration, getProps } from './analyzer';

const parserOption = {
  ecmaVersion: 2018,
  sourceType: 'module',
};

(() => {
  Parser.parse();
  const BASE_DIR = 'C:\\Users\\marti\\Documents\\FH\\Master\\3-semester\\Master Thesis\\vue-component-insight\\src\\';
  const files = readdirSync(BASE_DIR);
  const file = readFileSync(BASE_DIR + files[0], { encoding: 'utf-8' });

  // using vue-eslint-parser package.
  const esLintProgram: ESLintProgram = parse(file, parserOption);
  if (esLintProgram.tokens) {
    const props = getProps(esLintProgram.tokens);
    console.log(props);
  }

  const imports = getImportDeclaration(esLintProgram.body);
  console.log(imports);
})();
