import type { FC } from 'react'
import create from 'weave-state'
import { computed } from 'weave-state/extend'
import { useValue } from 'weave-state/react-extend'

const nameAtom = create('Andrew')
const ageAtom = create(11)

const composeAtom = computed((read) => {
  return `${read(nameAtom)} is ${read(ageAtom)} years old.`
})

const Basic: FC = () => {
  const info = useValue(composeAtom)

  return (
    <div>
      <p>{info}</p>
      <button
        onClick={() => {
          nameAtom.setState('Helen')
        }}
      >
        Change Name
      </button>
      <button
        onClick={() => {
          ageAtom.setState((prev) => prev + 1)
        }}
      >
        Change Age
      </button>
    </div>
  )
}

const Demo: FC = () => {
  return <Basic />
}

export default Demo
