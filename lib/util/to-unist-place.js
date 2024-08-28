/**
 * @import {Node} from 'typescript'
 * @import {Point, Position} from 'unist'
 * @import {FileState} from '../types.js'
 */

import {ok as assert} from 'devlop'

/**
 * @param {FileState} state
 *   State.
 * @param {Node} node
 *   Node.
 * @returns {Position}
 *   Position.
 */
export function toUnistPlace(state, node) {
  const parentFileOfNode = node.getSourceFile()
  // A wrong node is passed if we’re trying to find a node in a different file.
  assert(parentFileOfNode.fileName, state.sourceFile.fileName)
  return {
    // `node.pos` is the place right after the previous node.
    // `getStart` excludes the JSDoc comment.
    start: toUnistPoint(state, node.getStart()),
    end: toUnistPoint(state, node.end)
  }
}

/**
 * @param {FileState} state
 *   State.
 * @param {number} offset
 *   Offset.
 * @returns {Point}
 *   Point.
 */
export function toUnistPoint(state, offset) {
  const point = state.sourceFile.getLineAndCharacterOfPosition(offset)
  // Both are 0-based.
  return {line: point.line + 1, column: point.character + 1, offset}
}
