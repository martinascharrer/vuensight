import { glob } from 'glob';
import { promisify } from 'util';

export const getFilePathsByType = (src: string, fileType: string): Promise<string[]> => {
  const globPromisified = promisify(glob);
  return globPromisified(`${src}/**/*.${fileType}`, {
    ignore: '**/node_modules/**',
  });
};

export const getFileNameFromPath = (path: string): string => {
  const lastDirectoryIndex = path.lastIndexOf('\\') !== -1 ? path.lastIndexOf('\\') : path.lastIndexOf('/');
  return path.substring(lastDirectoryIndex + 1, path.length);
};
