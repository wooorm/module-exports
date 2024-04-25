/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').JSDocReturnTag} JSDocReturnTag
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import {VFileMessage} from 'vfile-message'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {comment} from '../../util/comment.js'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocReturnTag} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function jsdocReturnTag(state, node) {
  assert(node.typeExpression) // Seems to be always defined.

  const description = comment(node)

  if (!description) {
    state.messages.push(
      // Idea: include parent `@callback` or attached function name,
      // if available?
      new VFileMessage(
        'Unexpected missing description on `@' + node.tagName.text + '`',
        {
          place: toUnistPlace(state, node),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    description,
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeFromTypeNode(node.typeExpression.type),
      node
    )
  }
}
