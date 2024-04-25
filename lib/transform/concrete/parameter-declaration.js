/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('typescript').ParameterDeclaration} ParameterDeclaration
 * @typedef {import('typescript').Type} Type
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ParameterDeclaration} node
 *   Node.
 * @param {Type} type
 *   Type.
 * @returns {Symbol}
 *   Result.
 */
export function parameterDeclaration(state, node, type) {
  assert(typescript.isIdentifier(node.name)) // Seems never to be binding pattern.

  const label = node.name.getText()
  const jsDocParameters = typescript.getJSDocParameterTags(node)
  const jsDocParameter = jsDocParameters.at(-1)
  /** @type {Root | undefined} */
  let description

  if (jsDocParameter) {
    const previous = jsDocParameters.at(-2)

    if (previous) {
      state.messages.push(
        new VFileMessage(
          'Unexpected multiple `@param` annotations for parameter `' +
            label +
            '`',
          {
            place: toUnistPlace(state, previous),
            ruleId: 'parameter-multiple',
            source: 'module-exports'
          }
        )
      )
    }

    description = comment(jsDocParameter)

    if (!description) {
      state.messages.push(
        new VFileMessage(
          'Unexpected missing description on `@' +
            jsDocParameter.tagName.text +
            '` for parameter `' +
            label +
            '`',
          {
            place: toUnistPlace(state, jsDocParameter),
            ruleId: 'description-missing',
            source: 'module-exports'
          }
        )
      )
    }
  } else {
    state.messages.push(
      new VFileMessage(
        'Unexpected missing `@param` annotation for parameter `' + label + '`',
        {
          place: toUnistPlace(state, node),
          ruleId: 'parameter-missing',
          source: 'module-exports'
        }
      )
    )
  }

  return {
    description,
    ...createNameFields(state, node.name, node),
    ...fieldsFromType(state, type, node)
  }
}
