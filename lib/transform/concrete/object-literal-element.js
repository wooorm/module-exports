/**
 * @import {Symbol} from 'module-exports'
 * @import {ObjectLiteralElementLike} from 'typescript'
 * @import {FileState, PlaceFields} from '../../types.js'
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
 * @param {PlaceFields | undefined} [options]
 *   Configuration.
 * @returns {Symbol | undefined}
 *   Result.
 */
export function objectLiteralElement(state, node, options) {
  if (typescript.isGetAccessorDeclaration(node)) {
    return getAccessorDeclaration(state, node, options)
  }

  if (typescript.isMethodDeclaration(node)) {
    return methodDeclaration(state, node, options, {omitSignature: true})
  }

  if (typescript.isPropertyAssignment(node)) {
    return propertyAssignment(state, node, options)
  }

  if (typescript.isSetAccessorDeclaration(node)) {
    return setAccessorDeclaration(state, node, options)
  }

  if (typescript.isShorthandPropertyAssignment(node)) {
    return shorthandPropertyAssignment(state, node, options)
  }

  if (typescript.isSpreadAssignment(node)) {
    return spreadAssignment(state, node, options)
    /* c8 ignore next 4 -- should not happen. */
  }

  // @ts-expect-error: indeed, types say it can’t happen.
  unreachable('unexpected unknown object element `' + node.kind + '`')
}
