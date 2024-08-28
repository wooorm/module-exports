/**
 * @import {Value} from 'module-exports'
 * @import {Node, Type} from 'typescript'
 * @import {FileState} from '../types.js'
 */

import {createTypeExpressionFields} from './create-type-expression-fields.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {Type} type
 *   type
 * @param {Node} node
 *   Node.
 * @returns {Omit<Value, 'examples' | 'description'>}
 */
export function fieldsFromType(state, type, node) {
  // To do: look at overloads, properties.
  return {
    heritage: [],
    parameters: [],
    properties: [],
    return: undefined,
    ...createTypeExpressionFields(state, type, node)
  }
}
