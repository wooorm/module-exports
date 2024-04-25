/**
 * @typedef {import('typescript').ClassStaticBlockDeclaration} ClassStaticBlockDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {VFileMessage} from 'vfile-message'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassStaticBlockDeclaration} node
 *   Node.
 * @returns {undefined}
 *   Result.
 */
export function classStaticBlockDeclaration(state, node) {
  state.messages.push(
    new VFileMessage('Unexpected static block, use static properties', {
      place: toUnistPlace(state, node),
      ruleId: 'static-block',
      source: 'module-exports'
    })
  )
}
