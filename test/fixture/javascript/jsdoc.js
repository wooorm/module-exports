/**
 * @typedef {import('../typescript/index.ts').MiniClass} RenamedClass
 */

/**
 * Comment before.
 *
 * @callback SomeFunction
 *   Comment at.
 * @param {number} left
 *   Value.
 * @param {number | null | undefined} [right]
 *   Other value.
 * @returns {number}
 *   Result.
 */

/**
 * @callback
 *   What?
 */

/**
 * @callback
 */

/**
 * @callback SomeCallback
 * @param {number} value
 * @returns {number}
 */

/**
 * Comment before.
 *
 * @typedef TypedefWithProperties
 *   Comment at.
 * @property {string} special
 *   Special field.
 * @property {string | number} [asdf]
 *   Some optional field.
 */

/**
 * Two strings.
 *
 * @typedef {'x' | 'y'} TypedefWithType
 */

/**
 * @typedef {TypedefWithProperties | TypedefWithType} Union
 *   Union of two types.
 */

// @ts-expect-error -- weird stuff.
/** @typedef More */

// @ts-expect-error -- weird stuff.
/** @typedef {} AndMore */

/**
 * @typedef SomeObject
 *   Object.
 * @property {string} string
 * @property {number} number
 *   Bravo.
 * @property {boolean} boolean
 *   Charlie.
 * @property {Array<string>} array
 *   Delta.
 * @property {ReadonlyArray<string>} readonlyArray
 *   Echo.
 * @property {Set<string>} set
 *   Foxtrot.
 * @property {Map<string, string>} map
 *   Golf.
 * @property {Record<string, string>} record
 *   Hotel.
 * @property {string} [optional]
 *   India.
 * @property {string} [default='alpha']
 *   Juliet.
 * @property {string | null | undefined} [nullish]
 *   Kilo.
 */

/**
 * Lorem ipsum dolor sit amet.
 * See {@link}, {@link that}, and {@link RenamedClass}.
 * Also, check out {@link http://www.google.com | Google} and
 * {@link https://github.com GitHub}.
 *
 * Apparently there’s also {@linkcode https://example.com}
 * and {@linkplain https://example.com}.
 *
 * What if you do {@unknown} or {@unknown unknown}?
 *
 * Or other things,
 * such as {@link mailto:user@example.com Label}.
 *
 * And {@link RenamedClass#value | some label}?
 *
 * What about regular markdown?
 * To a URL: [Google](http://www.google.com),
 * to a symbol as a resource link: [RenamedClass](RenamedClass),
 * and to a symbol as reference links: [RenamedClass][RenamedClass],
 * [RenamedClass][], [RenamedClass].
 *
 * And what about {@link RenamedClass `RenamedClass`},
 * or `{@link RenamedClass}`?
 *
 * @typedef {[name: number]} SomeDocumentedTuple
 */

/**
 * Lorem ipsum dolor sit amet.
 *
 * @example
 *   // Before.
 *   console.log('Hello, Mars!')
 * @typedef {[name: number]} SomeExemplaryTuple
 *   Tuple.
 * @example
 *   // After.
 *   console.log(3 + 4) // 7
 */

/**
 * Lorem ipsum dolor sit amet.
 *
 * @example
 *   // Before.
 *   console.log('Hello, Venus!')
 * @typedef SomeExemplaryType
 *   Type.
 * @property {string} field
 *   The field.
 * @example
 *   // After.
 *   console.log(2 + 3) // 5
 */
