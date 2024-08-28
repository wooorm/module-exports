/**
 * @import {ClassStaticBlockDeclaration} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {VFileMessage} from 'vfile-message'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassStaticBlockDeclaration} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {undefined}
 *   Result.
 */
export function classStaticBlockDeclaration(state, node, options) {
  state.messages.push(
    new VFileMessage('Unexpected static block, use static properties', {
      place: maybePlace(state, node, options),
      ruleId: 'static-block',
      source: 'module-exports'
    })
  )
}
