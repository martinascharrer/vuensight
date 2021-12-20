"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kebabize = void 0;
const kebabize = (str) => str.split('')
    .map((letter, idx) => (letter.toUpperCase() === letter
    ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
    : letter)).join('');
exports.kebabize = kebabize;
exports.default = {
    kebabize: exports.kebabize,
};
//# sourceMappingURL=utils.js.map