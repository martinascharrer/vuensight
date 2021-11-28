import { readFileSync } from 'fs';
import { normalize } from 'path';
import { parse } from 'vue-eslint-parser';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { ESLintProgram } from 'vue-eslint-parser/ast/nodes';

import { getProps } from './analyzer';
import { getVueFilePaths } from './files';

const parserOption = {
  ecmaVersion: 2018,
  sourceType: 'module',
};

type VueComponent = {
  fullPath: string,
  fileName: string,
  file: string,
  props: string | null,
}

(async () => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components`);

  const components: VueComponent[] = [];
  paths.forEach((path: string) => {
    const pathNormalized = normalize(path);
    const file = readFileSync(pathNormalized, { encoding: 'utf-8' });
    const fileName = pathNormalized.replace(normalize(process.cwd()), '');
    const esLintProgram: ESLintProgram = parse(file, parserOption);
    const props = esLintProgram.tokens ? getProps(esLintProgram.tokens) : null;

    components.push({
      fullPath: pathNormalized,
      file,
      fileName,
      props,
    });

    console.log('component: ', fileName, ', props: ', props);
  });
  console.log(`Parsed ${components.length} Vue components`);
})();
