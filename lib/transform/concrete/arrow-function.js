/**
 * @import {Value} from 'module-exports'
 * @import {ArrowFunction} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
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
