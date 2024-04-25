### `Options`

Configuration.

###### Fields

* `preserveLineEndings?` (`boolean | null | undefined`)
  — whether to collapse white space containing a line ending to that line
  ending.
  The default is to collapse to a single space.
  Line endings matches the pattern `\r?\n|\r`
* `style?` (`Style | null | undefined`)
  — style of white space to support
* `trim?` (`boolean | null | undefined`)
  — whether to drop white space at the start and end of `value`.
  The default is to keep it

### `Style`

Style of white space to support (`'html' | 'js'`).
JavaScript white space matches the pattern `\s`.
HTML white space matches `[\t\n\v\f\r ]`.

### `collapseWhiteSpace(value, options)`

Collapse white space.

###### Parameters

* `value` (`string`)
  — value to collapse white space in
* `options` (`Options | Style | null | undefined`)
  — configuration (optional)

###### Returns

Value with collapsed white space (`string`).
