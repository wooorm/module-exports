/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').SignatureDeclaration} SignatureDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {findExamples} from '../../util/examples.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {getTypeThroughSymbol} from '../../util/get-type-through-symbol.js'
import {maybePlace} from '../../util/maybe-place.js'
import {parameterDeclaration} from '../concrete/parameter-declaration.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {SignatureDeclaration} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Value}
 *   Result.
 */
export function signature(state, node, options) {
  // To do: type parameters.
  const signature =
    state.findState.typeChecker.getSignatureFromDeclaration(node)
  assert(signature) // Seems to be always defined.

  const description = getMainComment(node)

  if (!description) {
    state.messages.push(
      new VFileMessage('Unexpected missing description for function or call', {
        place: maybePlace(state, node, options),
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
    ...fieldsFromType(state, getTypeThroughSymbol(state, node), node),
    parameters: node.parameters.map(function (parameter, index) {
      return parameterDeclaration(
        state,
        parameter,
        signature.getTypeParameterAtPosition(index),
        options
      )
    }),
    return: {
      description: returnDescription,
      examples: [],
      ...fieldsFromType(state, signature.getReturnType(), node)
    }
  }
}
