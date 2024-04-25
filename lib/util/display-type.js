/**
 * @typedef {import('typescript').Node} Node
 * @typedef {import('typescript').Type} Type
 *
 * @typedef {import('../types.js').FileState} FileState
 */

const typeFormatFlags =
  // `WriteArrayAsGenericType`:
  // `x[]` -> `Array<x>`
  2 |
  // `UseAliasDefinedOutsideCurrentScope`
  // `import('/Users/…/lib/types').Symbol` -> `Symbol`
  16_384 |
  // `InTypeAlias`
  // Actually displays the type instead of the name.
  8_388_608

/**
 *
 * @param {FileState} state
 * @param {Type} type
 * @param {Node} enclosingDeclaration
 * @returns {string}
 */
export function displayType(state, type, enclosingDeclaration) {
  const value = state.findState.typeChecker.typeToString(
    type,
    enclosingDeclaration,
    typeFormatFlags
  )
  return value
}
