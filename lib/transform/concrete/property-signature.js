/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').PropertySignature} PropertySignature
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').NamedPlaceFields} NamedPlaceFields
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {findExamples} from '../../util/examples.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {PropertySignature} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function propertySignature(state, node, options) {
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
          place: maybePlace(state, node.name, options),
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
          place: maybePlace(state, node, options),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    description,
    examples: findExamples(node),
    ...createNameFields(state, node.name, node),
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeFromTypeNode(node.type),
      node
    )
  }
}
