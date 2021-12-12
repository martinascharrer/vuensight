import { glob } from 'glob';
import { promisify } from 'util';

export const getVueFilePaths = (src: string): Promise<string[]> => {
  const globPromisified = promisify(glob);
  return globPromisified(`${src}/**/*.vue`, {
    ignore: '**/node_modules/**',
  });
};

export const getFileNameFromPath = (path: string): string => path.substring(path.lastIndexOf('\\') + 1, path.length);

export default {
  getVueFilePaths,
};
