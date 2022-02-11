import { kebabize } from './utils';

describe('utils', () => {
    describe('kebabize', () => {
        it('should convert the string to kebab-style', () => {
            expect(kebabize('FooBar')).toBe('foo-bar');
        });
    });
});