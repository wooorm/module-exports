/**
 * @typedef {import('typescript').ExportAssignment} ExportAssignment
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
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
