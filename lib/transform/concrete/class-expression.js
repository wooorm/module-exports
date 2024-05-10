/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').ClassExpression} ClassExpression
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').NamedPlaceFields} NamedPlaceFields
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
