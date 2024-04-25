/**
 * @typedef {import('typescript').Expression} Expression
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('../types.js').FileState} FileState
 */

import {unreachable} from 'devlop'
import typescript from 'typescript'
import {arrowFunction} from './concrete/arrow-function.js'
import {classExpression} from './concrete/class-expression.js'
import {functionExpression} from './concrete/function-expression.js'
import {identifier} from './concrete/identifier.js'
import {objectLiteralExpression} from './concrete/object-literal-expression.js'
import {literal} from './generic/literal.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {Expression} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Value> | Value | undefined}
 *   Nothing.
 */
export function expression(state, node, explicitName) {
  if (typescript.isArrowFunction(node)) {
    return arrowFunction(state, node)
  }

  if (typescript.isClassExpression(node)) {
    return classExpression(state, node, explicitName)
  }

  if (typescript.isExpressionWithTypeArguments(node)) {
    return expression(state, node.expression)
  }

  if (typescript.isFunctionExpression(node)) {
    // To do: check.
    return functionExpression(state, node)
  }

  if (typescript.isIdentifier(node)) {
    return identifier(state, node)
  }

  if (typescript.isNumericLiteral(node) || typescript.isStringLiteral(node)) {
    return literal(state, node)
  }

  if (typescript.isObjectLiteralExpression(node)) {
    return objectLiteralExpression(state, node)
    /* c8 ignore next 5 -- should not happen. */
  }

  unreachable('to do: handle expression `' + node.kind + '`')
}
