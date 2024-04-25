/**
 * @typedef {import('typescript').ImportEqualsDeclaration} ImportEqualsDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {VFileMessage} from 'vfile-message'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ImportEqualsDeclaration} node
 *   Node.
 * @returns {undefined}
 *   Result.
 */
export function importEqualsDeclaration(state, node) {
  state.messages.push(
    new VFileMessage('Unexpected `import =`, use explicit exports', {
      place: toUnistPlace(state, node),
      ruleId: 'import-equals',
      source: 'module-exports'
    })
  )
}
