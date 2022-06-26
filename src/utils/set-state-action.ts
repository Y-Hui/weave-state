import { SetStateAction } from '../types'

function setStateAction<S>(action: SetStateAction<S>, prevState: S): S {
  if (typeof action === 'function') {
    return (action as (prevState: S) => S)(prevState)
  }
  return action
}

export default setStateAction
