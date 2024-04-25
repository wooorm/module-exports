/**
 * @typedef {import('typescript').PropertyAssignment} PropertyAssignment
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').Symbol} Symbol
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {getMainComment} from '../../util/get-main-comment.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {PropertyAssignment} node
 *   Node.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function propertyAssignment(state, node) {
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
          place: toUnistPlace(state, node.name),
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
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
