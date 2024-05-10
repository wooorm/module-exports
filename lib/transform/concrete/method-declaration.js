/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').MethodDeclaration} MethodDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 * @typedef {import('../../util/create-name-fields.js').Options} Options
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {maybePlace} from '../../util/maybe-place.js'
import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {MethodDeclaration} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @param {Options | undefined} [nameOptions]
 *   Configuration for the name.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function methodDeclaration(state, node, options, nameOptions) {
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
        'Unexpected computed name of method, expected static name',
        {
          place: maybePlace(state, node.name, options),
          ruleId: 'computed-method',
          source: 'module-exports'
        }
      )
    )
    return
  }

  return {
    ...signature(state, node, options),
    ...createNameFields(state, node.name, node, nameOptions)
  }
}
