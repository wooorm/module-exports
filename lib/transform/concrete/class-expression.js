/**
 * @import {Value} from 'module-exports'
 * @import {ClassExpression} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
 */

import {class_ as transformClass} from '../generic/class.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassExpression} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Value>}
 *   Result.
 */
export function classExpression(state, node, options) {
  return transformClass(state, node, options)
}
