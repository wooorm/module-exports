/**
 * @typedef {import('typescript').EnumDeclaration} EnumDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {VFileMessage} from 'vfile-message'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {EnumDeclaration} node
 *   Node.
 * @returns {undefined}
 *   Result.
 */
export function enumDeclaration(state, node) {
  state.messages.push(
    new VFileMessage(
      'Unexpected enum declaration, use regular types to improve compatibility with JavaScript users',
      {
        place: toUnistPlace(state, node),
        ruleId: 'enum-declaration',
        source: 'module-exports'
      }
    )
  )
}
