# module-exports

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]

> 🐉 **Note**: this is new software doing complex things that hasn’t been used
> much.
> Here be dragons!

Get the exports of a module.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`Name`](#name)
  * [`Result`](#result)
  * [`Symbol`](#symbol)
  * [`Value`](#value)
  * [`createFinder()`](#createfinder)
  * [`defaultFormat(symbols)`](#defaultformatsymbols)
* [Compatibility](#compatibility)
* [Version](#version)
* [Thanks](#thanks)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package finds out what is exposed from a module.

## When should I use this?

You can use this to programatically figure out what can be used from a module.
Primarily, so that you can then generate docs.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 18+), install with [npm][npm-install]:

```sh
npm install module-exports
```

## Use

```js
import {toMarkdown} from 'mdast-util-to-markdown'
import {createFinder, defaultFormat} from 'module-exports'

const finder = createFinder()
const result = await finder(new URL('index.js', import.meta.url))

const tree = await defaultFormat(result.symbols)

console.log(toMarkdown(tree))
```

Yields:

```markdown
### `Name`

Name fields.

###### Fields

* `name` (`Identifier | NumericLiteral | StringLiteral`)
  — name node
* `nameDisplay` (`string`)
  — serialized symbol name to sort on
* `nameDisplayPrefix` (`string`)
  — prefix to display before name
* `nameDisplaySuffix` (`string`)
  — suffix to display after name

<!-- … -->

### `defaultFormat(symbols)`

Format symbols.

###### Parameters

* `symbols` (`ReadonlyArray<Symbol>`)
  — list of symbols

###### Returns

Promise to an mdast tree of formatted symbols (`Promise<Root>`).
```

## API

This package exports the identifiers
[`createFinder`][api-create-finder] and
[`defaultFormat`][api-default-format].
It exports the [TypeScript][] types
[`Name`][api-name],
[`Result`][api-result],
[`Symbol`][api-symbol], and
[`Value`][api-value].
There is no default export.

### `Name`

Name fields.

###### Fields

* `name` (`Identifier | NumericLiteral | StringLiteral`)
  — name node
* `nameDisplay` (`string`)
  — serialized symbol name to sort on
* `nameDisplayPrefix` (`string`)
  — prefix to display before name
* `nameDisplaySuffix` (`string`)
  — suffix to display after name

### `Result`

Result.

###### Fields

* `messages` (`Array<VFileMessage>`)
  — messages
* `symbols` (`Array<Symbol>`)
  — symbols

### `Symbol`

Value with name.

###### Extends

* `Name`
* `Value`

### `Value`

Value without name.

###### Fields

* `description` (`Root | undefined`)
  — symbol description
* `heritage` (`Array<Value>`)
  — things this inherits from
* `parameters` (`Array<Symbol>`)
  — parameters
* `properties` (`Array<Symbol>`)
  — properties
* `return` (`Value | undefined`)
  — return value
* `typeExpression` (`Type`)
  — type of value itself
* `typeExpressionDisplay` (`string`)
  — seralized type

### `createFinder()`

Create a finder.

###### Parameters

There are no parameters.

###### Returns

Finder (`(url: Readonly<URL>) => Promise<Result>`).

### `defaultFormat(symbols)`

Format symbols.

###### Parameters

* `symbols` (`ReadonlyArray<Symbol>`)
  — list of symbols

###### Returns

Promise to an mdast tree of formatted symbols (`Promise<Root>`).

## Compatibility

This projects is compatible with maintained versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `module-exports@2`,
compatible with Node.js 18.

## Version

`module-exports` does not strictly follow [SemVer](https://semver.org) yet
while being super new.

## Thanks

Special thanks go out to:

* [**@bertspaan**][github-bertspaan] for funding the initial development
* [**@mattdesl**][github-mattdesl] for the package name

## Security

This package is safe.

## Contribute

Yes please!
See [How to Contribute to Open Source][open-source-guide-contribute].

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[api-create-finder]: #createfinder

[api-default-format]: #defaultformatsymbols

[api-name]: #name

[api-result]: #result

[api-symbol]: #symbol

[api-value]: #value

[badge-build-image]: https://github.com/wooorm/module-exports/actions/workflows/main.yml/badge.svg

[badge-build-url]: https://github.com/wooorm/module-exports/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/wooorm/module-exports.svg

[badge-coverage-url]: https://codecov.io/github/wooorm/module-exports

[badge-downloads-image]: https://img.shields.io/npm/dm/module-exports.svg

[badge-downloads-url]: https://www.npmjs.com/package/module-exports

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-bertspaan]: https://github.com/bertspaan

[github-mattdesl]: https://github.com/mattdesl

[npm-install]: https://docs.npmjs.com/cli/install

[open-source-guide-contribute]: https://opensource.guide/how-to-contribute/

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com
