/**
 * @import {Symbol} from 'module-exports'
 * @import {JSDocPropertyLikeTag} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {comment} from '../../util/comment.js'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocPropertyLikeTag} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol}
 *   Result.
 */
export function jsdocPropertyLikeTag(state, node, options) {
  assert(!typescript.isQualifiedName(node.name)) // No idea what this is.
  assert(node.typeExpression) // Seems to be always defined.

  const description = comment(node)

  if (!description) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description on `@' +
          node.tagName.text +
          '` for `' +
          node.name.text +
          '`',
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
    ...createNameFields(state, node.name, node),
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeFromTypeNode(node.typeExpression.type),
      node
    )
  }
}
