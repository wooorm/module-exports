/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').TypeLiteralNode} TypeLiteralNode
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {interface_} from '../generic/interface.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {TypeLiteralNode} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function typeLiteral(state, node) {
  return interface_(state, node)
}
