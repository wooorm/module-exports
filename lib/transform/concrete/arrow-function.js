/**
 * @typedef {import('typescript').ArrowFunction} ArrowFunction
 *
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ArrowFunction} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Value}
 *   Result.
 */
export function arrowFunction(state, node, options) {
  return signature(state, node, options)
}
