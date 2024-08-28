/**
 * @import {Symbol} from 'module-exports'
 * @import {ClassDeclaration} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
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
