/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {toMarkdown} from 'mdast-util-to-markdown'
import {gfmToMarkdown} from 'mdast-util-gfm'
import {createFinder, defaultFormat} from 'module-exports'

const rootTsConfig = new URL('../tsconfig.json', import.meta.url)
const backupTsConfig = new URL('../tsconfig.json.bak', import.meta.url)

test('module-exports', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('module-exports')).sort(), [
      'createFinder',
      'defaultFormat'
    ])
  })
})

test('file finding', async function (t) {
  await fs.rename(rootTsConfig, backupTsConfig)

  await t.test('should fail w/o `tsconfig.json`', async function () {
    const finder = createFinder()
    const url = new URL('fixture/tsconfig-none/index.js', import.meta.url)
    await assert.rejects(finder(url), /Could not find `tsconfig.json` from/)
  })

  await t.test('should fail w/ broken `tsconfig.json`', async function () {
    const finder = createFinder()
    const url = new URL('fixture/tsconfig-empty/index.js', import.meta.url)
    await assert.rejects(finder(url), /Could not load `tsconfig.json`/)
  })

  await t.test(
    'should work on a ts file (given a destination js file)',
    async function () {
      const finder = createFinder()
      const url = new URL('fixture/typescript/mini.js', import.meta.url)
      const result = await finder(url)
      assert.deepEqual(result.messages.map(String), [
        '1:14-1:21: Unexpected missing description for variable `a`'
      ])
      assert.equal(
        serialize(await defaultFormat(result.symbols)),
        "### `a`\n\n###### Type\n\n```ts\n'b'\n```\n"
      )
    }
  )

  await t.test('should support manual types', async function () {
    const finder = createFinder()
    const result = await finder(
      new URL('fixture/manual/index.js', import.meta.url)
    )
    assert.deepEqual(result.messages.map(String), [])
    const actual = serialize(await defaultFormat(result.symbols))
    const expected = await snapshot('manual-index', actual)
    assert.equal(actual, expected)
  })

  await t.test('should fail given a non-existing file', async function () {
    const finder = createFinder()
    const url = new URL('fixture/typescript/missing.js', import.meta.url)
    await assert.rejects(finder(url), /Could not figure out source file/)
  })

  await fs.rename(backupTsConfig, rootTsConfig)
})

