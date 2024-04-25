/**
 * @typedef {import('typescript').Node} Node
 *
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 *
 * @typedef {import('../types.js').FileState} FileState
 */

// Split comments.
''

/**
 * @param {FileState} state
 *   State.
 * @param {Node} node
 *   Node.
 * @returns {Position}
 *   Position.
 */
export function toUnistPlace(state, node) {
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
