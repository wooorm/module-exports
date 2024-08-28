/**
 * @import {Value, Symbol} from 'module-exports'
 * @import {ObjectLiteralExpression} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {fieldsFromType} from '../../util/fields-from-type.js'
import {getTypeThroughSymbol} from '../../util/get-type-through-symbol.js'
import {objectLiteralElement} from './object-literal-element.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ObjectLiteralExpression} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Value}
 *   Result.
 */
export function objectLiteralExpression(state, node, options) {
  /** @type {Array<Symbol>} */
  const properties = []

  for (const property of node.properties) {
    const result = objectLiteralElement(state, property, options)
    if (result) properties.push(result)
  }

  return {
    // Expressions have no description.
    description: undefined,
    examples: [],
    ...fieldsFromType(state, getTypeThroughSymbol(state, node), node),
    properties
  }
}
