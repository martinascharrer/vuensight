export const findTemplate = (fileContent: string): string | null => {
  const templateBody = fileContent.match(/(?<template><template>[\s\S]*<\/template>)/u);
  return templateBody?.groups?.template || null;
};

export const getTemplateContent = (fileContent: string): string | null => {
  const template = findTemplate(fileContent);
  // remove <template> and </template> tags at the beginning and the end
  return template ? template.substring(10, template.length - 11) : null;
};

export const extractScriptContent = (fileContent: string): string => {
  const scriptStartString = '<script>';
  const scriptStart = fileContent.search(scriptStartString);
  const scriptEnd = fileContent.search('</script>');
  return fileContent.slice(scriptStart + scriptStartString.length, scriptEnd);
};

export const getComponentImportName = (fileContent: string, fileName: string) => {
  const script = extractScriptContent(fileContent);
  let name: string | null = null;
  script.split(/\r?\n/).forEach((line: string) =>  {
    if (line.includes('import') && line.includes(`/${fileName}`)) name = line.split(' ')[1];
  });
  return name;
};
