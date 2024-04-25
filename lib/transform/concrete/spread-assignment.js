/**
 * @typedef {import('typescript').SpreadAssignment} SpreadAssignment
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {VFileMessage} from 'vfile-message'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {SpreadAssignment} node
 *   Node.
 * @returns {undefined}
 *   Result.
 */
export function spreadAssignment(state, node) {
  state.messages.push(
    new VFileMessage('Unexpected spread, use explicit exports', {
      place: toUnistPlace(state, node),
      ruleId: 'spread-assignment',
      source: 'module-exports'
    })
  )
}
