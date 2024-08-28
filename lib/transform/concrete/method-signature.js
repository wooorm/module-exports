/**
 * @import {Symbol} from 'module-exports'
 * @import {MethodSignature} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
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
 * @param {MethodSignature} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function methodSignature(state, node, options) {
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
    ...createNameFields(state, node.name, node, {omitSignature: true})
  }
}
