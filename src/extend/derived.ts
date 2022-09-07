import type { WeaveState } from '../create-store'
import create from '../create-store'
import withUse, { Use } from '../utils/with-use'
import type { WithSelector } from './selector'
import selector from './selector'

type WeaveStateGetter<T> = Pick<
  WeaveState<T>,
  'getState' | 'addListener' | 'setState'
>
type WeaveStateSelector<T> = WeaveStateGetter<T> & WithSelector<T>

type WeaveStatePart<T> = WeaveStateGetter<T> | WeaveStateSelector<T>
type GetState<T> = T extends WeaveStatePart<infer U> ? U : unknown

export type DerivedState<T> = Use<
  Pick<
    WeaveState<T>,
    | 'addListener'
    | 'removeListener'
    | 'clearAllListener'
    | 'notify'
    | 'getState'
  >
>

/**
 * 创建派生状态
 *
 * ```ts
 * import create from 'weave-state'
 * import { derived } from 'weave-state/extend'
 *
 * const state = create({ value: 0, age: 0 })
 * const age = derived(state, (val) => val.age)
 *
 * age.addListener((val) => {
 *   console.log('age changed', val)
 * })
 * ```
 */
function derived<S extends WeaveStatePart<any>, R>(
  store: S,
  selectorFn: (state: GetState<S>) => R,
): DerivedState<R> {
  let storeWithSelector = store as WeaveStateSelector<GetState<S>>

  const withSelector = selector()
  if (!('selector' in store)) {
    storeWithSelector = withSelector(store) as WeaveStateSelector<GetState<S>>
  }

  const {
    setState,
    addListener,
    removeListener,
    clearAllListener,
    notify,
    getState,
  } = create(selectorFn(store.getState()))

  storeWithSelector.selector(selectorFn).addListener((value) => {
    setState(value)
  })

  return withUse({
    addListener,
    removeListener,
    clearAllListener,
    notify,
    getState,
  })
}

export default derived
