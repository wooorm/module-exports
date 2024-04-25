/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('typescript').JSDocComment} JSDocComment
 */

import {ok as assert} from 'devlop'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {gfm} from 'micromark-extension-gfm'

/**
 * @param {import('typescript').NodeArray<JSDocComment> | string} value
 *   Value.
 * @returns {Root}
 *   Root.
 */
export function markdown(value) {
  // To do: support JSDocLink, JSDocLinkCode, JSDocLinkPlain.
  assert(typeof value === 'string')
  return fromMarkdown(value, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  })
}
