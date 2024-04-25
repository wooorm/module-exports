/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ObjectLiteralElementLike} ObjectLiteralElementLike
 *
 * @typedef {import('../../types.js').FileState} FileState
 */

import {unreachable} from 'devlop'
import typescript from 'typescript'
import {getAccessorDeclaration} from './get-accessor-declaration.js'
import {methodDeclaration} from './method-declaration.js'
import {propertyAssignment} from './property-assignment.js'
import {setAccessorDeclaration} from './set-accessor-declaration.js'
import {shorthandPropertyAssignment} from './shorthand-property-assignment.js'
import {spreadAssignment} from './spread-assignment.js'

/**
 * @param {FileState} state
 *   Info passed around.
 * @param {ObjectLiteralElementLike} node
 *   Node.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function objectLiteralElement(state, node) {
  if (typescript.isGetAccessorDeclaration(node)) {
    return getAccessorDeclaration(state, node)
  }

  if (typescript.isMethodDeclaration(node)) {
    return methodDeclaration(state, node, {omitSignature: true})
  }

  if (typescript.isPropertyAssignment(node)) {
    return propertyAssignment(state, node)
  }

  if (typescript.isSetAccessorDeclaration(node)) {
    return setAccessorDeclaration(state, node)
  }

  if (typescript.isShorthandPropertyAssignment(node)) {
    return shorthandPropertyAssignment(state, node)
  }

  if (typescript.isSpreadAssignment(node)) {
    return spreadAssignment(state, node)
    /* c8 ignore next 4 -- should not happen. */
  }

  // @ts-expect-error: indeed, types say it can’t happen.
  unreachable('unexpected unknown object element `' + node.kind + '`')
}
