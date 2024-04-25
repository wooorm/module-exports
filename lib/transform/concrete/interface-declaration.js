/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').Identifier} Identifier
 * @typedef {import('typescript').InterfaceDeclaration} InterfaceDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {createNameFields} from '../../util/create-name-fields.js'
import {interface_ as genericInterface} from '../generic/interface.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {InterfaceDeclaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Result.
 */
export function interfaceDeclaration(state, node, explicitName) {
  return {
    ...genericInterface(state, node),
    ...createNameFields(state, explicitName || node.name, node)
  }
}
