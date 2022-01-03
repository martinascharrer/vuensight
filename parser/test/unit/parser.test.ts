import { JSDOM } from 'jsdom';

import { isPropUsed, isEventUsed } from '../../src/parser';

const createComponent = (attribute: string) => {
    const { document } = new JSDOM(`<ComponentName ${attribute}="foo"/>`).window;
    const element = document.querySelector('ComponentName');
    return element;
}

describe('parser', () => {
    describe('isPropUsed', () => {
        it('should find the prop in kebab syntax', () => {
            const prop = { name: 'TestProp', type: 'String', default: 'Test', required: false };
            const element = createComponent('test-prop');

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the prop in kebab syntax when it is bound to data', () => {
            const prop = { name: 'TestProp', type: 'String', default: 'Test', required: false };
            const element = createComponent(':test-prop');

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the prop in camel-case syntax', () => {
            const prop = { name: 'TestProp', type: 'String', default: 'Test', required: false };
            const element = createComponent('TestProp');

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the prop in camel-case syntax when it is bound to data', () => {
            const prop = { name: 'TestProp', type: 'String', default: 'Test', required: false };
            const element = createComponent(':TestProp');

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });
    });

    describe('isEventUsed', () => {
        it('should find the event when the `@` syntax is used', () => {
            const event = { name: 'test-event', isSync: false };
            const element = createComponent('@test-event');

            const isUsed = element ? isEventUsed(element, event) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the event when the `v-on:` syntax is used', () => {
            const event = { name: 'test-event', isSync: false };
            const element = createComponent('v-on:test-event');

            const isUsed = element ? isEventUsed(element, event) : false;
            expect(isUsed).toBe(true);
        });

        it('should not find the event when it is not used', () => {
            const event = { name: 'test-event', isSync: false };
            const element = createComponent('v-on:other-event');

            const isUsed = element ? isEventUsed(element, event) : false;
            expect(isUsed).toBe(false);
        });
    });
});