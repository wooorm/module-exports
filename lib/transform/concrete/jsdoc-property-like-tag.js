/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').JSDocPropertyLikeTag} JSDocPropertyLikeTag
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {comment} from '../../util/comment.js'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocPropertyLikeTag} node
 *   Node.
 * @returns {Symbol}
 *   Result.
 */
export function jsdocPropertyLikeTag(state, node) {
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
          place: toUnistPlace(state, node),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    description,
    ...createNameFields(state, node.name, node),
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeFromTypeNode(node.typeExpression.type),
      node
    )
  }
}