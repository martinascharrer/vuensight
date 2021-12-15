import { readFileSync } from 'fs';
import { normalize } from 'path';
import { parse } from 'vue-eslint-parser';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { ESLintProgram } from 'vue-eslint-parser/ast/nodes';

import { getProps } from './analyzer';
import { formatDependencies, cruiseComponents } from './dependencies';
import { getFileNameFromPath, getVueFilePaths } from './files';
import { VueComponent } from '../types/index.d';

const parserOption = {
  ecmaVersion: 2018,
  sourceType: 'module',
};

(async () => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components`);

  const cruiseResult = cruiseComponents(paths);
  if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
    const components: VueComponent[] = [];
    cruiseResult.output.modules.forEach((module) => {
      const pathNormalized = normalize(module.source);
      const file = readFileSync(pathNormalized, { encoding: 'utf-8' });
      const fileName = getFileNameFromPath(pathNormalized);
      const esLintProgram: ESLintProgram = parse(file, parserOption);
      const props = esLintProgram.tokens ? getProps(esLintProgram.tokens) : null;
      const dependencies = formatDependencies(module.dependencies);

      components.push({
        fullPath: pathNormalized,
        file,
        fileName,
        props,
        events: [],
        dependencies,
      });
      console.log('component: ', fileName, ', props: ', props, 'dependencies: ', dependencies);
    });

    console.log(`Parsed ${components.length} Vue components`);
  }
})();
