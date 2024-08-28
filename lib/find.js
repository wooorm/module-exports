/**
 * @import {Result, Symbol} from 'module-exports'
 * @import {Node, ParsedCommandLine, Program, Symbol as TypeScriptSymbol, TypeChecker} from 'typescript'
 * @import {FileState} from './types.js'
 */

import assert from 'node:assert/strict'
import path from 'node:path'
import process from 'node:process'
import {fileURLToPath, pathToFileURL} from 'node:url'
import pluralize from 'pluralize'
import typescript from 'typescript'
import {VFileMessage} from 'vfile-message'
import {compareMessage} from 'vfile-sort'
import {declaration} from './transform/declaration.js'
import {exportAssignment} from './transform/concrete/export-assignment.js'
import {exportDeclaration} from './transform/concrete/export-declaration.js'
import {jsdocCallbackTag} from './transform/concrete/jsdoc-callback-tag.js'
import {jsdocTypedefTag} from './transform/concrete/jsdoc-typedef-tag.js'
import {variableStatement} from './transform/concrete/variable-statement.js'

// @ts-ignore: sometimes not available.
const listFormat = new Intl.ListFormat('en')

/**
 * Create a finder.
 *
 * @returns
 *   Finder.
 */
export function createFinder() {
  /** @type {Map<string, {commandLine: ParsedCommandLine, toSource: Map<string, string>, program: Program, typeChecker: TypeChecker}>} */
  const map = new Map()

  return finder

  /**
   * Find symbols in a file.
   *
   * @param {Readonly<URL>} url
   *   Destination URL.
   * @returns {Promise<Result>}
   *   Symbols.
   */
  async function finder(url) {
    const filePath = fileURLToPath(url)
    const configPath = typescript.findConfigFile(
      filePath,
      typescript.sys.fileExists,
      'tsconfig.json'
    )

    if (!configPath) {
      throw new VFileMessage(
        'Could not find `tsconfig.json` from `' +
          url +
          '`; TypeScript must be configured to find symbols in files'
      )
    }

    let cached = map.get(configPath)

    if (!cached) {
      const commandLine = typescript.getParsedCommandLineOfConfigFile(
        configPath,
        undefined,
        {
          fileExists: typescript.sys.fileExists,
          getCurrentDirectory: typescript.sys.getCurrentDirectory,
          /* c8 ignore next 3 -- to do: figure out when this is called. */
          onUnRecoverableConfigFileDiagnostic(x) {
            console.warn('to do:unrecoverable diagnostic', x)
          },
          readDirectory: typescript.sys.readDirectory,
          readFile: typescript.sys.readFile,
          useCaseSensitiveFileNames: typescript.sys.useCaseSensitiveFileNames
        }
      )

      assert(commandLine) // Always defined.

      const program = typescript.createProgram({
        options: commandLine.options,
        rootNames: commandLine.fileNames
      })

      const typeChecker = program.getTypeChecker()

      /** @type {Map<string, string>} */
      const toSource = new Map()

      for (const from of commandLine.fileNames) {
        let to = [
          ...typescript.getOutputFileNames(
            commandLine,
            from,
            typescript.sys.useCaseSensitiveFileNames
          )
        ]

        const parts = path.basename(from).split('.')
        const extname = parts.at(-1)

        // To do: TSX?
        if (
          parts.at(-2) === 'd' &&
          (extname === 'cts' || extname === 'mts' || extname === 'ts')
        ) {
          to = [
            // Should probably be empty.
            ...to,
            // This is the one we want to add:
            path.dirname(from) +
              // Always `/` even on Windows.
              '/' +
              parts.slice(0, -2) +
              '.' +
              extname.replace('t', 'j')
          ]
        }

        for (const destination of to) {
          toSource.set(destination, from)
        }
      }

      cached = {commandLine, toSource, program, typeChecker}
      map.set(configPath, cached)
    }

    const [diagnostic] = cached.commandLine.errors

    if (diagnostic) {
      throw new VFileMessage('Could not load `tsconfig.json`', {
        cause: diagnosticToMessage(diagnostic)
      })
    }

    let typescriptFilePath = filePath

    /* c8 ignore next 3 */
    if (process.platform === 'win32') {
      typescriptFilePath = filePath.replace(/\\/g, '/')
    }

    const mappedUrl =
      // Starts with `/`, remove it:
      cached.toSource.get(typescriptFilePath.slice(1)) ||
      cached.toSource.get(typescriptFilePath) ||
      typescriptFilePath
    const sourceFile = cached.program.getSourceFile(mappedUrl)
    const configFolder = path.dirname(configPath)

    if (!sourceFile) {
      const available = new Set(
        [...cached.toSource.keys(), ...cached.toSource.values()].map((d) => {
          return relativePathToFilePath(path.relative(configFolder, d))
        })
      )

      throw new VFileMessage(
        'Could not figure out source file for `' +
          relativePathToFilePath(path.relative(configFolder, mappedUrl)) +
          '`; the ' +
          pluralize('files', available.size) +
          ' ' +
          listFormat.format([...available].sort().map((d) => '`' + d + '`')) +
          ' ' +
          pluralize('is', available.size) +
          ' available from `' +
          pathToFileURL(configFolder) +
          '`',
        {ruleId: 'missing-file', source: 'module-exports'}
      )
    }

    /** @type {FileState} */
    const state = {findState: cached, messages: [], sourceFile, symbols: []}

    // We need to find `@typedefs`, in the global scope, for JS.
    // Those could be “attached” to any node.
    // So we look through `locals` instead and find the ones that are
    const locals = /** @type {Map<string, TypeScriptSymbol>} */ (
      // @ts-expect-error: to do: figure out the TS API they want...
      sourceFile.locals
    )

    for (const symbol of locals.values()) {
      if (symbol.declarations) {
        for (const node of symbol.declarations) {
          if (typescript.isJSDocCallbackTag(node)) {
            addSymbols(state, jsdocCallbackTag(state, node))
          }

          if (typescript.isJSDocTypedefTag(node)) {
            addSymbols(state, jsdocTypedefTag(state, node))
          }
        }
      }
    }

    typescript.forEachChild(state.sourceFile, (d) => visit(state, d))

    return {
      messages: [...state.messages].sort(compareMessage),
      symbols: state.symbols
    }
  }
}

