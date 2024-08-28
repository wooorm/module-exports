/**
 * @import {Symbol} from 'module-exports'
 * @import {ClassLikeDeclarationBase} from 'typescript'
 * @import {FileState, NamedPlaceFields} from '../../types.js'
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createHeritage} from '../../util/create-heritage.js'
import {nameToString} from '../../util/create-name-fields.js'
import {findExamples} from '../../util/examples.js'
import {getTypeThroughSymbol} from '../../util/get-type-through-symbol.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {maybePlace} from '../../util/maybe-place.js'
import {classElement} from '../concrete/class-element.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassLikeDeclarationBase} node
 *   Node.
 * @param {NamedPlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function class_(state, node, options) {
  // To do: typeParameters.
  /** @type {Set<string>} */
  const seen = new Set()
  /** @type {Array<Symbol>} */
  const results = []

  let hasConstructor = false

  for (const element of node.members) {
    if (typescript.isConstructorDeclaration(element)) {
      hasConstructor = true
    }

    const result = classElement(state, element, options)
    if (!result) continue

    // Ignore second of getter/setter.
    // Note: TS LSP shows both the getter and setter comments and `@` tags
    // merged.
    // In the order they appear in the source.
    // We could merge, but what’s the point.
    if (seen.has(result.nameDisplay)) continue
    seen.add(result.nameDisplay)
    results.push(result)
  }

  const name = options?.explicitName || node.name

  // If there’s no constructor, add a constructor.
  if (!hasConstructor && name) {
    const description = getMainComment(node)

    if (!description) {
      state.messages.push(
        new VFileMessage(
          'Unexpected missing description on class `' + name.text + '`',
          {
            place: maybePlace(state, node, options),
            ruleId: 'description-missing',
            source: 'module-exports'
          }
        )
      )
    }

    const classType = getTypeThroughSymbol(state, node)
    const signature = classType.getConstructSignatures().at(0)
    assert(signature)
    const constructorReturnType = signature.getReturnType()

    results.push({
      description,
      examples: findExamples(node),
      name,
      nameDisplay: nameToString(name),
      nameDisplayPrefix: 'new ',
      // Note: actual signature depends on what this extends.
      nameDisplaySuffix: '()',
      ...fieldsFromType(state, classType, node),
      heritage: createHeritage(state, node.heritageClauses),
      parameters: [],
      return: {
        description: undefined,
        examples: [],
        ...fieldsFromType(state, constructorReturnType, node)
      }
    })
  }

  return results
}
