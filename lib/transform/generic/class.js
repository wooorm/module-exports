/**
 * @typedef {import('module-exports').Symbol} Symbol
 * @typedef {import('module-exports').Value} Value
 *
 * @typedef {import('typescript').ClassLikeDeclarationBase} ClassLikeDeclarationBase
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {ok as assert} from 'devlop'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {createHeritage} from '../../util/create-heritage.js'
import {nameToString} from '../../util/create-name-fields.js'
import {getTypeThroughSymbol} from '../../util/get-type-through-symbol.js'
import {fieldsFromType} from '../../util/fields-from-type.js'
import {getMainComment} from '../../util/get-main-comment.js'
import {toUnistPlace} from '../../util/to-unist-place.js'
import {classElement} from '../concrete/class-element.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassLikeDeclarationBase} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Symbol>}
 *   Result.
 */
export function class_(state, node, explicitName) {
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

    const result = classElement(state, element, explicitName)
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

  const name = explicitName || node.name

  // If there’s no constructor, add a constructor.
  if (!hasConstructor && name) {
    const description = getMainComment(node)

    if (!description) {
      state.messages.push(
        new VFileMessage(
          'Unexpected missing description on class `' + name.text + '`',
          {
            place: toUnistPlace(state, node),
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
        ...fieldsFromType(state, constructorReturnType, node)
      }
    })
  }

  return results
}
