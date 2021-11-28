import { glob } from 'glob';
import { promisify } from 'util';

export const getVueFilePaths = (src: string): Promise<string[]> => {
  const globPromisified = promisify(glob);
  return globPromisified(`${src}/**/*.vue`, {
    ignore: '**/node_modules/**',
  });
};

export default {
  getVueFilePaths,
};
