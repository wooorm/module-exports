/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

// Break JSDocs.
''

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
