import { parse } from '../src';
import { normalize } from 'path';

describe('parse', () => {
    it('should return data about dependencies and communication channels when parsing a Vue project', async () => {
        const expectedParseResult = [{
            name: 'Child',
            fullPath: normalize('test/project/Child.vue'),
            fileName: 'Child.vue',
            fileType: 'vue',
            fileContent: expect.any(String),
            events: [{ name: 'selected' }],
            props: [{
                name: 'title',
                type: {
                    name: 'string'
                },
                default: "'Hello'",
                defaultValue: {
                    func: false,
                    value: "'Hello'"
                }
            }],
            slots: [{ name: 'header' }],
            dependencies: [],
            dependents: [{
                fullPath: normalize('test/project/Parent.vue'),
                name: "Parent",
                usedProps: [0],
                usedEvents: [0],
                usedSlots: [0],
            }],
        }, {
            name: 'Parent',
            fullPath: normalize('test/project/Parent.vue'),
            fileName: 'Parent.vue',
            fileType: 'vue',
            events: [],
            props: [],
            slots: [],
            fileContent: expect.any(String),
            dependencies: [{
                fullPath: normalize('test/project/Child.vue'),

            }],
            dependents: [],
        }];
        const parseResult = await parse('test/project');

        expect(parseResult).toEqual(expectedParseResult);
    });
});
