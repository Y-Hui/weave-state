import type { FC } from 'react'

import create from '../../../src'
import { computed, stateHook, valueHook } from '../../../src/extend'

const personAtom = create({ helen: { age: 1 } }).use(valueHook)
const helenAge = computed({
  get(read) {
    return read(personAtom, (atom) => atom.helen.age)
  },
  set(nextState) {
    personAtom.setState((state) => {
      return { ...state, helen: { ...state.helen, age: nextState } }
    })
  },
})
  .use(valueHook)
  .use(stateHook)

const Basic: FC = () => {
  const [age, setAge] = helenAge.useWeaveState()
  const person = personAtom.useValue()
  return (
    <div>
      <p>age: {age}</p>
      <button
        onClick={() => {
          setAge((prev) => prev + 1)
        }}
      >
        count++
      </button>
      <br />
      <p>{JSON.stringify(person)}</p>
    </div>
  )
}

const Demo: FC = () => {
  return <Basic />
}

export default Demo
