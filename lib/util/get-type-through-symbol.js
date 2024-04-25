/**
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').Symbol} Symbol
 * @typedef {import('typescript').Type} Type
 *
 * @typedef {import('../types.js').FileState} FileState
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
