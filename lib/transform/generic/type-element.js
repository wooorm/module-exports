/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').TypeElement} TypeElement
 *
 * @typedef {import('../../types.js').FileState} FileState
 * @typedef {import('../../types.js').PlaceFields} PlaceFields
 */

import {unreachable} from 'devlop'
import typescript from 'typescript'
import {getAccessorDeclaration} from '../concrete/get-accessor-declaration.js'
import {indexSignatureDeclaration} from '../concrete/index-signature-declaration.js'
import {methodSignature} from '../concrete/method-signature.js'
import {propertySignature} from '../concrete/property-signature.js'
import {setAccessorDeclaration} from '../concrete/set-accessor-declaration.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {TypeElement} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function typeElement(state, node, options) {
  // Ignore these here, they are not fields (have no names).
  /* c8 ignore next 6 -- currently hijacked by  parent. */
  if (
    typescript.isCallSignatureDeclaration(node) ||
    typescript.isConstructSignatureDeclaration(node)
  ) {
    return
  }

  if (typescript.isGetAccessorDeclaration(node)) {
    return getAccessorDeclaration(state, node, options)
  }

  if (typescript.isIndexSignatureDeclaration(node)) {
    return indexSignatureDeclaration(state, node, options)
  }

  if (typescript.isMethodSignature(node)) {
    return methodSignature(state, node, options)
  }

  if (typescript.isPropertySignature(node)) {
    return propertySignature(state, node, options)
  }

  if (typescript.isSetAccessorDeclaration(node)) {
    return setAccessorDeclaration(state, node, options)
    /* c8 ignore next 5 -- should not happen. */
  }

  unreachable('to do: handle type element `' + node.kind + '`')
}
