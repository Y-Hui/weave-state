import type { FC } from 'react'
import { Suspense } from 'react'
import create from 'weave-state'
import { computed } from 'weave-state/extend'
import { useValue } from 'weave-state/react-extend'

function calc(val: number) {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(val * 10)
    }, 1000)
  })
}

const countAtom = create(1)
const count2Atom = create(0)
const asyncAtom = computed(async (read) => {
  const val = await calc(read(countAtom))
  return read(count2Atom) + val
})

const AsyncValue = () => {
  const value = useValue(asyncAtom)
  return <div>Count: {value}</div>
}

const Basic: FC = () => {
  return (
    <div>
      <Suspense fallback={<div>loading..</div>}>
        <AsyncValue />
      </Suspense>
      <button
        onClick={() => {
          countAtom.setState((prev) => prev + 1)
        }}
      >
        count++
      </button>
      <button
        onClick={() => {
          count2Atom.setState((prev) => prev + 1)
        }}
      >
        count2++
      </button>
    </div>
  )
}

const Demo: FC = () => {
  return <Basic />
}

export default Demo
