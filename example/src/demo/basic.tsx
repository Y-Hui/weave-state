import type { FC } from 'react'
import create from 'weave-state'
import { useWeaveState } from 'weave-state/react-extend'

const countAtom = create(0)

const Updater: FC = () => {
  return (
    <>
      <br />
      <button
        onClick={() => {
          countAtom.setState((prev) => prev + 1)
        }}
      >
        其他组件更新
      </button>
      <p>
        此组件修改 state 时不会导致自身更新
        <br />
        此组件渲染时时间戳：{Date.now()}
      </p>
    </>
  )
}

const Basic: FC = () => {
  const [count, setCount] = useWeaveState(countAtom)
  return (
    <div>
      <p>{count}</p>
      <p>时间戳：{Date.now()}</p>
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
  return (
    <>
      <Basic />
      <Updater />
    </>
  )
}

export default Demo
