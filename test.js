import partition from '.'
import { List, Map, Set } from 'immutable'

describe('`partition(keyForValue, reducible)`', () => {

  it('reduces `reducible` in a Map of Lists with the key returned by `keyForValue`', () => {
    const someNumbers = List.of(0, 1, 2, 3)
    const evenOrOdd = (number) => number % 2 === 1 ? 'odd' : 'even'
    const partitions = partition(evenOrOdd, someNumbers)
    expect(partitions.toJS()).toEqual({
      even: [0, 2],
      odd: [1, 3],
    })
  })

  describe('works on all reduce-able types', () => {
    it('like Map', () => {
      const someObjects = Map({
        user00: { name: 'jack' },
        user01: { name: 'john' },
        user02: { name: 'mary' },
        user03: { name: 'clara' },
      })
      const firstLetterOfName = ({ name }) => name[0]
      const partitions = partition(firstLetterOfName, someObjects)
      expect(partitions.toJS()).toEqual({
        j: [{ name: 'jack' }, { name: 'john' }],
        m: [{ name: 'mary' }],
        c: [{ name: 'clara' }],
      })
    })

    it('or Set', () => {
      const someAnimals = Set(['horse', 'dog', 'cat', 'pig'])
      const lastLetter = (str) => str[str.length -1]
      const partitions = partition(lastLetter, someAnimals)
      expect(partitions.toJS()).toEqual({
        e: ['horse'],
        g: ['dog', 'pig'],
        t: ['cat'],
      })
    })

    it('or even regular arrays', () => {
      const someCities = ['Paris', 'London', 'Moscow', 'New York City']
      const secondLetter = (str) => str[1]
      const partitions = partition(secondLetter, someCities)
      expect(partitions.toJS()).toEqual({
        a: ['Paris'],
        o: ['London', 'Moscow'],
        e: ['New York City'],
      })
    })

    it('is curried so you can call `partition(keyForValue)(reducible)`', () => {
      const keyForValue = jest.fn(num => num % 2 === 0 ? 'evem' : 'odd')
      const partial = partition(keyForValue)
      expect(keyForValue).not.toHaveBeenCalled()
      const partitions = partial([0, 1, 2, 3])
      expect(keyForValue).toHaveBeenCalled()
    })
  })

  describe('throws', () => {
    it('on base call when `keyForValue` is not a function', () => {
      expect(() => {
        partition()
      }).toThrowError('keyForValue must be a function, got: undefined')
      expect(() => {
        partition(2)
      }).toThrowError('keyForValue must be a function, got: number')
    })

    it('when `keyForValue` does not return a string', () => {
      expect(() => {
        partition(s => s)([0, 1, 2, 3])
      }).toThrowError('keyForValue must return a string, got: number')
      expect(() => {
        partition(s => null)([0, 1, 2, 3])
      }).toThrowError('keyForValue must return a string, got: object')
    })

    it('when `reducible` does not have a reduce function', () => {
      expect(() => {
        partition(s => s)({foo: 'bar'})
      }).toThrowError('the data structure is expected to have a `reduce` function')
    })
  })
})
