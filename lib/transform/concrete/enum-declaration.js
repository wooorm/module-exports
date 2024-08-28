/**
 * @import {EnumDeclaration} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {VFileMessage} from 'vfile-message'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {EnumDeclaration} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {undefined}
 *   Result.
 */
export function enumDeclaration(state, node, options) {
  state.messages.push(
    new VFileMessage(
      'Unexpected enum declaration, use regular types to improve compatibility with JavaScript users',
      {
        place: maybePlace(state, node, options),
        ruleId: 'enum-declaration',
        source: 'module-exports'
      }
    )
  )
}
