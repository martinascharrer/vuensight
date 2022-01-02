export const kebabize = (str: string):string => str.split('')
  .map((letter, idx) => (letter.toUpperCase() === letter
    ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
    : letter)).join('');

export default {
  kebabize,
};
