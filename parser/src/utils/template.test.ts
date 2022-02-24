import { findTemplate, getTemplateContent } from './template';

const TEST_FILE = '<template>Hello</template><script>const foo = 3;</script><style></style>';
const TEST_FILE_WITHOUT_TEMPLATE = '<script>const foo = 3;</script><style></style>';

describe('template', () => {
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
});
