import { VueComponent } from '@vuensight/types';

export const get = ():Promise<VueComponent[]> => fetch('http://localhost:4444/parse-result')
  .then((result) => result.json());

export default {
  get,
};
