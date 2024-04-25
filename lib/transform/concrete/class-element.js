/**
 * @typedef {import('typescript').ClassElement} ClassElement
 * @typedef {import('typescript').Identifier} Identifier
 *
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {unreachable} from 'devlop'
import typescript from 'typescript'
import {classStaticBlockDeclaration} from './class-static-block-declaration.js'
import {constructorDeclaration} from './constructor-declaration.js'
import {getAccessorDeclaration} from './get-accessor-declaration.js'
import {indexSignatureDeclaration} from './index-signature-declaration.js'
import {methodDeclaration} from './method-declaration.js'
import {setAccessorDeclaration} from './set-accessor-declaration.js'
import {propertyDeclaration} from './property-declaration.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ClassElement} node
 *   Node.
 * @param {Identifier | undefined} [explicitClassName]
 *   Node.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function classElement(state, node, explicitClassName) {
  if (typescript.isClassStaticBlockDeclaration(node)) {
    return classStaticBlockDeclaration(state, node)
  }

  if (typescript.isConstructorDeclaration(node)) {
    return constructorDeclaration(state, node, explicitClassName)
  }

  if (typescript.isGetAccessorDeclaration(node)) {
    return getAccessorDeclaration(state, node, explicitClassName)
  }

  if (typescript.isIndexSignatureDeclaration(node)) {
    return indexSignatureDeclaration(state, node, explicitClassName)
  }

  if (typescript.isMethodDeclaration(node)) {
    return methodDeclaration(state, node, {explicitClassName})
  }

  if (typescript.isPropertyDeclaration(node)) {
    return propertyDeclaration(state, node, explicitClassName)
  }

  /* c8 ignore next 3 -- seems to be a `typescript` implementation detail? */
  if (typescript.isSemicolonClassElement(node)) {
    return
  }

  if (typescript.isSetAccessorDeclaration(node)) {
    return setAccessorDeclaration(state, node, explicitClassName)
    /* c8 ignore next 5 -- should never happen. */
  }

  unreachable('unexpected new unimplemented class element `' + node.kind + '`')
}
