/**
 * @import {Value} from 'module-exports'
 * @import {JSDocReturnTag} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {ok as assert} from 'devlop'
import {VFileMessage} from 'vfile-message'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {comment} from '../../util/comment.js'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocReturnTag} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Value}
 *   Result.
 */
export function jsdocReturnTag(state, node, options) {
  assert(node.typeExpression) // Seems to be always defined.

  const description = comment(node)

  if (!description) {
    state.messages.push(
      // Idea: include parent `@callback` or attached function name,
      // if available?
      new VFileMessage(
        'Unexpected missing description on `@' + node.tagName.text + '`',
        {
          place: maybePlace(state, node, options),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    description,
    examples: [],
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeFromTypeNode(node.typeExpression.type),
      node
    )
  }
}
