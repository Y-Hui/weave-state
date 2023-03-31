import type { FC } from 'react'
import create from 'weave-state'
import { computed } from 'weave-state/extend'
import { useValue, useWeaveState } from 'weave-state/react-extend'

const personAtom = create({ helen: { age: 1 } }).use(useValue.install)
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

const Basic: FC = () => {
  const [age, setAge] = useWeaveState(helenAge)
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
