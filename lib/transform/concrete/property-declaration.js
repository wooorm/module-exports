/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').Identifier} Identifier
 * @typedef {import('typescript').PropertyDeclaration} PropertyDeclaration
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
import {expression} from '../expression.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {PropertyDeclaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitClassName]
 *   Explicit class name.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function propertyDeclaration(state, node, explicitClassName) {
  // Never happens as far as I am aware.
  assert(!typescript.isNoSubstitutionTemplateLiteral(node.name))

  // Do not document private identifiers.
  if (typescript.isPrivateIdentifier(node.name)) {
    return
  }

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

  /** @type {Value | undefined} */
  let base

  if (node.initializer) {
    const result = expression(state, node.initializer)
    assert(result)
    assert(!Array.isArray(result)) // To do: handle theoretical array (classes).
    base = result
  } else {
    assert('type' in node)
    base = {
      // Expressions have no description.
      description: undefined,
      ...fieldsFromType(
        state,
        state.findState.typeChecker.getTypeFromTypeNode(node.type),
        node
      )
    }
  }

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
    ...base,
    description,
    ...createNameFields(state, node.name, node, {explicitClassName})
  }
}
