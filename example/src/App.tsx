import { useState, useEffect } from 'react'
import createWeaveState, { StoreMethods } from '../../src'

function useWeaveState<T>(atom: StoreMethods<T>) {
  const [value, setValue] = useState(atom.getState)

  useEffect(() => {
    return atom.addListener((newVal) => {
      setValue(newVal)
    })
  }, [atom])

  return [value, atom.setState] as const
}

const state = createWeaveState(0)

function App() {
  const [count, setCount] = useWeaveState(state)

  return (
    <div style={{ textAlign: 'center' }}>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>setCount</button>
      <button
        onClick={() => {
          console.log(state.getState())
        }}
      >
        getState
      </button>
      <button onClick={() => state.setState(8)}>setState</button>
    </div>
  )
}

export default App
