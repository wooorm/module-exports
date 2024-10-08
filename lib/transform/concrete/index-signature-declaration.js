/**
 * @import {Symbol} from 'module-exports'
 * @import {IndexSignatureDeclaration} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {createNameFields} from '../../util/create-name-fields.js'
import {findExamples} from '../../util/examples.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {IndexSignatureDeclaration} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol}
 *   Result.
 */
export function indexSignatureDeclaration(state, node, options) {
  // For some weird reason, index signatures are regular signatures,
  // so `[name: string]: string | number` -> `(name: string): string | number`,
  // I guess they’re called “signatures”, but still weird!
  const signature =
    state.findState.typeChecker.getSignatureFromDeclaration(node)
  assert(signature) // Always defined, I think.
  const parameterName = node.parameters[0].name
  const description = getMainComment(node)
  // Note: I think these are never binding patterns.
  assert(typescript.isIdentifier(parameterName))
  const returnType = signature.getReturnType()

  return {
    description,
    examples: findExamples(node),
    ...createNameFields(state, parameterName, node, {
      explicitClassName: options?.explicitName
    }),
    ...fieldsFromType(state, returnType, node)
  }
}
