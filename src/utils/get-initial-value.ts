import { InitialValue } from '../types'

function getInitialValue<S>(value: InitialValue<S>) {
  if (typeof value === 'function') {
    return (value as () => S)()
  }
  return value
}

export default getInitialValue
