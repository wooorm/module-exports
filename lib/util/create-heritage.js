/**
 * @import {Value} from 'module-exports'
 * @import {HeritageClause, NodeArray} from 'typescript'
 * @import {FileState} from '../types.js'
 */

import {expression} from '../transform/expression.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {NodeArray<HeritageClause> | undefined} list
 *   List.
 * @returns {Array<Value>}
 *   Result.
 */
export function createHeritage(state, list) {
  /** @type {Array<Value>} */
  const result = []

  if (list) {
    for (const clause of list) {
      for (const type of clause.types) {
        const subresult = expression(state, type)
        /* c8 ignore next -- should just be single identifiers, I believe? */
        if (Array.isArray(subresult)) result.push(...subresult)
        else if (subresult) result.push(subresult)
      }
    }
  }

  return result
}
