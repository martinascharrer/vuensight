import { readFileSync } from 'fs';
import { normalize } from 'path';
import { parse } from 'vue-docgen-api';
import { IModule } from 'dependency-cruiser';

import { Prop, Event, CommunicationChannels, Slot, Dependency, VueComponent } from '../types';

import { kebabize } from './utils';
import { getTemplate, getFileNameFromPath } from './files';
import { formatDependencies, findDependencyInstances, getComponentData } from './dependencies';

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

export const getComponents = async (modules: IModule[]): Promise<VueComponent[]> => {
  return await Promise.all(modules.map(async (module) => {
    const fullPath = normalize(module.source);
    const fileName = getFileNameFromPath(fullPath);
    const [name, fileType] = fileName.split('.');

    const fileContent = readFileSync(fullPath, {encoding: 'utf-8'});
    const dependencies = formatDependencies(module.dependencies);
    const { props, events, slots } = await findCommunicationChannels(fullPath);

    return {
      name,
      fullPath,
      fileContent,
      fileName,
      fileType,
      props: props ?? [],
      events: events ?? [],
      slots: slots ?? [],
      dependencies,
    };
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

export const getUsedChannels = <Channel>(dependencyInstances: Element[], channels: Channel[], validator: (instance: Element, channel: Channel) => boolean): number[] => {
  const usedChannels = new Set<number>();
  channels.forEach((channel, index) => {
    dependencyInstances.forEach((dependencyUsage) => validator(dependencyUsage, channel) && usedChannels.add(index));
  });
  return [...usedChannels];
};

export const getDependencyWithUsedChannelsAnalysis = (template: string, { name, fullPath, props, events, slots }: VueComponent): Dependency => {
  const dependencyInstances = findDependencyInstances(template, name);
  return {
    fullPath,
    usedProps: getUsedChannels(dependencyInstances, props, isPropUsed),
    usedEvents: getUsedChannels(dependencyInstances, events, isEventUsed),
    usedSlots: getUsedChannels(dependencyInstances, slots, isSlotUsed)
  };
};

export const getFullyAnalyzedComponents = (components: VueComponent[]): VueComponent[] => {
  return components.map((component) => {
    const dependencies = component.dependencies.map((dependency) => {
      const dependencyData = getComponentData(components, dependency.fullPath);
      if (dependencyData && dependencyData.fileType === 'vue') {
        const template = getTemplate(component.fileContent);
        if (template) return getDependencyWithUsedChannelsAnalysis(template, dependencyData);
      }
      return dependency;
    });
    return {
      ...component,
      dependencies,
    };
  });
};