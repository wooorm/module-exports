### `Add`

###### Parameters

* `leftString` (`string`)
* `rightString` (`string`)

###### Returns

`string`.

###### Fields

* `andSomeField` (`1`)
  — some random field with some value
* `getSet` (`number`)
  — get, set

### `Another`

Union of two literals (`'stuff' | 'thing'`).

### `Callback`

Type alias with a call signature and fields

###### Type

```ts
((error: Error | undefined, result: SomeType) => undefined) & {
  field: string
}
```

### `Inheriting`

Nothing special.

###### Extends

* `SomeInterface`

### `SomeInterface`

Stuff!

###### Parameters

* `a` (`string`)

###### Returns

`void`.

###### Fields

* `[key: string]` (`string | number`)
* `special` (`string`)

### `SomeType`

###### Fields

* `[key: string]` (`string | number | Function`)
  — index signature
* `field` (`string`)
  — regular field
* `getter` (`undefined`)
  — getter
* `method` (`() => undefined`)
  — method
* `optionalField?` (`string`)
  — optional field
* `setter` (`string`)
  — setter

### `Undocumented`

###### Type

```ts
123
```

### `Union`

Union of `Something` and `Another` (`SomeType | Another`).
