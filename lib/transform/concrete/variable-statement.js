/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').VariableStatement} VariableStatement
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {variableDeclaration} from '../concrete/variable-declaration.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {VariableStatement} node
 *   Node.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function variableStatement(state, node) {
  return node.declarationList.declarations.flatMap(function (node) {
    return variableDeclaration(state, node)
  })
}
