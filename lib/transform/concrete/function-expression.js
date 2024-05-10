/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').FunctionExpression} FunctionExpression
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {createNameFields} from '../../util/create-name-fields.js'
import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {FunctionExpression} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | Value}
 *   Result.
 */
export function functionExpression(state, node, options) {
  const name = node.name
  const base = signature(state, node, options)
  /* c8 ignore next -- currently only called on named functions. */
  return name ? {...base, ...createNameFields(state, name, node)} : base
}
