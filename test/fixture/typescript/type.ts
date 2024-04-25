/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/consistent-type-definitions */

/**
 * Stuff!
 */
export type SomeType = {
  /**
   * Index signature.
   */
  [key: string]: Function | string | number
  /**
   * Regular field.
   */
  field: string
  /**
   * Optional field.
   */
  optionalField?: string | null | undefined
  /**
   * Computed.
   */
  ['a']: string
  /**
   * Computed template.
   */
  [`b`]: number
  /**
   * Method.
   */
  method(): undefined
  /**
   * Computed method.
   */
  ['computed method'](): undefined
  /**
   * Getter.
   */
  get getter(): undefined
  /**
   * Setter.
   */
  set setter(value: string)
}

// To do: support multiple call / construct signatures.
/**
 * A type with fields and two call signatures (overloads).
 */
export type Add = {
  /**
   * Add two strings.
   */
  (leftString: string, rightString: string): string
  /**
   * Add two numbers.
   */
  (leftNumber: number, rightNumber: number): number

  /**
   * Some random field with some value.
   */
  andSomeField: 1
  /**
   * Some random constructor.
   */
  new (enabled: boolean): undefined
  /**
   * Get, set.
   */
  get getSet(): number
  /**
   * Set, get.
   */
  set getSet(value)
  /**
   * Private get, set.
   */
  get #hiddenGetSet(): number
  /**
   * Private set, get.
   */
  set #hiddenGetSet(value)
  /**
   * Computed getter.
   */
  get ['x' + 1](): number
  /**
   * Computed getter (template?).
   */
  get [`x`](): number
  /**
   * Computed setter.
   */
  set ['x' + 2](value: number)
}

// To do: support parenthesized.
/**
 * Type alias with a call signature and fields
 */
export type Callback = ((
  error: Error | undefined,
  result: SomeType
) => undefined) & {
  /**
   * Field
   */
  field: string
}

/**
 * Union of two literals.
 */
export type Another = 'stuff' | 'thing'

/**
 * Union of `Something` and `Another`.
 */
export type Union = Another | SomeType

export type Undocumented = 123

/**
 * Stuff!
 */
export interface SomeInterface {
  [key: string]: string | number
  special: string
  (a: string): void
}

/**
 * Nothing special.
 */
export interface Inheriting extends SomeInterface {}
