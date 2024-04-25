/**
 * @typedef {import('typescript').ExportAssignment} ExportAssignment
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {VFileMessage} from 'vfile-message'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ExportAssignment} node
 *   Node.
 * @returns {undefined}
 *   Result.
 */
export function exportAssignment(state, node) {
  state.messages.push(
    new VFileMessage('Unexpected export assignment, use explicit exports', {
      place: toUnistPlace(state, node),
      ruleId: 'export-assignment',
      source: 'module-exports'
    })
  )
}
