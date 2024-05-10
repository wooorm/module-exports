/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ShorthandPropertyAssignment} ShorthandPropertyAssignment
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ShorthandPropertyAssignment} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function shorthandPropertyAssignment(state, node, options) {
  const description =
    comment(typescript.getJSDocTypeTag(node)) || getMainComment(node)

  if (!description) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description for property `' + node.name.text + '`',
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
    ...createNameFields(state, node.name, node),
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
