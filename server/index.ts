import { readFileSync } from 'fs';
import { normalize } from 'path';
import { parse } from 'vue-eslint-parser';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { ESLintProgram } from 'vue-eslint-parser/ast/nodes';
import {
  cruise, IReporterOutput, ICruiseOptions, IDependency,
} from 'dependency-cruiser';

import { getProps } from './analyzer';
import { getFileNameFromPath, getVueFilePaths } from './files';

const parserOption = {
  ecmaVersion: 2018,
  sourceType: 'module',
};

type VueComponent = {
  fullPath: string,
  fileName: string,
  file: string,
  props: string | null,
  dependencies: IDependency[],
}

const DEPCRUISE_OPTIONS: ICruiseOptions = {
  includeOnly: 'src',
};

const cruiseComponents = (components: string[]):IReporterOutput | null => {
  let cruiseResult: IReporterOutput | null = null;
  try {
    cruiseResult = cruise(
      components,
      DEPCRUISE_OPTIONS,
    );
  } catch (error) {
    console.error(error);
  }
  return cruiseResult;
};

(async () => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components`);

  const cruiseResult = cruiseComponents(paths);
  if (cruiseResult && 'modules' in cruiseResult.output) {
    const components: VueComponent[] = [];
    cruiseResult.output.modules.forEach((module) => {
      const pathNormalized = normalize(module.source);
      const file = readFileSync(pathNormalized, { encoding: 'utf-8' });
      const fileName = getFileNameFromPath(pathNormalized);
      const esLintProgram: ESLintProgram = parse(file, parserOption);
      const props = esLintProgram.tokens ? getProps(esLintProgram.tokens) : null;

      components.push({
        fullPath: pathNormalized,
        file,
        fileName,
        props,
        dependencies: module.dependencies,
      });
      console.log('component: ', fileName, ', props: ', props, 'deps: ', module.dependencies.length);
    });

    console.log(`Parsed ${components.length} Vue components`);
  }
})();
