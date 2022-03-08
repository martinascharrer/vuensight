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
  events: Event[],
  slots: Slot[],
  dependencies: Dependency[],
}

export type Node = {
  id: string,
  title: string,
  size: number,
}

export type Link = {
  source: string,
  target: string,
}

export type ForceLayout = {
  nodes: Node[],
  links: Link[],
}
