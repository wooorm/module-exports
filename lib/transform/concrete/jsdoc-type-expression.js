/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').Identifier} Identifier
 * @typedef {import('typescript').JSDocTypeExpression} JSDocTypeExpression
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {declaration as transformDeclaration} from '../declaration.js'
import {fieldsFromType} from '../../util/fields-from-type.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocTypeExpression} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Symbol> | Symbol | Value | undefined}
 *   Result.
 */
export function jsdocTypeExpression(state, node, explicitName) {
  const typeNode = node.type
  const type = state.findState.typeChecker.getTypeFromTypeNode(typeNode)

  if (typescript.isImportTypeNode(typeNode)) {
    const symbol = type.aliasSymbol || type.symbol
    assert(symbol)
    assert(symbol.declarations)
    assert(symbol.declarations.length > 0)
    return transformDeclaration(state, symbol.declarations[0], explicitName)
  }

  // Type expression generated through:
  // signature: return type: 2
  // getTypeThroughSymbol: 5
  // getTypeFromTypeNode: 6
  // getTypeAtLocation: 6

  // extra: parameter through signature

  return {
    // Expressions have no description.
    description: undefined,
    ...fieldsFromType(state, type, node)
  }
}
