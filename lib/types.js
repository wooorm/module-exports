/**
 * @typedef {import('module-exports').Symbol} Symbol
 *
 * @typedef {import('typescript').ParsedCommandLine} ParsedCommandLine
 * @typedef {import('typescript').Program} Program
 * @typedef {import('typescript').SourceFile} SourceFile
 * @typedef {import('typescript').TypeChecker} TypeChecker
 *
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 */

/**
 * @typedef FindState
 *   Info passed around about a config.
 * @property {ParsedCommandLine} commandLine
 * @property {Map<string, string>} toSource
 * @property {Program} program
 * @property {TypeChecker} typeChecker
 */

/**
 * @typedef FileState
 *   Info passed around about a file.
 * @property {FindState} findState
 *   Info passed around about a config.
 * @property {Array<VFileMessage>} messages
 *   Symbols.
 * @property {SourceFile} sourceFile
 *   File.
 * @property {Array<Symbol>} symbols
 *   Symbols.
 */

export {}
