/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ClassDeclaration} ClassDeclaration
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {class_ as transformClass} from '../generic/class.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassDeclaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function classDeclaration(state, node, explicitName) {
  return transformClass(state, node, explicitName)
}
