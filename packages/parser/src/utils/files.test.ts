import { getFileNameFromPath } from './files';

describe('files', () => {
  describe('getFileNameFromPath', () => {
    it('should extract the filename from the path', () => {
      expect(getFileNameFromPath('src/test/asdf/TestFile.vue')).toBe('TestFile.vue');
    });

    it('should extract the filename from the path', () => {
      expect(getFileNameFromPath('src\\test\\asdf\\TestFile.vue')).toBe('TestFile.vue');
    });
  });
});
