/**
 * @typedef {import('typescript').EnumDeclaration} EnumDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
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
