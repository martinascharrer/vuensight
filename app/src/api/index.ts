export const getParsedData = () => fetch('http://localhost:4444/parse-result').then((result) => result.json());

export default {
  getParsedData,
};
