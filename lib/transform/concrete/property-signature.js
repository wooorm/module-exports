/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').PropertySignature} PropertySignature
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {PropertySignature} node
 *   Node.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function propertySignature(state, node) {
  // Never happens as far as I am aware.
  assert(!typescript.isNoSubstitutionTemplateLiteral(node.name))
  // Cannot happen outside classes.
  assert(!typescript.isPrivateIdentifier(node.name))

  // Warn for dynamic APIs.
  if (typescript.isComputedPropertyName(node.name)) {
    state.messages.push(
      new VFileMessage(
        'Unexpected computed name of property, expected static name',
        {
          place: toUnistPlace(state, node.name),
          ruleId: 'computed-property',
          source: 'module-exports'
        }
      )
    )
    return
  }

  assert(node.type) // Always defined, I think?

  const description =
    comment(typescript.getJSDocTypeTag(node)) || getMainComment(node)

  if (!description) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description for property `' + node.name.text + '`',
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
      state.findState.typeChecker.getTypeFromTypeNode(node.type),
      node
    )
  }
}
