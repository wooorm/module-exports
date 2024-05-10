/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').TypeLiteralNode} TypeLiteralNode
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
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
