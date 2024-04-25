/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').MethodSignature} MethodSignature
 *
 * @typedef {import('../../types.js').FileState} FileState
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
 * @param {MethodSignature} node
 *   Node.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function methodSignature(state, node) {
  // Never happens as far as I am aware.
  assert(!typescript.isNoSubstitutionTemplateLiteral(node.name))
  // Cannot happen in type signature.
  assert(!typescript.isPrivateIdentifier(node.name))

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
    ...createNameFields(state, node.name, node, {omitSignature: true})
  }
}
