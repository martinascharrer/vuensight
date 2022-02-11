import { JSDOM } from 'jsdom';

import { isPropUsed, isEventUsed, isSlotUsed, getUsedChannels } from './parser';

const createComponent = (template: string) => {
    const { document } = new JSDOM(template).window;
    return document.querySelector('ComponentName');
};

describe('parser', () => {
    describe('isPropUsed', () => {
        it('should find the prop in kebab syntax', () => {
            const prop = { name: 'TestProp', type: { name: 'String' }, default: 'Test', required: false };
            const element = createComponent(`<ComponentName test-prop="foo"/>`);

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the prop in kebab syntax when it is bound to data', () => {
            const prop = { name: 'TestProp', type: { name: 'String' }, default: 'Test', required: false };
            const element = createComponent(`<ComponentName :test-prop="foo"/>`);

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the prop in camel-case syntax', () => {
            const prop = { name: 'TestProp', type: { name: 'String' }, default: 'Test', required: false };
            const element = createComponent(`<ComponentName TestProp="foo"/>`);

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the prop in camel-case syntax when it is bound to data', () => {
            const prop = { name: 'TestProp', type: { name: 'String' }, default: 'Test', required: false };
            const element = createComponent(`<ComponentName :TestProp="foo"/>`);

            const isUsed = element ? isPropUsed(element, prop) : false;
            expect(isUsed).toBe(true);
        });
    });

    describe('isEventUsed', () => {
        it('should find the event when the `@` syntax is used', () => {
            const event = { name: 'test-event', isSync: false };
            const element = createComponent(`<ComponentName @test-event="foo"/>`);

            const isUsed = element ? isEventUsed(element, event) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the event when the `v-on:` syntax is used', () => {
            const event = { name: 'test-event', isSync: false };
            const element = createComponent(`<ComponentName v-on:test-event="foo"/>`);

            const isUsed = element ? isEventUsed(element, event) : false;
            expect(isUsed).toBe(true);
        });

        it('should not find the event when it is not used', () => {
            const event = { name: 'test-event', isSync: false };
            const element = createComponent(`<ComponentName v-on:other-event="foo"/>`);

            const isUsed = element ? isEventUsed(element, event) : false;
            expect(isUsed).toBe(false);
        });
    });

    describe('isSlotUsed', () => {
        it('should find the slot when the `#` syntax is used', () => {
            const slot = { name: 'header' };
            const element = createComponent(
                `<ComponentName @test-event="foo"><template #header>Headline</template></ComponentName>`
            );

            const isUsed = element ? isSlotUsed(element, slot) : false;
            expect(isUsed).toBe(true);
        });

        it('should find the slot when the `v-slot` syntax is used', () => {
            const slot = { name: 'header' };
            const element = createComponent(
                `<ComponentName @test-event="foo"><template v-slot:header>Headline</template></ComponentName>`
            );

            const isUsed = element ? isSlotUsed(element, slot) : false;
            expect(isUsed).toBe(true);
        });

        it('should not find the slot when it is not used', () => {
            const slot = { name: 'header' };
            const element = createComponent(
                `<ComponentName @test-event="foo">Headline</ComponentName>`
            );

            const isUsed = element ? isSlotUsed(element, slot) : true;
            expect(isUsed).toBe(false);
        });
    });

    describe('getUsedChannel', () => {
        it('should return the indices of the used events when they are used once', () => {
            const events = [{ name: 'test-event', isSync: false }, { name: 'test-event2' }, ];
            const element = createComponent(`<ComponentName @test-event="foo"/>`);

            const usedEvents = element ? getUsedChannels([element], events, isEventUsed) : false;
            expect(usedEvents).toStrictEqual([0]);
        });

        it('should return the index of the used events once when they are used multiple times', () => {
            const events = [{ name: 'test-event', isSync: false }, { name: 'TestEventTwo' }, ];
            const element = createComponent(
        `<ComponentName @TestEventTwo="foo"/>
                 <ComponentName @TestEventTwo="foo"/>
                 <ComponentName @TestEventTwo="foo"/>`
            );
            const usedEvents = element ? getUsedChannels([element], events, isEventUsed) : false;
            expect(usedEvents).toStrictEqual([1]);
        });

        it('should return an empty array when the event is not used', () => {
            const events = [{ name: 'test-event', isSync: false }, { name: 'TestEventTwo' }, ];
            const element = createComponent(`<ComponentName />`);
            const usedEvents = element ? getUsedChannels([element], events, isEventUsed) : false;
            expect(usedEvents).toStrictEqual([]);
        });
    });
});
