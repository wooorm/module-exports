/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').ClassExpression} ClassExpression
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {class_ as transformClass} from '../generic/class.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassExpression} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Value>}
 *   Result.
 */
export function classExpression(state, node, explicitName) {
  return transformClass(state, node, explicitName)
}
