import type { FC } from 'react'

import create from '../../../src'
import { computed, valueHook } from '../../../src/extend'

const nameAtom = create('Andrew').use(valueHook)
const ageAtom = create(11).use(valueHook)

const composeAtom = computed((read) => {
  return `${read(nameAtom)} is ${read(ageAtom)} years old.`
}).use(valueHook)

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
