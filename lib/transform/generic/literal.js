/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').NumericLiteral} NumericLiteral
 * @typedef {import('typescript').StringLiteral} StringLiteral
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {fieldsFromType} from '../../util/fields-from-type.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {NumericLiteral | StringLiteral} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function literal(state, node) {
  return {
    // Expressions have no description.
    description: undefined,
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
