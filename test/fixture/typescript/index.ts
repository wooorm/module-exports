/* eslint-disable @typescript-eslint/parameter-properties, @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-namespace, @typescript-eslint/no-unsafe-return */

/**
 * General description alpha.
 *
 * @type {string}
 *   Specific `type` description.
 */
export const explicitJsdocTypeAndComment = 'Alpha'

/**
 * General description bravo.
 *
 * @type {string}
 */
export const explicitJsdocType = 'Bravo'

/**
 * General description charlie.
 */
export const explicitType: string = 'Charlie'

/**
 * General description delta.
 */
export const implicitTypeAndComment = 'Delta'

export const implicitType = 'Echo'

/**
 * General description alpha.
 *
 * @param a
 *   Value.
 * @param b
 *   Other value.
 * @return
 *   Result.
 */
export function explicitParametersAndReturnWithComments(
  a: number,
  b: number
): number {
  return a + b
}

/**
 * General description bravo.
 */
export function explicitParametersAndReturn(a: number, b: number) {
  return a + b
}

/**
 * General description charlie.
 */
export function implicitParametersAndReturn(a, b) {
  return a + b
}

export function implicit(a, b) {
  return a + b
}

/**
 * General description alpha.
 */
export class Sum {
  /**
   * General description bravo.
   */
  static [staticKey: string]: boolean

  /**
   * General description charlie.
   */
  [name: string]: string | number

  /**
   * General description delta.
   *
   * @param a
   *   Value.
   * @param b
   *   Other value.
   * @return
   *   Self.
   */
  constructor(
    public a: number,
    public b: number
  ) {
    this.a = a
    this.b = b
  }
}

/**
 * Parent class comment.
 */
export class SomeClass {
  /**
   * Value.
   */
  readonly value: number

  /**
   * Parent constructor.
   *
   * @param value
   *   Value.
   * @returns
   *   Self.
   */
  constructor(value: number) {
    this.value = value
  }
}

/**
 * Child class comment.
 */
export class MiniClass extends SomeClass {
  /**
   * Child class method.
   *
   * @returns
   *   Value.
   */
  double() {
    return this.value * 2
  }
}

/**
 * TypeScript-only things…
 */
export enum Enum {
  /**
   * Alpha.
   */
  A = 'a',
  /**
   * Bravo.
   */
  B = 'b'
}

// This is sort of like a `let` for namespaces.
export import x = M.x

namespace M {
  export const x = 'x'
}
