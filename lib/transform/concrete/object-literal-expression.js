/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ObjectLiteralExpression} ObjectLiteralExpression
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {fieldsFromType} from '../../util/fields-from-type.js'
import {getTypeThroughSymbol} from '../../util/get-type-through-symbol.js'
import {objectLiteralElement} from './object-literal-element.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ObjectLiteralExpression} node
 *   Node.
 * @returns {Value}
 *   Result.
 */
export function objectLiteralExpression(state, node) {
  /** @type {Array<Symbol>} */
  const properties = []

  for (const property of node.properties) {
    const result = objectLiteralElement(state, property)
    if (result) properties.push(result)
  }

  return {
    // Expressions have no description.
    description: undefined,
    ...fieldsFromType(state, getTypeThroughSymbol(state, node), node),
    properties
  }
}