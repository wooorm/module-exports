/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('typescript').JSDoc} JSDoc
 * @typedef {import('typescript').Node} Node
 */

import {comment} from './comment.js'

/**
 * @param {Node} node
 * @returns {Root | undefined}
 */
export function getMainComment(node) {
  return comment(getMainCommentRaw(node))
}

/**
 * @param {Node} node
 * @returns {Readonly<JSDoc> | undefined}
 */
export function getMainCommentRaw(node) {
  // Cast as it doesn’t exist in the types, but exists in practise.
  const jsDocs =
    ('jsDoc' in node
      ? /** @type {ReadonlyArray<JSDoc>} */ (node.jsDoc)
      : undefined) || []

  return jsDocs.at(-1)
}
