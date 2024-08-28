/**
 * @import {ImportEqualsDeclaration} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
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
