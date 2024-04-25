/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').Type} Type
 *
 * @typedef {import('../types.js').FileState} FileState
 */

import {createTypeExpressionFields} from './create-type-expression-fields.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {Type} type
 *   type
 * @param {Node} node
 *   Node.
 * @returns {Omit<Value, 'description'>}
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
