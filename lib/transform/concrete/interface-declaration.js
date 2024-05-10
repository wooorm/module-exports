/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').InterfaceDeclaration} InterfaceDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').NamedPlaceFields} NamedPlaceFields
 */

import {createNameFields} from '../../util/create-name-fields.js'
import {interface_ as genericInterface} from '../generic/interface.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {InterfaceDeclaration} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Result.
 */
export function interfaceDeclaration(state, node, options) {
  return {
    ...genericInterface(state, node, options),
    ...createNameFields(state, options?.explicitName || node.name, node)
  }
}
