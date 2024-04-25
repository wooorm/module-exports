/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').Identifier} Identifier
 * @typedef {import('typescript').SetAccessorDeclaration} SetAccessorDeclaration
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
import {getTypeThroughSymbol} from '../../util/get-type-through-symbol.js'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {SetAccessorDeclaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitClassName]
 *   Explicit class name.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function setAccessorDeclaration(state, node, explicitClassName) {
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
        'Unexpected computed name of set accessor, expected static name',
        {
          place: toUnistPlace(state, node.name),
          ruleId: 'computed-set-accessor',
          source: 'module-exports'
        }
      )
    )
    return
  }

  const description =
    comment(typescript.getJSDocTypeTag(node)) || getMainComment(node)

  if (!description) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description on set accessor `' +
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
    ...createNameFields(state, node.name, node, {explicitClassName}),
    ...fieldsFromType(state, getTypeThroughSymbol(state, node), node)
  }
}
