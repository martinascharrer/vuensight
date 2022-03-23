export const getFileNameFromPath = (path: string): string => {
  const lastDirectoryIndex = path.lastIndexOf('\\') !== -1 ? path.lastIndexOf('\\') : path.lastIndexOf('/');
  return path.substring(lastDirectoryIndex + 1, path.length);
};
