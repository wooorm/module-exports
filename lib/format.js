/**
 * @typedef {import('mdast').BlockContent} BlockContent
 * @typedef {import('mdast').DefinitionContent} DefinitionContent
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').RootContent} RootContent
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('module-exports').Value} Value
 * @typedef {import('module-exports').Symbol} Symbol
 */

import structuredClone from '@ungap/structured-clone'
import {ok as assert} from 'devlop'
import {format} from 'prettier'

/**
 * Format symbols.
 *
 * @param {ReadonlyArray<Symbol>} symbols
 *   List of symbols.
 * @returns {Promise<Root>}
 *   Promise to an mdast tree of formatted symbols.
 */
export async function defaultFormat(symbols) {
  const results = await Promise.all(
    sortValues(symbols).map(function (symbol) {
      return formatValue(symbol)
    })
  )

  return {type: 'root', children: results.flat()}
}

/**
 * @param {Readonly<Symbol>} symbol
 * @returns {Promise<Array<RootContent>>}
 */
async function formatValue(symbol) {
  /** @type {Array<RootContent>} */
  const children = []

  // Basic function.
  if (symbol.return) {
    const parameters = await Promise.all(
      symbol.parameters.map(function (symbol) {
        return formatField(symbol)
      })
    )
    const returnDisplay = await prettierFormat(
      symbol.return.typeExpressionDisplay
    )

    children.push(
      // To do: switch to h5 when long jsdoc.
      {
        type: 'heading',
        depth: 6,
        children: [{type: 'text', value: 'Parameters'}]
      },
      parameters.length > 0
        ? {
            type: 'list',
            spread: false,
            ordered: false,
            children: parameters
          }
        : {
            type: 'paragraph',
            children: [{type: 'text', value: 'There are no parameters.'}]
          },
      // To do: switch to h5 when long jsdoc.
      {
        type: 'heading',
        depth: 6,
        children: [{type: 'text', value: 'Returns'}]
      },
      ...addTypeToDescription(symbol.return.description, returnDisplay)
    )
  }

  // Something with heritage clauses.
  if (symbol.heritage.length > 0) {
    children.push(
      // To do: switch to h5 when long jsdoc.
      {
        type: 'heading',
        depth: 6,
        children: [{type: 'text', value: 'Extends'}]
      },
      {
        type: 'list',
        spread: false,
        ordered: false,
        children: await Promise.all(
          symbol.heritage.map(function (value) {
            return formatExpressionValue(value)
          })
        )
      }
    )
  }

  // Something with properties.
  if (symbol.properties.length > 0) {
    children.push(
      // To do: switch to h5 when long jsdoc.
      {
        type: 'heading',
        depth: 6,
        children: [{type: 'text', value: 'Fields'}]
      },
      {
        type: 'list',
        spread: false,
        ordered: false,
        children: await Promise.all(
          sortValues(symbol.properties).map(function (symbol) {
            return formatField(symbol)
          })
        )
      }
    )
  }

  /** @type {Array<RootContent>} */
  const description = []

  const typeDisplay = await prettierFormat(symbol.typeExpressionDisplay)

  // If there are fields we don’t need to show the type of the item itself.
  if (children.length > 0) {
    if (symbol.description) description.push(...symbol.description.children)
  }
  // If there is a description and a small type, we can inject it.
  else if (symbol.description && typeDisplay.length < 40) {
    description.push(...addTypeToDescription(symbol.description, typeDisplay))
  }
  // Otherwise, show the type in a code block.
  else {
    if (symbol.description) description.push(...symbol.description.children)

    description.push(
      // To do: switch to h5 when long jsdoc.
      {type: 'heading', depth: 6, children: [{type: 'text', value: 'Type'}]},
      {type: 'code', lang: 'ts', value: typeDisplay}
    )
  }

  return [
    {
      type: 'heading',
      depth: 3,
      children: [
        {
          type: 'inlineCode',
          value:
            symbol.nameDisplayPrefix +
            symbol.nameDisplay +
            symbol.nameDisplaySuffix
        }
      ]
    },
    ...description,
    ...children
  ]
}

/**
 * @param {Readonly<Symbol>} field
 * @returns {Promise<ListItem>}
 */
