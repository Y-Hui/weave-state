import type { FC } from 'react'

import create from '../../../src'
import { computed, stateHook, valueHook } from '../../../src/extend'

const countAtom = create(0).use(stateHook)
const doubleCountAtom = computed((read) => read(countAtom) * 2).use(valueHook)

const Basic: FC = () => {
  const [count, setCount] = countAtom.useWeaveState()
  const doubleCount = doubleCountAtom.useValue()

  return (
    <div>
      <p>{count}</p>
      <p>double: {doubleCount}</p>
      <button
        onClick={() => {
          setCount((prev) => prev + 1)
        }}
      >
        count++
      </button>
    </div>
  )
}

const Demo: FC = () => {
  return <Basic />
}

export default Demo
