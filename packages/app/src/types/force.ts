import { VueComponent } from '@vuensight/types';

export type Link = {
    source: string,
    target: string,
}

export type ForceLayout = {
    nodes: VueComponent[],
    links: Link[],
}
