/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ExportSpecifier} ExportSpecifier
 * @typedef {import('typescript').Symbol} TypeScriptSymbol
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import {declaration} from '../declaration.js'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ExportSpecifier} node
 *   Node.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Result.
 */
export function exportSpecifier(state, node) {
  const nameExposed = node.name
  assert(nameExposed) // Always defined.
  // Cast as it doesn’t exist in the types, but exists in practise.
  const exportSymbol = /** @type {TypeScriptSymbol} */ (
    /* c8 ignore next -- seems to always be defined. */
    'symbol' in node ? node.symbol : undefined
  )
  assert(exportSymbol) // Seems to always exist.
  const definedSymbol =
    state.findState.typeChecker.getAliasedSymbol(exportSymbol)
  const decl = definedSymbol.declarations?.[0]
  /* c8 ignore next -- happens for broken files */
  if (!decl) return
  return declaration(state, decl, {
    explicitPlace: toUnistPlace(state, node),
    explicitName: nameExposed
  })
}
