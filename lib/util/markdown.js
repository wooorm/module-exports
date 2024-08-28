/**
 * @import {PhrasingContent, Root} from 'mdast'
 * @import {JSDocComment, NodeArray} from 'typescript'
 */

import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'
import {gfmFromMarkdown, gfmToMarkdown} from 'mdast-util-gfm'
import {gfm} from 'micromark-extension-gfm'
import {unicodeWhitespace} from 'micromark-util-character'
import typescript from 'typescript'
import {removePosition} from 'unist-util-remove-position'

/**
 * @param {NodeArray<JSDocComment> | string} value
 *   Value.
 * @returns {Root}
 *   Root.
 */
export function markdown(value) {
  let markdown = ''

  if (typeof value === 'string') {
    markdown = value.replace(/\r\n/g, '\n')
  } else {
    for (const entry of value) {
      if (entry.kind === typescript.SyntaxKind.JSDocText) {
        // Just text.
        markdown += entry.text.replace(/\r\n/g, '\n')
      } else {
        let key = entry.name?.getText() || ''
        let text = entry.text.replace(/\r\n/g, '\n')
        let symbol = true

        // There’s no way to know if this could reference some symbol or a URL,
        // it could be both.
        // If the text is `:`-prefixed and the `key` looks like a valid protocol,
        // assume there was no ` ` before it.
        // We could in the future allow only a certain list of protocols.
        // For the protocol, see:
        // <https://github.com/wooorm/markdown-rs/blob/cdda7a7/src/construct/autolink.rs#L12>.
        if (
          /^[A-Za-z][A-Za-z\d+\-.]{0,31}$/.test(key) &&
          text.charAt(0) === ':'
        ) {
          symbol = false

          // Assume the URL stops at the first whitespace.
          let index = 0

          while (
            index < text.length &&
            !unicodeWhitespace(text.charCodeAt(index))
          ) {
            index++
          }

          key += text.slice(0, index)
          text = text.slice(index)
        }

        let index = 0

        // Skip whitespace.
        while (
          index < text.length &&
          unicodeWhitespace(text.charCodeAt(index))
        ) {
          index++
        }

        if (text.charCodeAt(index) === 124 /* `|` */) {
          index++

          // Skip more whitespace.
          while (
            index < text.length &&
            unicodeWhitespace(text.charCodeAt(index))
          ) {
            index++
          }
        }

        // Add some default.
        // Idea: drop the protocol, and slashes?
        let value = text.slice(index) || key
        let code = entry.kind === typescript.SyntaxKind.JSDocLinkCode

        // People sometimes use markdown syntax for code *inside* the label.
        // Instead, unwrap it, and mark it as code.
        if (
          value.charCodeAt(0) === 96 /* ` */ &&
          value.charCodeAt(value.length - 1) === 96 /* ` */
        ) {
          code = true
          value = value.slice(1, -1)
        }

        /** @type {PhrasingContent} */
        let node = code ? {type: 'inlineCode', value} : {type: 'text', value}

        // To do: add support for symbol references.
        if (!symbol) {
          node = {type: 'link', url: key, title: undefined, children: [node]}
        }

        let result = toMarkdown(node, {extensions: [gfmToMarkdown()]})

        if (result.charAt(result.length - 1) === '\n') {
          result = result.slice(0, -1)
        }

        markdown += result
      }
    }
  }

  const tree = fromMarkdown(markdown, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  })

  removePosition(tree, {force: true})

  return tree
}
