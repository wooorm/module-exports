/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ClassDeclaration} ClassDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').NamedPlaceFields} NamedPlaceFields
 */

import {class_ as transformClass} from '../generic/class.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassDeclaration} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function classDeclaration(state, node, options) {
  return transformClass(state, node, options)
}
