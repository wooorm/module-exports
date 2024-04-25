/**
 * @typedef {import('module-exports').Symbol} Symbol
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').ConstructorDeclaration} ConstructorDeclaration
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {createHeritage} from '../../util/create-heritage.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {signature} from '../generic/signature.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ConstructorDeclaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitClassName]
 *   Explicit class name.
 * @returns {Symbol}
 *   Result.
 */
export function constructorDeclaration(state, node, explicitClassName) {
  assert(!node.name) // Constructors have no name.

  return {
    ...signature(state, node),
    heritage: createHeritage(state, node.parent.heritageClauses),
    ...createNameFields(
      state,
      // Idea: figure out if we can get the token somehow?
      typescript.factory.createIdentifier('constructor'),
      node,
      {explicitClassName}
    )
  }
}
