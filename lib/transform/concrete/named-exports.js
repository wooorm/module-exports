/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').NamedExports} NamedExports
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {exportSpecifier} from './export-specifier.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {NamedExports} node
 *   Node.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function namedExports(state, node) {
  /** @type {Array<Symbol>} */
  const results = []

  for (const element of node.elements) {
    const result = exportSpecifier(state, element)

    if (result) {
      if (Array.isArray(result)) {
        results.push(...result)
      } else {
        results.push(result)
      }
    }
  }

  return results
}
