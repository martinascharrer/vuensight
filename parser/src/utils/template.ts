export const findTemplate = (fileContent: string): string | null => {
  const templateBody = fileContent.match(/(?<template><template>[\s\S]*<\/template>)/u);
  return templateBody?.groups?.template || null;
};

export const getTemplateContent = (fileContent: string): string | null => {
  const template = findTemplate(fileContent);
  // remove <template> and </template> tags at the beginning and the end
  return template ? template.substring(10, template.length - 11) : null;
};
