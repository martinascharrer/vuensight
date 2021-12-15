import { readFileSync } from 'fs';
import { normalize } from 'path';

import { VueComponent } from '../types/index.d';

import { formatDependencies, cruiseComponents } from './dependencies';
import { getFileNameFromPath, getVueFilePaths } from './files';
import { parseComponent } from './parser';

(async () => {
  const paths = await getVueFilePaths(process.cwd());
  console.log(`Found ${paths.length} Vue components`);

  const cruiseResult = cruiseComponents(paths);
  if (cruiseResult && typeof cruiseResult.output !== 'string' && 'modules' in cruiseResult.output) {
    const components: VueComponent[] = [];
    cruiseResult.output.modules.forEach((module) => {
      const pathNormalized = normalize(module.source);
      const fileContent = readFileSync(pathNormalized, { encoding: 'utf-8' });
      const fileName = getFileNameFromPath(pathNormalized);
      const dependencies = formatDependencies(module.dependencies);

      components.push({
        fullPath: pathNormalized,
        fileContent,
        fileName,
        props: [],
        events: [],
        slots: [],
        dependencies,
      });
    });

    components.forEach((component) => {
      parseComponent(component);
      console.log(
        'component: ', component.fileName,
        'props: ', component.props.length,
        'events: ', component.events.length,
        'slots: ', component.slots.length,
        'dependencies: ', component.dependencies.length,
      );
    });
    console.log(`Parsed ${components.length} Vue components`);
  }
})();
