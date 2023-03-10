import { VueComponent } from '@vuensight/types';

export const get = ():Promise<VueComponent[]> => fetch('/parse-result')
  .then((result) => result.json());

export default {
  get,
};
