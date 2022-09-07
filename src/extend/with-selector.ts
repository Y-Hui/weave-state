import type { WeaveState } from '../create-store'
import type { WithSelector } from './selector'
import selector from './selector'

type WeaveStateGetter<T> = Pick<
  WeaveState<T>,
  'getState' | 'addListener' | 'setState'
>
type WeaveStateSelector<T> = WeaveStateGetter<T> & WithSelector<T>

type WeaveStatePart<T> = WeaveStateGetter<T> | WeaveStateSelector<T>
type GetState<T> = T extends WeaveStatePart<infer U> ? U : unknown

function withSelector<S extends WeaveStatePart<any>>(store: S) {
  let storeWithSelector = store as WeaveStateSelector<GetState<S>>

  const selectorWrapper = selector()
  if (!('selector' in store)) {
    storeWithSelector = selectorWrapper(store) as WeaveStateSelector<
      GetState<S>
    >
  }
  return storeWithSelector
}

export default withSelector
