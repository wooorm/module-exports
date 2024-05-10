/**
 * @typedef {import('typescript').Node} Node
 *
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 *
 * @typedef {import('../types.js').FileState} FileState
 * @typedef {import('../types.js').PlaceFields} PlaceFields
 */

import {toUnistPlace} from './to-unist-place.js'

/**
 * @param {FileState} state
 *   State.
 * @param {Node} node
 *   Node.
 * @param {PlaceFields | undefined} [options]
 *   Node.
 * @returns {Point | Position}
 *   Position.
 */
export function maybePlace(state, node, options) {
  if (options && options.explicitPlace) return options.explicitPlace
  return toUnistPlace(state, node)
}
