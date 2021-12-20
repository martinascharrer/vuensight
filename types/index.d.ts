import { PropType } from '@vuese/parser';

export type Prop = {
  name: string,
  type: PropType | undefined,
  required: boolean | undefined,
  default: string | undefined,
}

export type Event = {
  name: string,
  isSync: boolean | undefined,
}

export type Slot = {
  name: string,
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
