/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').SignatureDeclaration} SignatureDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {getTypeThroughSymbol} from '../../util/get-type-through-symbol.js'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {parameterDeclaration} from '../concrete/parameter-declaration.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {SignatureDeclaration} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function signature(state, node) {
  // To do: type parameters.
  const signature =
    state.findState.typeChecker.getSignatureFromDeclaration(node)
  assert(signature) // Seems to be always defined.

  const description = getMainComment(node)

  if (!description) {
    state.messages.push(
      new VFileMessage('Unexpected missing description for function or call', {
        place: toUnistPlace(state, node),
        ruleId: 'description-missing',
        source: 'module-exports'
      })
    )
  }

  const returnDescription = comment(typescript.getJSDocReturnTag(node))

  if (!returnDescription) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description for return value of function or call',
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
    ...fieldsFromType(state, getTypeThroughSymbol(state, node), node),
    parameters: node.parameters.map(function (parameter, index) {
      return parameterDeclaration(
        state,
        parameter,
        signature.getTypeParameterAtPosition(index)
      )
    }),
    return: {
      description: returnDescription,
      ...fieldsFromType(state, signature.getReturnType(), node)
    }
  }
}
