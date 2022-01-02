import { parser } from '@vuese/parser';
import { VueComponent, Prop } from '../types';
import { kebabize } from './utils';

export const parseComponent = (component: VueComponent): void => {
  try {
    parser(component.fileContent, {
      onProp: (prop) => {
        component.props.push({
          name: prop.name,
          type: prop.type,
          required: prop.required,
          default: prop.default,
        });
      },
      onEvent: (event) => {
        component.events.push({
          name: event.name,
          isSync: event.isSync,
        });
      },
      onSlot: (slot) => {
        component.slots.push({
          name: slot.name,
        });
      },
    });
  } catch (e) {
    console.error('Error parsing components with vuese.', e);
  }
};

export const isPropUsed = (template: Element, prop: Prop): boolean => {
  const propFormats = [prop.name, `:${prop.name}`, `:${kebabize(prop.name)}`, kebabize(prop.name)];
  let isUsed = false;
  propFormats.forEach((format) => {
    if (!isUsed) isUsed = Boolean(template.attributes.getNamedItem(format));
  });
  return isUsed;
};
