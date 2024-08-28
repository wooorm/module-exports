/**
 * @import {Symbol} from 'module-exports'
 * @import {ConstructorDeclaration} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
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
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol}
 *   Result.
 */
export function constructorDeclaration(state, node, options) {
  assert(!node.name) // Constructors have no name.

  return {
    ...signature(state, node, options),
    heritage: createHeritage(state, node.parent.heritageClauses),
    ...createNameFields(
      state,
      // Idea: figure out if we can get the token somehow?
      typescript.factory.createIdentifier('constructor'),
      node,
      {explicitClassName: options?.explicitName}
    )
  }
}
