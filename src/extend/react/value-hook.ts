import { useEffect, useState } from 'react'

import type { WeaveState } from '../../create-store'

type WeaveStatePart<T> = Pick<WeaveState<T>, 'getState' | 'addListener'>
type GetState<T> = T extends WeaveStatePart<infer U> ? U : unknown

/**
 * 添加 useValue Hook，用于获取最新的状态
 *
 * ``ts
 * import create from 'weave-state'
 * import { valueHook } from 'weave-state/extend'
 *
 * const state = create({ value: 0, age: 0 }).use(valueHook)
 *
 * // use in React Component
 * const value = state.useValue()
 * ```
 */
function valueHook<T extends WeaveStatePart<any>>(store: T) {
  type State = GetState<T>

  return {
    ...store,
    useValue(): State {
      const [value, setValue] = useState<State>(store.getState)

      useEffect(() => {
        return store.addListener((newVal) => {
          setValue(newVal)
        })
      }, [])

      return value
    },
  } as const
}

export default valueHook
