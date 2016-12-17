# immutable-partition

[![Build Status](https://travis-ci.org/ArnaudRinquin/immutable-partition.svg?branch=master)](https://travis-ci.org/ArnaudRinquin/immutable-partition)

A partitioning helper returning an [`immutablejs`](https://facebook.github.io/immutable-js/) Map of Lists:


```js
import partition from 'immutable-partition'

const someNumbers = List.of(0, 1, 2, 3)
const evenOrOdd = (number) => number % 2 === 1 ? 'odd' : 'even'
const partitions = partition(evenOrOdd, someNumbers)
console.log(partitions.toString())
// > Map { "even": List [ 0, 2 ], "odd": List [ 1, 3 ] }
```

## Install

```sh
npm i -S immutable-partition

# or

yarn add immutable-partition
```

## Usage

`partition` takes the two following arguments and returns a `Map<K:string, V:List>`.

* `keyForValue(value: any): string` must return a string
* `reducible` just needs to have a `reduce` function so it can be any `immutablejs` structure, a regular array or anything that acts like one.

`partition` is curried so it can be called in two ways:

```js
partition(keyForValue, reducible)
// or
partition(keyForValue)(reducible)
```
