import { Map, List } from 'immutable'

function isReducible(obj) {
  return typeof obj === 'object' && typeof obj.reduce === 'function'
}

function checkReducible(obj) {
  if (!isReducible(obj)) {
    throw new Error('the data structure is expected to have a `reduce` function')
  }
}

export default function partition(keyForValue, reducible) {
  if (typeof keyForValue !== 'function') {
    throw new Error(`keyForValue must be a function, got: ${typeof keyForValue}`)
  }

  const reduceFn = (partitions, item) => {
    const key = keyForValue(item)

    if (typeof key !== 'string') {
      throw new Error(`keyForValue must return a string, got: ${typeof key}`)
    }

    const partition = partitions.get(key) || List()
    return partitions.set(key, partition.push(item))
  }

  function partial(reducible) {
    checkReducible(reducible)
    return reducible.reduce(reduceFn, Map())
  }

  return reducible ? partial(reducible) : partial
}
