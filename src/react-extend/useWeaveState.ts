import { useEffect, useState } from 'react'
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
 * import { stateHook } from 'weave-state/extend'
 *
 * const state = create({ value: 0, age: 0 }).use(stateHook)
 *
 * // use in React Component
 * const [value, setValue] = state.useWeaveState()
 * ```
 */
function stateHook<T extends WeaveStatePart<any>>(store: T) {
  type State = GetState<T>
  return {
    ...store,
    useWeaveState(): StateHook<State> {
      const [value, setValue] = useState<GetState<T>>(store.getState)

      useEffect(() => store.addListener(setValue), [])

      return [value, store.setState]
    },
  } as const
}

export default stateHook
