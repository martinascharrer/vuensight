export type Prop = {
  name: string,
  type?: { name: string; func?: boolean | undefined; } | undefined,
  required?: boolean,
  default?: string,
}

export type Event = {
  name: string,
  isSync?: boolean,
}

export type Slot = {
  name: string,
}

export type Dependency = {
  fullPath: string,
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
}