test('source', async function (t) {
  await t.test(
    'should support functions, classes, other values in javascript',
    async function () {
      const finder = createFinder()
      const url = new URL('fixture/javascript/index.js', import.meta.url)
      const result = await finder(url)
      assert.deepEqual(result.messages.map(String), [
        '20:4-21:4: Unexpected missing description on `@param` for parameter `a`',
        '21:4-22:4: Unexpected missing description on `@param` for parameter `b`',
        '24:1-26:2: Unexpected missing description for return value of function or call',
        '31:1-33:2: Unexpected missing description for return value of function or call',
        '31:45-31:46: Unexpected missing `@param` annotation for parameter `a`',
        '31:48-31:49: Unexpected missing `@param` annotation for parameter `b`',
        '35:1-37:2: Unexpected missing description for function or call',
        '35:1-37:2: Unexpected missing description for return value of function or call',
        '35:26-35:27: Unexpected missing `@param` annotation for parameter `a`',
        '35:29-35:30: Unexpected missing `@param` annotation for parameter `b`',
        '40:4-42:4: Unexpected multiple `@param` annotations for parameter `a`',
        '47:1-49:2: Unexpected missing description for function or call',
        '80:4-81:4: Unexpected missing description on `@param` for parameter `_`',
        '83:40-85:2: Unexpected missing description for function or call',
        '83:40-85:2: Unexpected missing description for return value of function or call',
        '90:4-91:4: Unexpected missing description on `@param` for parameter `_`',
        '93:44-95:2: Unexpected missing description for function or call',
        '93:44-95:2: Unexpected missing description for return value of function or call',
        '100:37-105:2: Unexpected missing description on class `NamedClassExpression`',
        '110:41-115:2: Unexpected missing description on class `AnonymousClassExpression`',
        '120:4-121:4: Unexpected missing description on `@param` for parameter `_`',
        '123:32-123:48: Unexpected missing description for function or call',
        '123:32-123:48: Unexpected missing description for return value of function or call',
        '139:3-139:15: Unexpected computed name of property, expected static name',
        '146:3-148:4: Unexpected static block, use static properties',
        '194:3-194:19: Unexpected computed name of method, expected static name',
        '224:3-226:4: Unexpected missing description for function or call',
        '224:3-226:4: Unexpected missing description for return value of function or call',
        '235:1-247:2: Unexpected missing description on class `Example`',
        '236:3-238:4: Unexpected missing description on get accessor `a`',
        '240:3-240:18: Unexpected missing description on set accessor `a`',
        '242:3-244:4: Unexpected missing description for function or call',
        '242:3-244:4: Unexpected missing description for return value of function or call',
        '246:3-246:21: Unexpected missing description for property `undocumented`',
        '269:14-269:36: Unexpected missing description for variable `implicitType`',
        '286:3-286:19: Unexpected computed name of property, expected static name',
        '306:3-306:17: Unexpected spread, use explicit exports',
        '322:3-322:24: Unexpected missing description for property `undocumentedShorthand`',
        '324:3-324:18: Unexpected missing description for property `undocumented`'
      ])
      const actual = serialize(await defaultFormat(result.symbols))
      const expected = await snapshot('javascript-index', actual)
      assert.equal(actual, expected)
    }
  )

  await t.test(
    'should support `@callback`, `@typedef` in javascript',
    async function () {
      const finder = createFinder()
      const url = new URL('fixture/javascript/jsdoc.js', import.meta.url)
      const result = await finder(url)
      assert.deepEqual(result.messages.map(String), [
        '28:4-31:2: Unexpected missing description on `@callback` for `SomeCallback`',
        '29:4-30:4: Unexpected missing description on `@param` for `value`',
        '30:4-31:2: Unexpected missing description on `@returns`',
        '59:5-59:24: Unexpected missing description on `@typedef` of `AndMore`',
        '64:4-65:4: Unexpected missing description on `@property` for `string`'
      ])
      const actual = serialize(await defaultFormat(result.symbols))
      const expected = await snapshot('javascript-jsdoc', actual)
      assert.equal(actual, expected)
    }
  )

  await t.test(
    'should support functions, classes, other values in typescript',
    async function () {
      const finder = createFinder()
      const url = new URL('fixture/typescript/index.js', import.meta.url)
      const result = await finder(url)
      assert.deepEqual(result.messages.map(String), [
        '28:14-28:35: Unexpected missing description for variable `implicitType`',
        '50:1-52:2: Unexpected missing description for return value of function or call',
        '50:45-50:54: Unexpected missing `@param` annotation for parameter `a`',
        '50:56-50:65: Unexpected missing `@param` annotation for parameter `b`',
        '57:1-59:2: Unexpected missing description for return value of function or call',
        '57:45-57:46: Unexpected missing `@param` annotation for parameter `a`',
        '57:48-57:49: Unexpected missing `@param` annotation for parameter `b`',
        '61:1-63:2: Unexpected missing description for function or call',
        '61:1-63:2: Unexpected missing description for return value of function or call',
        '61:26-61:27: Unexpected missing `@param` annotation for parameter `a`',
        '61:29-61:30: Unexpected missing `@param` annotation for parameter `b`',
        '138:1-147:2: Unexpected enum declaration, use regular types to improve compatibility with JavaScript users',
        '150:1-150:22: Unexpected `import =`, use explicit exports'
      ])
      const actual = serialize(await defaultFormat(result.symbols))
      const expected = await snapshot('typescript-index', actual)
      assert.equal(actual, expected)
    }
  )

  await t.test(
    'should support types, interfaces in typescript',
    async function () {
      const finder = createFinder()
      const url = new URL('fixture/typescript/type.ts', import.meta.url)
      const result = await finder(url)
      assert.deepEqual(result.messages.map(String), [
        '6:24-43:2: Unexpected missing description for interface',
        '22:3-22:8: Unexpected computed name of property, expected static name',
        '26:3-26:8: Unexpected computed name of property, expected static name',
        '30:3-30:22: Unexpected missing description for return value of function or call',
        '34:3-34:22: Unexpected computed name of method, expected static name',
        '49:19-95:2: Unexpected missing description for interface',
        '53:3-53:52: Unexpected missing description for return value of function or call',
        '53:4-53:22: Unexpected missing `@param` annotation for parameter `leftString`',
        '53:24-53:43: Unexpected missing `@param` annotation for parameter `rightString`',
        '86:7-86:16: Unexpected computed name of get accessor, expected static name',
        '90:7-90:12: Unexpected computed name of get accessor, expected static name',
        '94:7-94:16: Unexpected computed name of set accessor, expected static name',
        '121:1-121:31: Unexpected missing description for type `Undocumented`',
        '128:3-128:18: Unexpected missing description for property `special`',
        '129:3-129:20: Unexpected missing description for function or call',
        '129:3-129:20: Unexpected missing description for return value of function or call',
        '129:4-129:13: Unexpected missing `@param` annotation for parameter `a`'
      ])
      const actual = serialize(await defaultFormat(result.symbols))
      const expected = await snapshot('typescript-type', actual)
      assert.equal(actual, expected)
    }
  )

  await t.test('should support exports in typescript', async function () {
    const finder = createFinder()
    const url = new URL('fixture/typescript/export.ts', import.meta.url)
    const result = await finder(url)
    assert.deepEqual(result.messages.map(String), [
      '6:8-6:18: Unexpected namespace export (`* as x`), use explicit exports',
      '7:1-7:26: Unexpected export all (`*`), use explicit exports',
      '8:14-8:27: Unexpected missing description for function or call',
      '8:14-8:27: Unexpected missing description for property `special`',
      '8:14-8:27: Unexpected missing description for return value of function or call',
      '8:14-8:27: Unexpected missing `@param` annotation for parameter `a`',
      '8:29-8:37: Unexpected computed name of method, expected static name',
      '8:29-8:37: Unexpected computed name of property, expected static name',
      '8:29-8:37: Unexpected computed name of property, expected static name',
      '8:29-8:37: Unexpected missing description for interface',
      '8:29-8:37: Unexpected missing description for return value of function or call',
      '15:8-15:22: Unexpected default export, use named exports'
    ])
    const actual = serialize(await defaultFormat(result.symbols))
    const expected = await snapshot('typescript-export', actual)
    assert.equal(actual, expected)
  })

  await t.test('should support an export assignment', async function () {
    const finder = createFinder()
    const url = new URL(
      'fixture/typescript/export-assignment.ts',
      import.meta.url
    )
    const result = await finder(url)
    assert.deepEqual(result.messages.map(String), [
      '5:1-5:20: Unexpected export assignment, use explicit exports'
    ])
    assert.equal(result.symbols.length, 0)
  })

  await t.test('should support all kinds of docs', async function () {
    const finder = createFinder()
    const url = new URL('fixture/javascript/lots-of-docs.js', import.meta.url)
    const result = await finder(url)
    const actual = serialize(await defaultFormat(result.symbols))
    const expected = await snapshot('javascript-lots-of-docs', actual)
    assert.equal(actual, expected)
    assert.deepEqual(result.messages.map(String), [])
  })

  await t.test('should support a real world example', async function () {
    const finder = createFinder()
    const url = new URL('fixture/realworld-example/index.js', import.meta.url)
    const result = await finder(url)
    const actual = serialize(await defaultFormat(result.symbols))
    const expected = await snapshot('realworld-example', actual)
    assert.equal(actual, expected)
    assert.deepEqual(result.messages.map(String), [])
  })
})

/**
 * @param {string} name
 * @param {string} actual
 * @returns {Promise<string>}
 */
async function snapshot(name, actual) {
  const expectedUrl = new URL('snapshot/' + name + '.md', import.meta.url)
  let expected = ''

  try {
    expected = await fs.readFile(expectedUrl, 'utf8')
    expected = expected.replace(/\r\n/g, '\n')
  } catch {}

  if (actual !== expected) {
    await fs.writeFile(expectedUrl, actual)
  }

  return expected
}

/**
 * @param {Root} tree
 * @returns {string}
 */
function serialize(tree) {
  return toMarkdown(tree, {extensions: [gfmToMarkdown()]})
}
