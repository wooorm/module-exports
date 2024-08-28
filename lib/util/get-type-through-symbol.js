/**
 * @import {Node, Symbol, Type} from 'typescript'
 * @import {FileState} from '../types.js'
 */

import {ok as assert} from 'devlop'

/**
 *
 * @param {FileState} state
 * @param {Node} node
 * @returns {Type}
 */
export function getTypeThroughSymbol(state, node) {
  assert('symbol' in node)
  // Cast as it doesn’t exist in the types, but exists in practise.
  const symbol = /** @type {Symbol} */ (node.symbol)
  return state.findState.typeChecker.getTypeOfSymbol(symbol)
}
