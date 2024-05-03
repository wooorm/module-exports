/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').Identifier} Identifier
 * @typedef {import('typescript').FunctionDeclaration} FunctionDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {createNameFields} from '../../util/create-name-fields.js'
import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {FunctionDeclaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Explicit name.
 * @returns {Symbol | Value}
 *   Result.
 */
export function functionDeclaration(state, node, explicitName) {
  const base = signature(state, node)

  /* c8 ignore next -- currently only called on named functions. */
  if (!node.name) return base

  return {
    ...base,
    ...createNameFields(state, node.name, node, {
      explicitSelfName: explicitName
    })
  }
}
