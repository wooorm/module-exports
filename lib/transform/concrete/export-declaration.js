/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ExportDeclaration} ExportDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {namedExports} from './named-exports.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ExportDeclaration} node
 *   Node.
 * @returns {Array<Symbol> | undefined}
 *   Result.
 */
export function exportDeclaration(state, node) {
  if (node.exportClause) {
    // ```
    // export * as x from 'y'
    // ```
    if (typescript.isNamespaceExport(node.exportClause)) {
      state.messages.push(
        new VFileMessage(
          'Unexpected namespace export (`* as x`), use explicit exports',
          {
            place: toUnistPlace(state, node.exportClause),
            ruleId: 'namespace-export',
            source: 'module-exports'
          }
        )
      )
    } else {
      // ```
      // export {x} from 'y'
      // ```
      assert(typescript.isNamedExports(node.exportClause))

      if (node.moduleSpecifier) {
        return namedExports(state, node.exportClause)
      }

      // To do: allow, as `export {default}` is also allowed.
      state.messages.push(
        new VFileMessage('Unexpected default export, use named exports', {
          place: toUnistPlace(state, node.exportClause),
          ruleId: 'default-export',
          source: 'module-exports'
        })
      )
    }
  } else {
    // ```
    // export * from 'z'
    // ```
    state.messages.push(
      new VFileMessage('Unexpected export all (`*`), use explicit exports', {
        place: toUnistPlace(state, node),
        ruleId: 'export-all',
        source: 'module-exports'
      })
    )
  }
}
