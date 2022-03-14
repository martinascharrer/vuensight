export type Color = 'mint' | 'red' | 'purple';

export type Prop = {
  name: string,
  type?: { name: string; func?: boolean | undefined; } | undefined,
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
export type Link = {
  source: string,
  target: string,
}

export type ForceLayout = {
  nodes: VueComponent[],
  links: Link[],
}
