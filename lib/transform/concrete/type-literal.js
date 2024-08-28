/**
 * @import {Value} from 'module-exports'
 * @import {TypeLiteralNode} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {interface_} from '../generic/interface.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {TypeLiteralNode} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Value}
 *   Result.
 */
export function typeLiteral(state, node, options) {
  return interface_(state, node, options)
}
