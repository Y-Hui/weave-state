import { useSyncExternalStore } from 'use-sync-external-store'
import type { WeaveState } from 'weave-state'

import type { SetStateFn } from '../types/index'

type WeaveStatePart<T> = Pick<
  WeaveState<T>,
  'getState' | 'addListener' | 'setState'
>
type GetState<T> = T extends WeaveStatePart<infer U> ? U : unknown

type StateHook<T> = [T, SetStateFn<T>]

/**
 * 添加类似 React.useState 的 Hook
 *
 * ```ts
 * import create from 'weave-state'
 * import { useWeaveState } from 'weave-state/extend'
 *
 * const state = create({ value: 0, age: 0 }).use(useWeaveState.install)
 *
 * // use in React Component
 * const [value, setValue] = state.useWeaveState()
 * // OR
 * useWeaveState(state)
 * ```
 */
function useWeaveState<T extends WeaveStatePart<any>>(store: T) {
  type State = GetState<T>

  const value = useSyncExternalStore<State>(store.addListener, store.getState)
  return [value, store.setState] as StateHook<State>
}

useWeaveState.install = <T extends WeaveStatePart<any>>(store: T) => {
  return {
    ...store,
    useWeaveState: () => useWeaveState(store),
  } as const
}

export default useWeaveState
