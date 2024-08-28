/**
 * @import {Root} from 'mdast'
 * @import {JSDoc, JSDocTag} from 'typescript'
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
