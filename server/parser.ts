import { parser } from '@vuese/parser';
import { VueComponent } from '../types/index.d';

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

export default {
  parseComponent,
};
