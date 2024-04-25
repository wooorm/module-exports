/**
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').Identifier} Identifier
 * @typedef {import('typescript').TypeAliasDeclaration} TypeAliasDeclaration
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {typeLiteral} from '../concrete/type-literal.js'
import {toUnistPlace} from '../../util/to-unist-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {TypeAliasDeclaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Result.
 */
export function typeAliasDeclaration(state, node, explicitName) {
  const type = node.type

  /** @type {Value} */
  let result

  if (typescript.isTypeLiteralNode(type)) {
    result = typeLiteral(state, type)
  } else {
    // Idea: Flatten intersections if possible?
    console.warn('to do: unknown type: `' + type.kind + '`')

    const description =
      comment(typescript.getJSDocTypeTag(node)) || getMainComment(node)

    if (!description) {
      state.messages.push(
        new VFileMessage(
          'Unexpected missing description for type `' + node.name.text + '`',
          {
            place: toUnistPlace(state, node),
            ruleId: 'description-missing',
            source: 'module-exports'
          }
        )
      )
    }

    result = {
      description,
      ...fieldsFromType(
        state,
        state.findState.typeChecker.getTypeFromTypeNode(type),
        node
      )
    }
  }

  return {
    ...result,
    ...createNameFields(state, explicitName || node.name, node)
  }
}
