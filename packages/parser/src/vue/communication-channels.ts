import { parse, PropDescriptor } from 'vue-docgen-api';
import { JSDOM } from 'jsdom';
import {Channel, Dependent, Event, Prop, Slot, VueComponent} from '@vuensight/types';

import { getComponentImportName } from '../utils/vue';
import { getTemplateContent } from '../utils/vue';
import { kebabize } from '../utils/kababize';

export const findDependencyInstancesInTemplate = (template: string, name: string): Element[] => {
    const templateWithoutTemplateTags = template.replace(/template/g, 'temp-tag');
    const fragment = JSDOM.fragment(templateWithoutTemplateTags);
    const dependencyUsagesCamelCase = Array.from(fragment.querySelectorAll(name));
    const dependencyUsagesKebabCase = Array.from(fragment.querySelectorAll(kebabize(name)));
    return [...dependencyUsagesCamelCase, ...dependencyUsagesKebabCase];
};

export const parseComponentFile = async (filePath: string): Promise<Partial<VueComponent> | null> => {
    try {
        const { displayName: name, props, events, slots } = await parse(filePath);
        return { name, props: props && formatProps(props), events, slots };
    } catch (e) {
        console.error(`Something went wrong while parsing the component: ${filePath}`, e);
    }
    return null;
};

const formatProps = (props: PropDescriptor[]):Prop[] => {
    return props.map((prop) => ({
        ...prop,
        default: prop?.defaultValue?.value,
    }));
};


const handleVModelAttribute = (
    attribute: string,
    formats: (prop: string | undefined) => string[],
    channel: Event|Prop
): boolean => {
    // find usages of v-model:propName (Vue 3 syntax)
    const vModelProp = attribute.split(':')[1];
    if (formats(vModelProp).includes(channel.name)) {
        channel.isVModel = true;
        return true;
    }
    return false;
};

const getPropVModelFormats = (prop:string|undefined) => [
    `${prop}`,
    'modelValue',
    'value'
];

export const isPropUsed = (template: Element, prop: Prop): boolean => {
    const propFormats = [
        prop.name.toLowerCase(),
        `:${prop.name.toLowerCase()}`,
        `:${kebabize(prop.name)}`,
        kebabize(prop.name)
    ];

    let isUsed = false;
    [...template.attributes].forEach((attribute) => {
        if (!isUsed ) {
            const isVModelAttribute = attribute.name.includes('v-model');
            return isUsed = isVModelAttribute
                ? handleVModelAttribute(attribute.name, getPropVModelFormats, prop)
                : propFormats.includes(attribute.name);
        }
    });
    return isUsed;
};
const getEventVModelFormats = (prop:string|undefined) => [
    `update:${prop}`,
    'update:modelValue',
    'input:value'
];

export const isEventUsed = (template: Element, event: Event): boolean => {
    const eventFormat = [`@${event.name.toLowerCase()}`, `v-on:${event.name.toLowerCase()}`];
    let isUsed = false;

    [...template.attributes].forEach((attribute) => {
        if (!isUsed ) {
            const isVModelAttribute = attribute.name.includes('v-model');
            return isUsed = isVModelAttribute
                ? handleVModelAttribute(attribute.name, getEventVModelFormats, event)
                : eventFormat.includes(attribute.name);
        }
    });

    return isUsed;
};


export const isSlotUsed = (template: Element, slot: Slot): boolean => {
    const slotFormat = [`#${slot.name}`, `v-slot:${slot.name}`];
    let isUsed = false;
    slotFormat.forEach((format) => (isUsed = isUsed || Boolean(template.innerHTML.includes(format))));
    return isUsed;
};

export const getUsedChannels = <Channel>(
    dependencyInstances: Element[],
    channels: Channel[],
    validator: (instance: Element, channel: Channel) => boolean
): number[] => {
    const usedChannels = new Set<number>();
    channels.forEach((channel, index) => {
        dependencyInstances.forEach((dependencyUsage) =>
            validator(dependencyUsage, channel) && usedChannels.add(index));
    });
    return [...usedChannels];
};
export const getDependentWithUsedChannelsAnalysis = (
    { fullPath: dependentFullPath, name: dependentName, fileContent: dependentFilecontent }: VueComponent,
    { name, props, events, slots }: VueComponent
): Dependent => {
    const template = getTemplateContent(dependentFilecontent);

    const emptyDependentAnalysis = {
        fullPath: dependentFullPath,
        name: dependentName,
        usedProps: [],
        usedEvents: [],
        usedSlots: []
    };

    if (!template) return emptyDependentAnalysis;
    try {
        let dependencyInstances = findDependencyInstancesInTemplate(template, name);
        if (dependencyInstances.length === 0)  {
            const importName = getComponentImportName(dependentFilecontent, name);
            dependencyInstances = importName
                ? findDependencyInstancesInTemplate(template, importName)
                : dependencyInstances;
        }

        return {
            fullPath: dependentFullPath,
            name: dependentName,
            usedProps: dependencyInstances ? getUsedChannels(dependencyInstances, props, isPropUsed) : [],
            usedEvents: dependencyInstances ? getUsedChannels(dependencyInstances, events, isEventUsed) : [],
            usedSlots: dependencyInstances ?  getUsedChannels(dependencyInstances, slots, isSlotUsed) : []
        };
    } catch (e) {
        console.log(`Error while analysing / searching for ${name} in template of ${dependentName}`,  e);
    }

    return emptyDependentAnalysis;
};
