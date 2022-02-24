import { parse } from 'vue-docgen-api';
import { JSDOM } from 'jsdom';

import { CommunicationChannels, Dependency, Event, Prop, Slot, VueComponent } from '../../types';

import { kebabize } from '../utils/kababize';

export const findDependencyInstancesInTemplate = (template: string, name: string): Element[] => {
  const { document } = new JSDOM(template).window;
  const dependencyUsagesCamelCase = Array.from(document.querySelectorAll(name));
  const dependencyUsagesKebabCase = Array.from(document.querySelectorAll(kebabize(name)));
  return [...dependencyUsagesCamelCase, ...dependencyUsagesKebabCase];
};

export const findCommunicationChannels = async (fileContent: string): Promise<CommunicationChannels> => {
  const communicationChannels: CommunicationChannels = { props: [], events: [], slots: [] };
  try {
    const { props, events, slots } = await parse(fileContent);
    if (props) communicationChannels.props = props;
    if (events) communicationChannels.events = events;
    if (slots)  communicationChannels.slots = slots;
  } catch (e) {
    console.log('HERE');
    console.error('Something went wrong while parsing the components.', e);
  }
  return communicationChannels;
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

export const getUsedChannels = <Channel>(dependencyInstances: Element[], channels: Channel[], validator: (instance: Element, channel: Channel) => boolean): number[] => {
  const usedChannels = new Set<number>();
  channels.forEach((channel, index) => {
    dependencyInstances.forEach((dependencyUsage) => validator(dependencyUsage, channel) && usedChannels.add(index));
  });
  return [...usedChannels];
};

export const getDependencyWithUsedChannelsAnalysis = (template: string, { name, fullPath, props, events, slots }: VueComponent): Dependency => {
  const dependencyInstances = findDependencyInstancesInTemplate(template, name);
  return {
    fullPath,
    usedProps: getUsedChannels(dependencyInstances, props, isPropUsed),
    usedEvents: getUsedChannels(dependencyInstances, events, isEventUsed),
    usedSlots: getUsedChannels(dependencyInstances, slots, isSlotUsed)
  };
};
