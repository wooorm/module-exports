/**
 * @typedef {import('typescript').ArrowFunction} ArrowFunction
 *
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ArrowFunction} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function arrowFunction(state, node) {
  return signature(state, node)
}
