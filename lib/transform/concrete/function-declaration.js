/**
 * @import {Value, Symbol} from 'module-exports'
 * @import {FunctionDeclaration} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
 */

import {createNameFields} from '../../util/create-name-fields.js'
import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {FunctionDeclaration} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | Value}
 *   Result.
 */
export function functionDeclaration(state, node, options) {
  const base = signature(state, node, options)

  /* c8 ignore next -- currently only called on named functions. */
  if (!node.name) return base

  return {
    ...base,
    ...createNameFields(state, node.name, node, {
      explicitSelfName: options?.explicitName
    })
  }
}
