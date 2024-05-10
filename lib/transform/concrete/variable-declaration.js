/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').VariableDeclaration} VariableDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').NamedPlaceFields} NamedPlaceFields
 */

import structuredClone from '@ungap/structured-clone'
import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {maybePlace} from '../../util/maybe-place.js'
import {expression} from '../expression.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {VariableDeclaration} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function variableDeclaration(state, node, options) {
  assert(typescript.isIdentifier(node.name)) // Should not be binding patterns.
  assert(node.initializer) // Should be defined.

  const name = options?.explicitName || node.name

  const description = // Which JSDoc is used depends.
    // For:
    //
    // ```js
    // /**
    //  * A.
    //  */
    // export const a = 1,
    //   /**
    //    * B.
    //    */
    //   b = 2
    // ```
    //
    // For `b`, the doc exists on the node itself, but for `a`, it exists on the
    // grandparent.
    comment(typescript.getJSDocTypeTag(node)) ||
    getMainComment(node) ||
    getMainComment(node.parent.parent)

  if (!description) {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing description for variable `' + name.text + '`',
        {
          place: maybePlace(state, node, options),
          ruleId: 'description-missing',
          source: 'module-exports'
        }
      )
    )
  }

  const result = expression(state, node.initializer, {
    ...options,
    explicitName: name
  })
  /** @type {Array<Symbol | Value>} */
  /* c8 ignore next */
  const list = Array.isArray(result) ? result : result ? [result] : []

  return list.map(function (value) {
    return 'name' in value
      ? {
          ...value,
          description: value.description || structuredClone(description)
        }
      : {
          ...value,
          description: value.description || structuredClone(description),
          ...createNameFields(state, name, node)
        }
  })
}
