export interface Mixin {
  name: string
  path: string
}

export type Prop = {
  name: string,
  type?: { name: string; func?: boolean | undefined; } | undefined,
  required?: boolean,
  default?: string,
  mixin?: Mixin,
  isVModel?: boolean
}

export type Event = {
  name: string,
  isSync?: boolean,
  mixin?: Mixin,
  isVModel?: boolean
}

export type Slot = {
  name: string,
}

export type Channel = Prop | Event | Slot;
export type ChannelType = 'Props' | 'Events' | 'Slots';

export type Dependency = {
  fullPath: string,
}

export type Dependent = {
  fullPath: string,
  name: string,
  usedProps: number[], // indexOf used prop
  usedEvents: number[], // indexOf used event
  usedSlots: number[], // indexOf used event
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
  dependents: Dependent[],
}
