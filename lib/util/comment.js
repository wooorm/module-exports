/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('typescript').JSDoc} JSDoc
 * @typedef {import('typescript').JSDocTag} JSDocTag
 */

import {markdown} from './markdown.js'

/**
 * @param {JSDoc | JSDocTag | undefined} node
 *   Node.
 * @returns {Root | undefined}
 *   Root.
 */
export function comment(node) {
  return node && node.comment ? markdown(node.comment) : undefined
}
