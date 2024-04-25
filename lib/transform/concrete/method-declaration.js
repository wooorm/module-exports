/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').MethodDeclaration} MethodDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../util/create-name-fields.js').Options} Options
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {MethodDeclaration} node
 *   Node.
 * @param {Options | null | undefined} [nameOptions]
 *   Configuration for the name.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function methodDeclaration(state, node, nameOptions) {
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
          place: toUnistPlace(state, node.name),
          ruleId: 'computed-method',
          source: 'module-exports'
        }
      )
    )
    return
  }

  return {
    ...signature(state, node),
    ...createNameFields(state, node.name, node, nameOptions)
  }
}
