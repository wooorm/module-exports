/**
 * @import {Symbol} from 'module-exports'
 * @import {VariableStatement} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {variableDeclaration} from '../concrete/variable-declaration.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {VariableStatement} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function variableStatement(state, node, options) {
  return node.declarationList.declarations.flatMap(function (node) {
    return variableDeclaration(state, node, options)
  })
}
