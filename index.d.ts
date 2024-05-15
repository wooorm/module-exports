import type {Root} from 'mdast'
import type {Identifier, NumericLiteral, StringLiteral, Type} from 'typescript'
import type {VFileMessage} from 'vfile-message'

export {createFinder} from './lib/find.js'
export {defaultFormat} from './lib/format.js'

/**
 * Name fields.
 */
export interface Name {
  /**
   * Name node.
   */
  name: Identifier | NumericLiteral | StringLiteral
  /**
   * Serialized symbol name to sort on.
   */
  nameDisplay: string
  /**
   * Prefix to display before name.
   */
  nameDisplayPrefix: string
  /**
   * Suffix to display after name.
   */
  nameDisplaySuffix: string
}

/**
 * Result.
 */
export interface Result {
  /**
   * Messages.
   */
  messages: Array<VFileMessage>
  /**
   * Symbols.
   */
  symbols: Array<Symbol>
}

/**
 * Value with name.
 */
export interface Symbol extends Name, Value {}

/**
 * Value without name.
 */
export interface Value {
  /**
   * Symbol description.
   */
  description: Root | undefined
  /**
   * Symbol examples.
   */
  examples: Array<string>
  /**
   * Things this inherits from.
   */
  heritage: Array<Value>
  /**
   * Parameters.
   */
  parameters: Array<Symbol>
  /**
   * Properties.
   */
  properties: Array<Symbol>
  /**
   * Return value.
   */
  return: Value | undefined
  /**
   * Type of value itself.
   */
  typeExpression: Type
  /**
   * Seralized type.
   */
  typeExpressionDisplay: string
}
