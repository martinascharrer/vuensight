import { kebabize } from './kababize';

describe('kebabize', () => {
  it('should convert the string to kebab-style', () => {
    expect(kebabize('FooBar')).toBe('foo-bar');
  });
});
