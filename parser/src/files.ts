import { glob } from 'glob';
import { promisify } from 'util';

export const getVueFilePaths = (src: string): Promise<string[]> => {
  const globPromisified = promisify(glob);
  return globPromisified(`${src}/**/*.vue`, {
    ignore: '**/node_modules/**',
  });
};

export const getFileNameFromPath = (path: string): string => {
  const lastDirectoryIndex = path.lastIndexOf('\\') !== -1 ? path.lastIndexOf('\\') : path.lastIndexOf('/');
  return path.substring(lastDirectoryIndex + 1, path.length);
};

export const getTemplate = (fileContent: string): string | null => {
  const templateBody = fileContent.match(/(?<template><template>[\s\S]*<\/template>)/u);
  const template = templateBody?.groups?.template || null;

  // remove <template> and </template> tags at the beginning and the end
  return template ? template.substring(11, template.length - 12) : null;
};
