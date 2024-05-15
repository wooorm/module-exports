/**
 * @typedef {import('typescript').PropertyAssignment} PropertyAssignment
 *
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {findExamples} from '../../util/examples.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {maybePlace} from '../../util/maybe-place.js'
import {getMainComment} from '../../util/get-main-comment.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {PropertyAssignment} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function propertyAssignment(state, node, options) {
  // Never happens as far as I am aware.
  assert(!typescript.isNoSubstitutionTemplateLiteral(node.name))
  // Cannot happen outside class.
  assert(!typescript.isPrivateIdentifier(node.name))

  // Warn for dynamic APIs.
  if (typescript.isComputedPropertyName(node.name)) {
    state.messages.push(
      new VFileMessage(
        'Unexpected computed name of property, expected static name',
        {
          place: maybePlace(state, node.name, options),
          ruleId: 'computed-property-assignment',
          source: 'module-exports'
        }
      )
    )
    return
  }

  const description = getMainComment(node)

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
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
