/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').ArrayLiteralExpression} ArrayLiteralExpression
 * @typedef {import('typescript').BooleanLiteral} BooleanLiteral
 * @typedef {import('typescript').LiteralExpression} LiteralExpression
 * @typedef {import('typescript').NullLiteral} NullLiteral
 * @typedef {import('typescript').PrefixUnaryExpression} PrefixUnaryExpression
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {fieldsFromType} from '../../util/fields-from-type.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ArrayLiteralExpression | BooleanLiteral | LiteralExpression | NullLiteral | PrefixUnaryExpression} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function literal(state, node) {
  return {
    // Expressions have no description.
    description: undefined,
    examples: [],
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
