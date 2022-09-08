import type { FC } from 'react'

import create from '../../../src'
import { selector, selectorHook } from '../../../src/extend'

const nestedAtom = create({
  nested: {
    count: 1,
    website: {
      name: 'GitHub',
      value: 'https://github.com/',
    },
  },
})
  .use(selector())
  .use(selectorHook)

const Count: FC = () => {
  const count = nestedAtom.useSelector((atom) => atom.nested.count)
  return <p>Count: {count}</p>
}

const Name: FC = () => {
  const info = nestedAtom.useSelector((atom) => atom.nested.website.name)
  return (
    <p>
      nested.website.name: {info}
      <br />
      此组件不会被重新渲染{Date.now()}
    </p>
  )
}

const Basic: FC = () => {
  return (
    <>
      <Count />
      <button
        onClick={() => {
          nestedAtom.setState((prev) => {
            return {
              nested: {
                ...prev.nested,
                count: prev.nested.count + 1,
              },
            }
          })
        }}
      >
        Change Count
      </button>
      <Name />
    </>
  )
}

const Demo: FC = () => {
  return <Basic />
}

export default Demo
