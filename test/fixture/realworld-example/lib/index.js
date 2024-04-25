// This is a real example from <https://github.com/wooorm/collapse-white-space>
/**
 * @typedef {'html' | 'js'} Style
 *   Style of white space to support.
 *   JavaScript white space matches the pattern `\s`.
 *   HTML white space matches `[\t\n\v\f\r ]`.
 *
 * @typedef Options
 *   Configuration.
 * @property {Style | null | undefined} [style='js']
 *   Style of white space to support.
 * @property {boolean | null | undefined} [preserveLineEndings=false]
 *   Whether to collapse white space containing a line ending to that line
 *   ending.
 *   The default is to collapse to a single space.
 *   Line endings matches the pattern `\r?\n|\r`.
 * @property {boolean | null | undefined} [trim=false]
 *   Whether to drop white space at the start and end of `value`.
 *   The default is to keep it.
 */

const js = /\s+/g
const html = /[\t\n\v\f\r ]+/g

/**
 * Collapse white space.
 *
 * @param {string} value
 *   Value to collapse white space in.
 * @param {Options | Style | null | undefined} [options='js']
 *   Configuration (optional).
 * @returns {string}
 *   Value with collapsed white space.
 */
export function collapseWhiteSpace(value, options) {
  if (!options) {
    options = {}
  } else if (typeof options === 'string') {
    options = {style: options}
  }

  const replace = options.preserveLineEndings ? replaceLineEnding : replaceSpace

  return String(value).replace(
    options.style === 'html' ? html : js,
    options.trim ? trimFactory(replace) : replace
  )
}

/**
 * Replace white space with a line ending as that line ending and otherwise a
 * space.
 *
 * @param {string} value
 * @returns {string}
 */
function replaceLineEnding(value) {
  const match = /\r?\n|\r/.exec(value)
  return match ? match[0] : ' '
}

/**
 * Replace white space with a space.
 *
 * @returns {string}
 */
function replaceSpace() {
  return ' '
}

/**
 * @param {(value: string) => string} replace
 */
function trimFactory(replace) {
  return dropOrReplace

  /**
   * Replace white space with nothing if it starts or ends the string.
   * Calls `replace` otherwise.
   *
   * @param {string} value
   * @param {number} index
   * @param {string} all
   * @returns {string}
   */
  function dropOrReplace(value, index, all) {
    return index === 0 || index + value.length === all.length
      ? ''
      : replace(value)
  }
}
