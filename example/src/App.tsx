import Async from './demo/async-computed'
import Basic from './demo/basic'
import Compose from './demo/compose'
import Computed from './demo/computed'
import Pick from './demo/pick'
import WritableComputed from './demo/writable-computed'

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Basic</h2>
      <Basic />
      <h2>Computed</h2>
      <Computed />
      <h2>Computed compose</h2>
      <Compose />
      <h2>Pick</h2>
      <Pick />
      <h2>WritableComputed</h2>
      <WritableComputed />
      <h2>Async</h2>
      <Async />
    </div>
  )
}

export default App
