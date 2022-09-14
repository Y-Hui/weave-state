import type { FC } from 'react'
import create from 'weave-state'
import { computed } from 'weave-state/extend'
import { useValue, useWeaveState } from 'weave-state/react-extend'

const countAtom = create(0).use(useWeaveState)
const doubleCountAtom = computed((read) => read(countAtom) * 2).use(useValue)

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
