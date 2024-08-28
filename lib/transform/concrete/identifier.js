/**
 * @import {Value} from 'module-exports'
 * @import {Identifier} from 'typescript'
 * @import {FileState} from '../../types.js'
 */

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {Identifier} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function identifier(state, node) {
  return {
    // Expressions have no description.
    description: undefined,
    examples: [],
    heritage: [],
    parameters: [],
    properties: [],
    return: undefined,
    typeExpression: state.findState.typeChecker.getTypeAtLocation(node),
    typeExpressionDisplay: node.getText()
  }
}
