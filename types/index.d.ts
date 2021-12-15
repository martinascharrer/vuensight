export type Props = {
  name: string,
  type: string | undefined,
  required: boolean | undefined,
  default: boolean | undefined,
}

export type Events = {
  name: string,
  params: string,
}

export type Dependency = {
  fullPath: string,
  usedProps: int[], // indexOf used prop
  usedEvents: int[], // indexOf used event
}

export type VueComponent = {
  fullPath: string,
  fileName: string,
  file: string,
  props: string | null, // TODO: use Props[] data-type here (adjust props-retrieval)
  events: Events[],
  dependencies: Dependency[],
}
