/**
 * @import {Value, Symbol} from 'module-exports'
 * @import {VariableDeclaration} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
 */

import structuredClone from '@ungap/structured-clone'
import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {findExamples} from '../../util/examples.js'
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

  // Which JSDoc is used depends.
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
  const description =
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

  const selfExamples = findExamples(node)
  const parentExamples = findExamples(node.parent.parent)

  const result = expression(state, node.initializer, {
    ...options,
    explicitName: name
  })
  /** @type {Array<Symbol | Value>} */
  /* c8 ignore next */
  const list = Array.isArray(result) ? result : result ? [result] : []

  return list.map(function (value) {
    const result =
      'name' in value
        ? value
        : {...value, ...createNameFields(state, name, node)}

    if (!result.description) result.description = structuredClone(description)

    result.examples.push(
      ...structuredClone(selfExamples),
      ...structuredClone(parentExamples)
    )

    return result
  })
}
