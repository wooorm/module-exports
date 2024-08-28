/**
 * @typedef {import('typescript').Expression} Expression
 *
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('../types.js').FileState} FileState
 * @typedef {import('../types.js').NamedPlaceFields} NamedPlaceFields
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
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Value> | Value | undefined}
 *   Nothing.
 */
export function expression(state, node, options) {
  // Things like `null`, `boolean`, `string`, `number`, etc.
  if (
    typescript.isArrayLiteralExpression(node) ||
    typescript.isLiteralTypeLiteral(node)
  ) {
    return literal(state, node)
  }

  if (typescript.isArrowFunction(node)) {
    return arrowFunction(state, node, options)
  }

  if (typescript.isClassExpression(node)) {
    return classExpression(state, node, options)
  }

  if (typescript.isExpressionWithTypeArguments(node)) {
    return expression(state, node.expression, options)
  }

  if (typescript.isFunctionExpression(node)) {
    return functionExpression(state, node, options)
  }

  if (typescript.isIdentifier(node)) {
    return identifier(state, node)
  }

  if (typescript.isObjectLiteralExpression(node)) {
    return objectLiteralExpression(state, node, options)
  }

  if (typescript.isParenthesizedExpression(node)) {
    return expression(state, node.expression, options)
    /* c8 ignore next 5 -- should not happen. */
  }

  unreachable('to do: handle expression `' + node.kind + '`')
}
