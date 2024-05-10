/**
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').Type} Type
 *
 * @typedef {import('../types.js').FileState} FileState
 */

/**
 * @typedef {(
 *   Pick<
 *     import('module-exports').Symbol,
 *     'typeExpression' | 'typeExpressionDisplay'
 *   >
 * )} TypeFields
 */

import {displayType} from './display-type.js'

/**
 * @param {FileState} state
 * @param {Type} typeExpression
 * @param {Node} node
 * @returns {TypeFields}
 */
export function createTypeExpressionFields(state, typeExpression, node) {
  // ParameterDeclaration,
  //   PropertySignature,
  //   PropertyDeclaration,
  //   FunctionLikeDeclarationBase,
  //   NamedTupleMember,
  //   MappedTypeNode,
  //   ConditionalExpression,
  //   TypeElement,
  //   ParameterDeclaration

  return {
    typeExpression,
    typeExpressionDisplay: displayType(state, typeExpression, node)
  }
}
