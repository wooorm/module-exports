/**
 * @import {Value, Symbol} from 'module-exports'
 * @import {TypeAliasDeclaration} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
 */

import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {comment} from '../../util/comment.js'
import {createNameFields} from '../../util/create-name-fields.js'
import {findExamples} from '../../util/examples.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {typeLiteral} from '../concrete/type-literal.js'
import {maybePlace} from '../../util/maybe-place.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {TypeAliasDeclaration} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Result.
 */
export function typeAliasDeclaration(state, node, options) {
  const type = node.type

  /** @type {Value} */
  let result

  if (typescript.isTypeLiteralNode(type)) {
    result = typeLiteral(state, type, options)
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
            place: maybePlace(state, node, options),
            ruleId: 'description-missing',
            source: 'module-exports'
          }
        )
      )
    }

    result = {
      description,
      examples: findExamples(node),
      ...fieldsFromType(
        state,
        state.findState.typeChecker.getTypeFromTypeNode(type),
        node
      )
    }
  }

  return {
    ...result,
    ...createNameFields(state, options?.explicitName || node.name, node)
  }
}
