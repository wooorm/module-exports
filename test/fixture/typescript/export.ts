export {
  Sum as SomeClass,
  explicitJsdocTypeAndComment as someDeclaration,
  explicitParametersAndReturnWithComments as someFunction
} from './index.js'
export * as stuff from './mini.js'
export * from './mini.js'
export type {SomeInterface, SomeType} from './type.js'

/**
 * Description.
 */
const a = 1

export {a as default}
