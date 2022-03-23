export const get = ():Promise<any> => fetch('http://localhost:4444/parse-result').then((result) => result.json());

export default {
  get,
};
