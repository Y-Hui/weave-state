import type { FC } from 'react'
import create from 'weave-state'
import { computed } from 'weave-state/extend'
import { useValue, useWeaveState } from 'weave-state/react-extend'

const countAtom = create(0)
const doubleCountAtom = computed((read) => read(countAtom) * 2).use(
  useValue.install,
)

const Basic: FC = () => {
  const [count, setCount] = useWeaveState(countAtom)
  const doubleCount = useValue(doubleCountAtom)

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
