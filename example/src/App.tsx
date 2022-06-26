import create from '../../src'
import {
  derived,
  selector,
  selectorHook,
  stateHook,
  valueHook,
} from '../../src/extend'

const state = create({ value: 0, age: 0 })
  .use(valueHook)
  .use(selector())
  .use(stateHook)
  .use(selectorHook)

const derivedState = derived(state, (v) => v.age).use(valueHook)

function StateFC() {
  const [count, setCount] = state.useWeaveState()
  const doubleValue = state.useSelector((val) => val.value * 2)

  return (
    <div style={{ textAlign: 'center' }}>
      <p>doubleValue: {doubleValue}</p>
      <p>age: {count.age}</p>
      <button
        onClick={() => setCount((prev) => ({ ...prev, value: prev.value + 1 }))}
      >
        value + 1
      </button>
      <button
        onClick={() => {
          console.log(state.getState())
        }}
      >
        getState
      </button>
      <button onClick={() => state.setState((prev) => ({ ...prev, value: 8 }))}>
        setValue to 8
      </button>
    </div>
  )
}

function DerivedVal() {
  const derivedVal = derivedState.useValue()
  return <p>derivedVal: {derivedVal}</p>
}

function UpdateAge() {
  return (
    <button
      onClick={() => state.setState((prev) => ({ ...prev, age: prev.age + 1 }))}
    >
      子组件更新 age
    </button>
  )
}

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <StateFC />
      <DerivedVal />
      <UpdateAge />
    </div>
  )
}

export default App
