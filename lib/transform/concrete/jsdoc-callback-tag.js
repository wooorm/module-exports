/**
 * @import {Symbol} from 'module-exports'
 * @import {JSDocCallbackTag} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {createTypeExpressionFields} from '../../util/create-type-expression-fields.js'
import {comment} from '../../util/comment.js'
import {findExamplesBefore} from '../../util/examples.js'
import {maybePlace} from '../../util/maybe-place.js'
import {jsdocPropertyLikeTag} from './jsdoc-property-like-tag.js'
import {jsdocReturnTag} from './jsdoc-return-tag.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocCallbackTag} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function jsdocCallbackTag(state, node, options) {
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
          place: maybePlace(state, node, options),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    description,
    examples: findExamplesBefore(node.parent, node),
    heritage: [],
    ...createNameFields(state, node.name, node),
    parameters: node.typeExpression.parameters.map(function (parameter) {
      return jsdocPropertyLikeTag(state, parameter, options)
    }),
    properties: [],
    return: jsdocReturnTag(state, node.typeExpression.type, options),
    ...createTypeExpressionFields(
      state,
      state.findState.typeChecker.getTypeAtLocation(node),
      node
    )
  }
}
