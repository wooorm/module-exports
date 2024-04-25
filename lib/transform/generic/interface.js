/**
 * @typedef {import('module-exports').Symbol} Symbol
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').InterfaceDeclaration} InterfaceDeclaration
 * @typedef {import('typescript').TypeLiteralNode} TypeLiteralNode
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createHeritage} from '../../util/create-heritage.js'
import {createTypeExpressionFields} from '../../util/create-type-expression-fields.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {signature} from './signature.js'
import {typeElement} from './type-element.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {InterfaceDeclaration | TypeLiteralNode} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function interface_(state, node) {
  /** @type {Set<string>} */
  const seen = new Set()
  /** @type {Array<Symbol>} */
  const properties = []
  /**  @type {Value | undefined} */
  let callSignature

  for (const member of node.members) {
    if (
      typescript.isCallSignatureDeclaration(member) ||
      typescript.isConstructSignatureDeclaration(member)
    ) {
      // To do: merge multiple call / construct signatures.
      if (callSignature) continue
      callSignature = signature(state, member)
    } else {
      const result = typeElement(state, member)
      if (!result) continue

      // Ignore second of getter/setter.
      // Note: TS LSP shows both the getter and setter comments and `@` tags
      // merged.
      // In the order they appear in the source.
      // We could merge, but what’s the point.
      if (seen.has(result.nameDisplay)) continue
      seen.add(result.nameDisplay)
      properties.push(result)
    }
  }

  const description = getMainComment(node)

  if (!description) {
    state.messages.push(
      new VFileMessage('Unexpected missing description for interface', {
        place: toUnistPlace(state, node),
        ruleId: 'description-missing',
        source: 'module-exports'
      })
    )
  }

  return {
    description,
    heritage:
      'heritageClauses' in node
        ? createHeritage(state, node.heritageClauses)
        : [],
    parameters: callSignature ? callSignature.parameters : [],
    properties,
    return: callSignature ? callSignature.return : undefined,
    ...createTypeExpressionFields(
      state,
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
