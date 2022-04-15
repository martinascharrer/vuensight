import { parse, PropDescriptor } from 'vue-docgen-api';
import { JSDOM } from 'jsdom';

import { Dependent, Event, Prop, Slot, VueComponent } from  '@vue-component-insight/types';

import { getTemplateContent } from '../utils/template';
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

export const isPropUsed = (template: Element, prop: Prop): boolean => {
  const propFormats = [prop.name, `:${prop.name}`, `:${kebabize(prop.name)}`, kebabize(prop.name)];
  let isUsed = false;
  propFormats.forEach((format) => {
    if (!isUsed) isUsed = Boolean(template.attributes.getNamedItem(format));
  });
  return isUsed;
};

export const isEventUsed = (template: Element, event: Event): boolean => {
  const eventFormat = [`@${event.name}`, `v-on:${event.name}`];
  let isUsed = false;
  eventFormat.forEach((format) => (isUsed = isUsed || Boolean(template.attributes.getNamedItem(format))));
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
    dependencyInstances.forEach((dependencyUsage) => validator(dependencyUsage, channel) && usedChannels.add(index));
  });
  return [...usedChannels];
};

export const getDependentWithUsedChannelsAnalysis = (
    { fullPath: dependentFullPath, name: dependentName, fileContent: dependentFilecontent }: VueComponent,
    { name, props, events, slots }: VueComponent
): Dependent => {
  const template = getTemplateContent(dependentFilecontent);
  if (!template) return {
    fullPath: dependentFullPath,
    name: dependentName,
    usedProps: [],
    usedEvents: [],
    usedSlots: []
  };
  const dependencyInstances = findDependencyInstancesInTemplate(template, name);
  return {
    fullPath: dependentFullPath,
    name: dependentName,
    usedProps: getUsedChannels(dependencyInstances, props, isPropUsed),
    usedEvents: getUsedChannels(dependencyInstances, events, isEventUsed),
    usedSlots: getUsedChannels(dependencyInstances, slots, isSlotUsed)
  };
};
