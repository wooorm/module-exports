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
