import type { FC } from 'react'

import create from '../../../src'
import { computed } from '../../../src/extend'
import { useValue } from '../../../src/react-extend'

const nameAtom = create('Andrew').use(useValue)
const ageAtom = create(11).use(useValue)

const composeAtom = computed((read) => {
  return `${read(nameAtom)} is ${read(ageAtom)} years old.`
}).use(useValue)

const Basic: FC = () => {
  const info = composeAtom.useValue()

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