// eslint-disable-next-line import/extensions,import/no-unresolved
import { Token } from 'vue-eslint-parser/ast/tokens';
import {
  ESLintImportDeclaration,
  ESLintModuleDeclaration,
  ESLintStatement,
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vue-eslint-parser/ast/nodes';

/**
 * get Declaration syntax from Tokens.
 * @param tokens
 * @param targetKeyName
 * @returns {string}
 */
export const getDeclarationSyntax = (tokens: Token[], targetKeyName: 'data' | 'props'): string => {
  let isTargetToken = false;
  let result = '{'; // for JSON.parse
  let closedCount = 0;
  const needQuotingTypes = ['Identifier', 'Boolean', 'Keyword'];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const { type, value } = token;
    // waiting to see starting the declaration of target.
    if (isTargetToken || (!isTargetToken && type === 'Identifier' && value === targetKeyName)) {
      const needQuoting = needQuotingTypes.includes(type);
      isTargetToken = true;

      if (type === 'Punctuator') {
        // count brace for finding end of the declaration.
        if (value === '{') {
          closedCount += 1;
        } else if (value === '}') {
          closedCount -= 1;

          // remove trailing comma for JSON.
          if (result[result.length - 1] === ',') {
            result = result.slice(0, -1);
          }

          if (closedCount === 0) {
            result += '}';
            break;
          }
        }
      }

      // put left-hand quotation for JSON.
      if (needQuoting) {
        result += '"';
      }

      // change quotation to double for JSON.
      result += value.replace(/'/ug, '"');

      // put right-hand quotation for JSON.
      if (needQuoting) {
        result += '"';
      }
    }
  }

  return `${result}}`;
};

export const getProps = (tokens: Token[]): string => {
  try {
    const propsDeclaration = JSON.parse(getDeclarationSyntax(tokens, 'props'));

    if (propsDeclaration && propsDeclaration.props) {
      return propsDeclaration.props;
    }

    return '';
  } catch (err) {
    console.warn('failed to analyze props.');

    return '';
  }
};

/**
 * get only Import Declaration syntax.
 * @param {Node[]} nodeArr
 */
export const getImportDeclaration = (nodeArr: (ESLintStatement | ESLintModuleDeclaration)[]): ESLintImportDeclaration[] => { // eslint-disable-line
  return nodeArr.filter((node) => node.type === 'ImportDeclaration') as ESLintImportDeclaration[];
};
