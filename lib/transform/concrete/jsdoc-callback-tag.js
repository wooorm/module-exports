/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').JSDocCallbackTag} JSDocCallbackTag
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {createTypeExpressionFields} from '../../util/create-type-expression-fields.js'
import {comment} from '../../util/comment.js'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {jsdocPropertyLikeTag} from './jsdoc-property-like-tag.js'
import {jsdocReturnTag} from './jsdoc-return-tag.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocCallbackTag} node
 *   Node.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function jsdocCallbackTag(state, node) {
  // A random `@callback` w/o name or parameters/return.
  if (!node.name || !node.typeExpression.type) return

  const description = comment(node) || comment(node.parent)

  if (!description) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description on `@' +
          node.tagName.text +
          '` for `' +
          node.name.text +
          '`',
        {
          place: toUnistPlace(state, node),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    description,
    heritage: [],
    ...createNameFields(state, node.name, node),
    parameters: node.typeExpression.parameters.map(function (parameter) {
      return jsdocPropertyLikeTag(state, parameter)
    }),
    properties: [],
    return: jsdocReturnTag(state, node.typeExpression.type),
    ...createTypeExpressionFields(
      state,
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
