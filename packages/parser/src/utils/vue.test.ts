import {
  extractScriptContent,
  findTemplate,
  getComponentImportName,
  getTemplateContent
} from './vue';

const TEST_FILE = '<template>Hello</template><script>const foo = 3;</script><style></style>';
const TEST_FILE_WITHOUT_TEMPLATE = '<script>const foo = 3;</script><style></style>';

const makeTestFileWithScript = (script: string) => `
<template><div>Test File</div></template>
<script>${script}</script>
<style>div { color: red; }</style>
`;

describe('vue', () => {
  describe('findTemplate', () => {
    it('should find the template string in the file', () => {
      expect(findTemplate(TEST_FILE)).toBe('<template>Hello</template>');
    });

    it('should not find the template string in the file when there is none', () => {
      expect(findTemplate(TEST_FILE_WITHOUT_TEMPLATE)).toBe(null);
    });
  });

  describe('getTemplateContent', () => {
    it('should return the content of the template without the template tag', () => {
      expect(getTemplateContent(TEST_FILE)).toBe('Hello');
    });

    it('should return null when there is no template', () => {
      expect(getTemplateContent(TEST_FILE_WITHOUT_TEMPLATE)).toBe(null);
    });
  });

  describe('extractScriptContent', () => {
    it('should extract the script content from the given file', () => {
      const script = `const test = 3`;
      const testFile = makeTestFileWithScript(script);

      expect(extractScriptContent(testFile)).toBe(script);
    });
  });

  describe('getComponentImportName', () => {
    it('should find the import name of a component in a js script', () => {
      const script = `import Button from '@/components/base/BaseButton';`;
      const testFile = makeTestFileWithScript(script);

      expect(getComponentImportName(testFile, 'BaseButton')).toBe('Button');
    });

    it('should not find the import name of a component if it is not imported', () => {
      const script = `import Test from '@/components/base/Test';`;
      const testFile = makeTestFileWithScript(script);

      expect(getComponentImportName(testFile, 'BaseButton')).toBe(null);
    });
  });
});
