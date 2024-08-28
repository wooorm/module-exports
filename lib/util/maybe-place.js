/**
 * @import {Node} from 'typescript'
 * @import {Point, Position} from 'unist'
 * @import {FileState, PlaceFields} from '../types.js'
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
