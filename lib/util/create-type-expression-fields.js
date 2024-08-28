/**
 * @import {Symbol} from 'module-exports'
 * @import {Node, Type} from 'typescript'
 * @import {FileState} from '../types.js'
 */

/**
 * @typedef {Pick<Symbol, 'typeExpression' | 'typeExpressionDisplay'>} TypeFields
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
