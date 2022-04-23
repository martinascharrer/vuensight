export type Color = 'mint' | 'red' | 'purple' | 'light-mint' | 'light-red' | 'light-purple';

export type Link = {
  source: string,
  target: string,
}

export type ForceLayout = {
  nodes: VueComponent[],
  links: Link[],
}
