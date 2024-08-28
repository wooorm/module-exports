/* eslint-disable func-names, func-name-matching, no-useless-computed-key */

/**
 * General description alpha.
 *
 * @param {number} a
 *   Value.
 * @param {number} b
 *   Other value.
 * @return {number}
 *   Result.
 */
export function explicitParametersAndReturnWithComments(a, b) {
  return a + b
}

/**
 * General description alpha.
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function explicitParametersAndReturn(a, b) {
  return a + b
}

/**
 * General description alpha.
 */
export function implicitParametersAndReturn(a, b) {
  return a + b
}

export function implicit(a, b) {
  return a + b
}

/**
 * @param {number} a
 *   Alpha.
 * @param {number} a
 *   Bravo.
 * @returns {number}
 *   Double a.
 */
export function repeated(a) {
  return a * 2
}

/**
 * Create a generator.
 *
 * @param {string} value
 *   Value.
 * @returns {Generator<string, undefined, unknown>}
 *   Generator of uppercase letters.
 */
export function* generator(value) {
  for (const element of value) {
    yield element.toUpperCase()
  }
}

/**
 * Create a delayed uppercaser.
 *
 * @param {string} value
 *   Value.
 * @returns {Promise<string>}
 *   Async uppercase.
 */
export async function delayed(value) {
  return value.toUpperCase()
}

/**
 * Fun expression.
 *
 * @param {unknown} _
 * @returns {undefined}
 */
export const namedFunctionExpression = function someName(_) {
  return undefined
}

/**
 * Anonymous but also fun expression.
 *
 * @param {unknown} _
 * @returns {undefined}
 */
export const anonymousFunctionExpression = function (_) {
  return undefined
}

/**
 * Fun class.
 */
export const NamedClassExpression = class SomeName {
  /**
   * Array.
   */
  someArray = ['a', 'b']
  /**
   * Bint.
   */
  someBigInt = 1n
  /**
   * False.
   */
  someFalse = false
  /**
   * Null.
   */
  someNull = /** @type {null} */ (null)
  /**
   * Number.
   */
  someNumber = 0
  /**
   * Object.
   */
  someObject = {a: 1}
  /**
   * String.
   */
  someString = 'a'
  /**
   * True.
   */
  someTrue = true
  /**
   * Undefined.
   */
  undefined = /** @type {undefined} */ (undefined)
}

/**
 * Fun class.
 */
export const AnonymousClassExpression = class {
  /**
   * Field on anonymous class.
   */
  somePropertyOnAnonymousClass = 0
}

/**
 * Arrow expression.
 *
 * @param {unknown} _
 * @returns {undefined}
 */
export const arrowExpression = (_) => undefined

/**
 * General description alpha.
 */
export class Sum {
  /**
   * General description bravo.
   */
  #privateProperty = 0

  /**
   * General description charlie.
   */
  publicProperty = 0;

  ['computed'] = 1

  /**
   * General description delta.
   */
  static staticProperty = 0

  static {
    this.staticBlockPropert = 0
  }

  /**
   * Some static member doing things.
   *
   * @returns {number}
   *   Result.
   */
  static someFunction() {
    return 1
  }

  /**
   * General description echo.
   *
   * @param {number} a
   *   Value.
   * @param {number} b
   *   Other value.
   * @return
   *   Self.
   */
  constructor(a, b) {
    console.log(this.#privateProperty)
    this.a = a
    this.b = b
  }

  /**
   * General description foxtrot.
   *
   * @return {number}
   *   Result.
   */
  sum() {
    return this.a + this.b
  }

  /**
   * General description golf.
   *
   * @param {number} a
   *   Thing.
   * @returns
   *   A bit more.
   */
  ['computed' + 1](a) {
    return a + 1
  }

  /**
   * General description hotel.
   *
   * @example
   *   const sum = new Sum(1, 2)
   *   console.log(sum.c) // 'c'
   * @returns {string}
   *   Just `c`.
   */
  get c() {
    return 'c'
  }

  /**
   * General description india.
   *
   * @param {unknown} value
   *   Something.
   * @returns {undefined}
   *   Nothing.
   */
  set c(value) {
    console.log(value)
  }

  // Something undocumented.
  d() {
    return 1
  }

  // Private undocumented.
  #e() {
    return 1
  }
}

// An undocumented class.
export class Example {
  get a() {
    return 'x'
  }

  set a(value) {}

  toString() {
    return 'Example'
  }

  undocumented = 123
}

/**
 * General description alpha.
 *
 * @type {string}
 *   Specific `type` description.
 */
export const explicitTypeAndComment = 'Alpha'

/**
 * General description bravo.
 *
 * @type {string}
 */
export const explicitType = 'Bravo'

/**
 * General description charlie.
 */
export const implicitTypeAndComment = 'Charlie'

export const implicitType = 'Delta'
const someValue = 42
const undocumentedShorthand = Math.PI

const otherValues = {
  key: 'value'
}

/**
 * General description alpha.
 */
export const someObject = {
  /**
   * General description bravo.
   */
  publicProperty: 0,

  ['computed' + 2]: 1,

  /**
   * General description charlie.
   *
   * @returns {number}
   *   Result.
   */
  someFunction() {
    return 2
  },

  /**
   * General description delta.
   */
  someValue,

  /**
   * General description echo.
   */
  ...otherValues,

  /**
   * General description foxtrot.
   */
  get getSet() {
    return 1
  },

  /**
   * General description golf.
   */
  set getSet(value) {
    console.warn(value)
  },

  undocumentedShorthand,

  undocumented: 1
}

/**
 * Lorem.
 *
 * @returns
 *   Ipsum.
 */
export default function defaultExport() {
  return 1
}

/**
 * Exemplary value.
 *
 * @example
 *   console.log(exemplary) // 1
 */
export const exemplary = 1
