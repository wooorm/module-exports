/**
 * @import {ExportAssignment} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {VFileMessage} from 'vfile-message'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ExportAssignment} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {undefined}
 *   Result.
 */
export function exportAssignment(state, node, options) {
  state.messages.push(
    new VFileMessage('Unexpected export assignment, use explicit exports', {
      place: maybePlace(state, node, options),
      ruleId: 'export-assignment',
      source: 'module-exports'
    })
  )
}
