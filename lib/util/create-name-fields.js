/**
 * @import {Name} from 'module-exports'
 * @import {Identifier, Modifier, Node, NumericLiteral, StringLiteral} from 'typescript'
 * @import {FileState} from '../types.js'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [omitSignature=false]
 *   Omit the signature.
 * @property {Identifier | null | undefined} [explicitClassName]
 *   Explicit class to use.
 * @property {Identifier | null | undefined} [explicitSelfName]
 *   Explicit self name to use.
 */

import {ok as assert} from 'devlop'
import {name as isIdentifierName} from 'estree-util-is-identifier-name'
import typescript from 'typescript'
import {displayType} from './display-type.js'

/**
 * @param {FileState} state
 * @param {Identifier | NumericLiteral | StringLiteral} name
 * @param {Node} parent
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {Name}
 */
// eslint-disable-next-line complexity
export function createNameFields(state, name, parent, options) {
  const settings = options || {}
  const omitSignature = settings.omitSignature || false
  const explicitClassName = settings.explicitClassName || undefined
  const explicitSelfName = settings.explicitSelfName || undefined
  /** @type {ReadonlyArray<Modifier> | undefined} */
  let modifiers

  if (typescript.canHaveModifiers(parent)) {
    modifiers = typescript.getModifiers(parent)
  }

  if (!modifiers) modifiers = []

  /** @type {string | undefined} */
  let className

  if (
    parent.parent &&
    (typescript.isClassDeclaration(parent.parent) ||
      typescript.isClassExpression(parent.parent))
  ) {
    const identifier = explicitClassName || parent.parent.name
    assert(identifier) // An exported class should at least have an `explicitClassName`.
    className = nameToString(identifier)
  }

  let default_ = false
  let selfName = nameToString(name)

  // Whether `explicitSelfName` exists means whether this symbol is re-exported:
  if (
    explicitSelfName
      ? explicitSelfName.getText() === 'default'
      : modifiers.some((d) => d.kind === typescript.SyntaxKind.DefaultKeyword)
  ) {
    default_ = true
  } else if (explicitSelfName) {
    selfName = nameToString(explicitSelfName)
  }

  let nameDisplayPrefix = ''
  let nameDisplaySuffix = ''
  let nameDisplay = ''

  if (typescript.isConstructorDeclaration(parent)) {
    assert(className) // Always defined.
    nameDisplayPrefix = 'new '
    nameDisplay = className
  } else {
    if (typescript.isIndexSignatureDeclaration(parent)) {
      const signature =
        state.findState.typeChecker.getSignatureFromDeclaration(parent)
      assert(signature) // Seems to always be defined.
      const parameterType = signature.getTypeParameterAtPosition(0)

      selfName += ': ' + displayType(state, parameterType, parent)
    }

    // Handle index signatures.
    const computed = !isIdentifierName(selfName)

    if (className) {
      nameDisplay =
        className +
        (modifiers.some((d) => d.kind === typescript.SyntaxKind.StaticKeyword)
          ? computed
            ? '[' + selfName + ']'
            : '.' + selfName
          : computed
            ? '#[' + selfName + ']'
            : '#' + selfName)
    } else {
      nameDisplay = computed ? '[' + selfName + ']' : selfName
    }
  }

  // Note: get/set accessors are intentionally not handled.
  if (
    typescript.isConstructorDeclaration(parent) ||
    typescript.isFunctionDeclaration(parent) ||
    typescript.isMethodDeclaration(parent) ||
    typescript.isMethodSignature(parent)
  ) {
    const signature =
      state.findState.typeChecker.getSignatureFromDeclaration(parent)

    if (signature && !omitSignature) {
      nameDisplaySuffix +=
        '(' + signature.parameters.map((d) => d.name).join(', ') + ')'
    }
  }

  // Several things, such as parameters and properties, can be optional.
  if ('questionToken' in parent && parent.questionToken) {
    nameDisplaySuffix += '?'
  } else if ('isBracketed' in parent && parent.isBracketed) {
    nameDisplaySuffix += '?'
  }

  if (default_) {
    nameDisplaySuffix += ' (default)'
  }

  return {
    name,
    nameDisplay,
    nameDisplayPrefix,
    nameDisplaySuffix
  }
}

/**
 *
 * @param {Identifier | NumericLiteral | StringLiteral} name
 * @returns {string}
 */
export function nameToString(name) {
  const value = name.text
  assert(typeof value === 'string')
  return value
}
