/**
 * @typedef {import('typescript').JSDoc} JSDoc
 * @typedef {import('typescript').JSDocTag} JSDocTag
 * @typedef {import('typescript').Node} Node
 */

import {ok as assert} from 'devlop'
import {toString} from 'mdast-util-to-string'
import {markdown} from './markdown.js'

/**
 * @param {JSDoc} parent
 * @param {JSDocTag} node
 * @returns {Array<string>}
 */
export function findExamplesBefore(parent, node) {
  /** @type {Array<string>} */
  const examples = []
  const tags = parent.tags
  assert(tags) // Always defined.
  let index = tags.indexOf(node)
  assert(index !== -1) // Has to be a child.

  while (index > 0) {
    const tag = tags[index - 1]

    if (tag.tagName.getText() === 'example') {
      if (tag.comment) examples.push(toString(markdown(tag.comment)))
    } else {
      break
    }

    index--
  }

  // We looped backwards.
  examples.reverse()

  return examples
}

/**
 * @param {Node} node
 * @returns {Array<string>}
 */
export function findExamples(node) {
  /** @type {Array<string>} */
  const examples = []
  // Cast as it doesn’t exist in the types, but exists in practise.
  const jsDocs =
    ('jsDoc' in node
      ? /** @type {ReadonlyArray<JSDoc>} */ (node.jsDoc)
      : undefined) || []

  const tail = jsDocs.at(-1)

  if (tail && tail.tags) {
    for (const tag of tail.tags) {
      if (tag.tagName.getText() === 'example' && tag.comment) {
        examples.push(toString(markdown(tag.comment)))
      }
    }
  }

  return examples
}
