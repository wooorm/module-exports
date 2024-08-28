/**
 * @import {Value, Symbol} from 'module-exports'
 * @import {JSDocTypedefTag} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {comment} from '../../util/comment.js'
import {findExamplesBefore} from '../../util/examples.js'
import {maybePlace} from '../../util/maybe-place.js'
import {jsdocTypeExpression} from './jsdoc-type-expression.js'
import {jsdocTypeLiteral} from './jsdoc-type-literal.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocTypedefTag} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Result.
 */
export function jsdocTypedefTag(state, node, options) {
  assert(node.name) // Seems to always be defined.

  const typeExpressionOrLiteral = node.typeExpression

  if (!typeExpressionOrLiteral) return

  /** @type {Value} */
  let base

  if (typescript.isJSDocTypeExpression(typeExpressionOrLiteral)) {
    const result = jsdocTypeExpression(state, typeExpressionOrLiteral, {
      ...options,
      explicitName: node.name
    })
    if (!result || Array.isArray(result)) return result
    base = result
  } else {
    assert(typescript.isJSDocTypeLiteral(typeExpressionOrLiteral))
    base = jsdocTypeLiteral(state, typeExpressionOrLiteral, options)
  }

  const description = base.description || comment(node) || comment(node.parent)

  if (!description) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description on `@' +
          node.tagName.text +
          '` of `' +
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
    ...base,
    description,
    examples: findExamplesBefore(node.parent, node),
    ...createNameFields(state, node.name, node)
  }
}
