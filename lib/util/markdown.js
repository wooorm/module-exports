/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('typescript').JSDocComment} JSDocComment
 */

import {ok as assert} from 'devlop'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {gfm} from 'micromark-extension-gfm'
import {removePosition} from 'unist-util-remove-position'

/**
 * @param {import('typescript').NodeArray<JSDocComment> | string} value
 *   Value.
 * @returns {Root}
 *   Root.
 */
export function markdown(value) {
  // To do: support JSDocLink, JSDocLinkCode, JSDocLinkPlain.
  assert(typeof value === 'string')
  const tree = fromMarkdown(value, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  })
  removePosition(tree, {force: true})
  return tree
}
