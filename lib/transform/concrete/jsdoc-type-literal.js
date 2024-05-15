/**
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').JSDocTypeLiteral} JSDocTypeLiteral
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {ok as assert} from 'devlop'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {jsdocPropertyLikeTag} from './jsdoc-property-like-tag.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocTypeLiteral} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Value}
 *   Result.
 */
export function jsdocTypeLiteral(state, node, options) {
  assert(node.jsDocPropertyTags) // Seems to always be defined.

  return {
    // Expressions have no description.
    description: undefined,
    examples: [],
    ...fieldsFromType(
      state,
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    ),
    properties: node.jsDocPropertyTags.map(function (property) {
      return jsdocPropertyLikeTag(state, property, options)
    })
  }
}
