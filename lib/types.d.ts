import type {Symbol} from 'module-exports'
import type {
  Identifier,
  ParsedCommandLine,
  Program,
  SourceFile,
  TypeChecker
} from 'typescript'
import type {Point, Position} from 'unist'
import type {VFileMessage} from 'vfile-message'

/**
 * Info passed around about a named place.
 */
export interface NamedPlaceFields extends PlaceFields {
  explicitName?: Identifier | undefined
}

/**
 * Info passed around about a place.
 */
export interface PlaceFields {
  explicitPlace?: Point | Position | undefined
}

/**
 * Info passed around about a config.
 */
export interface FindState {
  commandLine: ParsedCommandLine
  toSource: Map<string, string>
  program: Program
  typeChecker: TypeChecker
}

/**
 * Info passed around about a file.
 */
export interface FileState {
  /**
   *   Info passed around about a config.
   */
  findState: FindState
  /**
   *   Symbols.
   */
  messages: Array<VFileMessage>
  /**
   *   File.
   */
  sourceFile: SourceFile
  /**
   *   Symbols.
   */
  symbols: Array<Symbol>
}
