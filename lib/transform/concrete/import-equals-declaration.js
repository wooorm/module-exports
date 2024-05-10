/**
 * @typedef {import('typescript').ImportEqualsDeclaration} ImportEqualsDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {VFileMessage} from 'vfile-message'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ImportEqualsDeclaration} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {undefined}
 *   Result.
 */
export function importEqualsDeclaration(state, node, options) {
  state.messages.push(
    new VFileMessage('Unexpected `import =`, use explicit exports', {
      place: maybePlace(state, node, options),
      ruleId: 'import-equals',
      source: 'module-exports'
    })
  )
}
