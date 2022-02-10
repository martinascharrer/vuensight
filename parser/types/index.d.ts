import { PropType } from '@vuese/parser';

export type Prop = {
  name: string,
  type: PropType,
  required?: boolean,
  default?: string,
}

export type Event = {
  name: string,
  isSync: boolean | undefined,
}

export type Slot = {
  name: string,
}

export type CommunicationChannels = {
  props: Prop[],
  events: Event[],
  slots: Slot[],
}

export type Dependency = {
  fullPath: string,
  usedProps: number[], // indexOf used prop
  usedEvents: number[], // indexOf used event
}

export type VueComponent = {
  name: string,
  fullPath: string,
  fileName: string,
  fileType: string,
  fileContent: string,
  props: Prop[],
  events: Event[],
  slots: Slot[],
  dependencies: Dependency[],
}
