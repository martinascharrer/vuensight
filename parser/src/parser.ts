import { parser } from '@vuese/parser';
import { Prop, Event, CommunicationChannels } from '../types';
import { kebabize } from './utils';

export const findCommunicationChannels = (fileContent: string): CommunicationChannels => {
  const communicationChannels: CommunicationChannels = { props: [], events: [], slots: [] };
  try {
    const { props, events, slots } = parser(fileContent);
    if (props) communicationChannels.props = props;
    if (events) communicationChannels.events = events;
    if (slots)  communicationChannels.slots = slots ;
  } catch (e) {
    console.error('Error parsing components with vuese.', e);
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
  eventFormat.forEach((format) => {
    if (!isUsed) isUsed = Boolean(template.attributes.getNamedItem(format));
  });
  return isUsed;
};
