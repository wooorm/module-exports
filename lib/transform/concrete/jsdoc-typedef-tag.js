/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').JSDocTypedefTag} JSDocTypedefTag
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createNameFields} from '../../util/create-name-fields.js'
import {comment} from '../../util/comment.js'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {jsdocTypeExpression} from './jsdoc-type-expression.js'
import {jsdocTypeLiteral} from './jsdoc-type-literal.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {JSDocTypedefTag} node
 *   Node.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Result.
 */
export function jsdocTypedefTag(state, node) {
  assert(node.name) // Seems to always be defined.

  const typeExpressionOrLiteral = node.typeExpression

  if (!typeExpressionOrLiteral) return

  /** @type {Value} */
  let base

  if (typescript.isJSDocTypeExpression(typeExpressionOrLiteral)) {
    const result = jsdocTypeExpression(
      state,
      typeExpressionOrLiteral,
      node.name
    )
    if (!result || Array.isArray(result)) return result
    base = result
  } else {
    assert(typescript.isJSDocTypeLiteral(typeExpressionOrLiteral))
    base = jsdocTypeLiteral(state, typeExpressionOrLiteral)
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
          place: toUnistPlace(state, node),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    ...base,
    description,
    ...createNameFields(state, node.name, node)
  }
}