/**
 * Check direct children of a source file.
 *
 * Important: this does not recurse into all descendants.
 *
 * @param {FileState} state
 *   Info passed around.
 * @param {Node} node
 *   Node.
 * @returns {undefined}
 *   Nothing.
 */
function visit(state, node) {
  if (typescript.isExportAssignment(node)) {
    addSymbols(state, exportAssignment(state, node))
    return
  }

  if (typescript.isExportDeclaration(node)) {
    addSymbols(state, exportDeclaration(state, node))
    return
  }

  if (typescript.canHaveModifiers(node)) {
    const modifiers = typescript.getModifiers(node) || []
    const exported = modifiers.find(
      (d) => d.kind === typescript.SyntaxKind.ExportKeyword
    )
    if (exported) {
      // I think these are the only things that can have an export modifier??
      assert(
        node.kind === typescript.SyntaxKind.ClassDeclaration ||
          node.kind === typescript.SyntaxKind.EnumDeclaration ||
          node.kind === typescript.SyntaxKind.FunctionDeclaration ||
          node.kind === typescript.SyntaxKind.ImportEqualsDeclaration ||
          node.kind === typescript.SyntaxKind.InterfaceDeclaration ||
          // Note: `ModuleDeclaration` is not supported here yet.
          node.kind === typescript.SyntaxKind.ModuleDeclaration ||
          node.kind === typescript.SyntaxKind.TypeAliasDeclaration ||
          node.kind === typescript.SyntaxKind.VariableStatement
      )

      addSymbols(
        state,
        typescript.isVariableStatement(node)
          ? variableStatement(state, node)
          : declaration(state, node)
      )
    }
  }
}

/**
 * @param {FileState} state
 * @param {Array<Symbol> | Symbol | undefined} values
 * @returns {undefined}
 */
function addSymbols(state, values) {
  if (Array.isArray(values)) {
    state.symbols.push(...values)
  } else if (values) {
    state.symbols.push(values)
  }
}

/**
 * @param {typescript.Diagnostic} diagnostic
 *  Diagnostic.
 * @returns {VFileMessage}
 *  Message.
 */
function diagnosticToMessage(diagnostic) {
  const reason = typescript.flattenDiagnosticMessageText(
    diagnostic.messageText,
    '\n'
  )

  const message = new VFileMessage(reason, {})
  message.fatal = diagnostic.category === 1
  return message
}

/**
 * @param {string} d
 * @returns {string}
 */
function relativePathToFilePath(d) {
  return d.split(path.sep).join('/')
}