async function formatField(field) {
  const typeDisplay = await prettierFormat(field.typeExpressionDisplay)

  /** @type {Array<PhrasingContent>} */
  const summary = [
    {
      type: 'inlineCode',
      value:
        field.nameDisplayPrefix + field.nameDisplay + field.nameDisplaySuffix
    },
    {type: 'text', value: ' ('},
    {type: 'inlineCode', value: typeDisplay},
    {type: 'text', value: ')'}
  ]

  /** @type {Array<BlockContent | DefinitionContent>} */
  const itemContent = []

  if (field.description) {
    const head = field.description.children[0]

    if (
      head &&
      head.type === 'paragraph' &&
      field.description.children.length === 1
    ) {
      const tail = summary.at(-1)
      assert(tail)
      assert(tail.type === 'text')
      tail.value += '\n— '

      const rest = structuredClone(head.children)
      const first = rest.at(0)
      const last = rest.at(-1)

      // Lowercase the sentence.
      if (first && first.type === 'text') {
        first.value = first.value.charAt(0).toLowerCase() + first.value.slice(1)
      }

      // Remove final `.`
      if (last && last.type === 'text') {
        last.value = last.value.replace(/\.$/, '')
      }

      itemContent.push({type: 'paragraph', children: [...summary, ...rest]})
    } else {
      itemContent.push(
        {type: 'paragraph', children: summary},
        .../** @type {Array<BlockContent | DefinitionContent>} */ (
          structuredClone(field.description.children)
        )
      )
    }
  } else {
    itemContent.push({type: 'paragraph', children: summary})
  }

  return {
    type: 'listItem',
    spread: false,
    checked: null,
    children: itemContent
  }
}

/**
 * @param {Readonly<Value>} field
 * @returns {Promise<ListItem>}
 */
async function formatExpressionValue(field) {
  return {
    type: 'listItem',
    spread: false,
    checked: null,
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'inlineCode',
            value: await prettierFormat(field.typeExpressionDisplay)
          }
        ]
      }
    ]
  }
}

/**
 * @param {Readonly<Root> | undefined} description
 * @param {string} typeDisplay
 * @returns {Array<RootContent>}
 */
function addTypeToDescription(description, typeDisplay) {
  /** @type {Array<RootContent>} */
  const result = []
  /** @type {InlineCode} */
  const type = {type: 'inlineCode', value: typeDisplay}
  let added = false

  if (description) {
    // Readable now.
    const clone = /** @type {Root} */ (structuredClone(description))
    const head = clone.children[0]

    if (head && head.type === 'paragraph') {
      let index = -1

      while (++index < head.children.length) {
        const child = head.children[index]
        if (child.type !== 'text') continue

        const characterMatch = child.value.match(/[.;]/)
        if (!characterMatch) continue

        head.children.splice(
          index,
          1,
          {
            type: 'text',
            value: child.value.slice(0, characterMatch.index) + ' ('
          },
          type,
          {type: 'text', value: ')' + child.value.slice(characterMatch.index)}
        )
        added = true
        break
      }

      if (!added) {
        const headTail = head.children.at(-1)

        if (headTail && headTail.type === 'text') {
          headTail.value += ' ('
        } else {
          head.children.push({type: 'text', value: ' ('})
        }

        head.children.push(type, {type: 'text', value: ').'})
        added = true
      }
    }

    result.push(...clone.children)
  }

  if (!added) {
    result.unshift({
      type: 'paragraph',
      children: [type, {type: 'text', value: '.'}]
    })
  }

  return result
}

/**
 * @param {ReadonlyArray<Symbol>} input
 * @returns {Array<Symbol>}
 */
function sortValues(input) {
  /** @type {Map<string, Symbol>} */
  const byName = new Map()

  for (const symbol of input) {
    byName.set(symbol.nameDisplay, symbol)
  }

  return Array.from(byName.keys())
    .sort()
    .map(function (d) {
      // Always defined.
      return /** @type {Symbol} */ (byName.get(d))
    })
}

/**
 * @param {string} value
 * @returns {Promise<string>}
 */
async function prettierFormat(value) {
  const prefix = 'type x ='

  try {
    let result = await format(prefix + value, {
      bracketSpacing: false,
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'none',
      useTabs: false,
      parser: 'typescript'
    })

    if (
      result.slice(0, prefix.length) === prefix &&
      /\s/.test(result.charAt(prefix.length))
    ) {
      result = result.slice(prefix.length + 1)
    }

    if (result.charAt(result.length - 1) === '\n') {
      result = result.slice(0, -1)
    }

    return result
    /* c8 ignore next 3 -- ignore abbreviated code. */
  } catch {
    return value
  }
}
