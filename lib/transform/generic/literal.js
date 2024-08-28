/**
 * @import {Value} from 'module-exports'
 * @import {ArrayLiteralExpression, BooleanLiteral, LiteralExpression, NullLiteral, PrefixUnaryExpression} from 'typescript'
 * @import {FileState} from '../../types.js'
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
