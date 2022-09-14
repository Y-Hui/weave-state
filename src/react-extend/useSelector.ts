import { useEffect, useRef, useState } from 'react'
import type { GetState, WeaveState } from 'weave-state'
import type { WithSelector } from 'weave-state/extend'

type WeaveStatePart<T> = Pick<WithSelector<T>, 'selector'> &
  Pick<WeaveState<T>, 'getState'>

/**
 * 添加 useSelector Hook，它依赖于 selector。
 *
 * 是用 hook 的方式 “侦听” state 中的某个值。
 *
 * ```ts
 * import create from 'weave-state'
 * import { selector } from 'weave-state/extend'
 *
 * const state = create({ value: 0, age: 0 }).use(selector()).use(selectorHook)
 *
 * // use in React Component
 * const ageValue = state.useSelector((val) => val.age)
 * ```
 */
function selectorHook<T extends WeaveStatePart<any>>(store: T) {
  return {
    ...store,
    useSelector<S>(selectorField: (val: GetState<T>) => S) {
      const selectorFn = useRef(selectorField)
      const [value, setValue] = useState(() => {
        return selectorField(store.getState())
      })

      useEffect(() => {
        return store
          .selector(selectorFn.current)
          .addListener((_val, _prevVal, state) => {
            setValue(selectorFn.current(state))
          })
      }, [])

      return value
    },
  } as const
}

export default selectorHook
