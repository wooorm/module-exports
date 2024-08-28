/**
 * @import {Symbol} from 'module-exports'
 * @import {NamedExports} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
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
