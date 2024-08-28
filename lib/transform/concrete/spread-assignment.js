/**
 * @import {SpreadAssignment} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {VFileMessage} from 'vfile-message'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {SpreadAssignment} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {undefined}
 *   Result.
 */
export function spreadAssignment(state, node, options) {
  state.messages.push(
    new VFileMessage('Unexpected spread, use explicit exports', {
      place: maybePlace(state, node, options),
      ruleId: 'spread-assignment',
      source: 'module-exports'
    })
  )
}
