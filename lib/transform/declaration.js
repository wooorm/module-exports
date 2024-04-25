/**
 * @typedef {import('typescript').Declaration} Declaration
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('../types.js').FileState} FileState
 */

import {ok as assert, unreachable} from 'devlop'
import typescript from 'typescript'
import {classDeclaration} from './concrete/class-declaration.js'
import {constructorDeclaration} from './concrete/constructor-declaration.js'
import {enumDeclaration} from './concrete/enum-declaration.js'
import {exportDeclaration} from './concrete/export-declaration.js'
import {functionDeclaration} from './concrete/function-declaration.js'
import {getAccessorDeclaration} from './concrete/get-accessor-declaration.js'
import {importEqualsDeclaration} from './concrete/import-equals-declaration.js'
import {interfaceDeclaration} from './concrete/interface-declaration.js'
import {indexSignatureDeclaration} from './concrete/index-signature-declaration.js'
import {jsdocPropertyLikeTag} from './concrete/jsdoc-property-like-tag.js'
import {jsdocTypedefTag} from './concrete/jsdoc-typedef-tag.js'
import {methodDeclaration} from './concrete/method-declaration.js'
import {propertyDeclaration} from './concrete/property-declaration.js'
import {setAccessorDeclaration} from './concrete/set-accessor-declaration.js'
import {typeAliasDeclaration} from './concrete/type-alias-declaration.js'
import {variableDeclaration} from './concrete/variable-declaration.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {Declaration} node
 *   Node.
 * @param {Identifier | undefined} [explicitName]
 *   Node.
 * @returns {Array<Symbol> | Symbol | undefined}
 *   Nothing.
 */
/* c8 ignore next 100 -- this helper isn’t used much yet. */
export function declaration(state, node, explicitName) {
  if (typescript.isClassDeclaration(node)) {
    return classDeclaration(state, node, explicitName)
  }

  if (typescript.isConstructorDeclaration(node)) {
    return constructorDeclaration(state, node)
  }

  if (typescript.isEnumDeclaration(node)) {
    return enumDeclaration(state, node)
  }

  if (typescript.isExportDeclaration(node)) {
    return exportDeclaration(state, node, explicitName)
  }

  if (typescript.isFunctionDeclaration(node)) {
    const result = functionDeclaration(state, node, explicitName)
    assert('name' in result) // Always defined when exporting or explicity given.
    return result
  }

  if (typescript.isGetAccessorDeclaration(node)) {
    return getAccessorDeclaration(state, node)
  }

  if (typescript.isImportEqualsDeclaration(node)) {
    return importEqualsDeclaration(state, node)
  }

  if (typescript.isInterfaceDeclaration(node)) {
    return interfaceDeclaration(state, node, explicitName)
  }

  if (typescript.isIndexSignatureDeclaration(node)) {
    return indexSignatureDeclaration(state, node)
  }

  if (typescript.isJSDocPropertyTag(node)) {
    return jsdocPropertyLikeTag(state, node)
  }

  if (typescript.isJSDocTypedefTag(node)) {
    return jsdocTypedefTag(state, node)
  }

  if (typescript.isMethodDeclaration(node)) {
    return methodDeclaration(state, node)
  }

  if (typescript.isPropertyDeclaration(node)) {
    return propertyDeclaration(state, node)
  }

  if (typescript.isSetAccessorDeclaration(node)) {
    return setAccessorDeclaration(state, node)
  }

  if (typescript.isTypeAliasDeclaration(node)) {
    return typeAliasDeclaration(state, node, explicitName)
  }

  if (typescript.isVariableDeclaration(node)) {
    return variableDeclaration(state, node, explicitName)
  }

  unreachable('to do: handle declaration `' + node.kind + '`')
}
