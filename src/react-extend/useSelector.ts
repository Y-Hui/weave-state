import { useSyncExternalStore } from 'use-sync-external-store'
import type { GetState, WeaveState } from 'weave-state'
import type { WithSelector } from 'weave-state/extend'

type WeaveStatePart<T> = Pick<WithSelector<T>, 'selector'> &
  Pick<WeaveState<T>, 'getState'>

/**
 * 添加 useSelector Hook，它依赖于 selector。
 *
 * 使用 hook 的方式 “侦听” state 中的某个值。
 *
 * ```ts
 * import create from 'weave-state'
 * import { selector } from 'weave-state/extend'
 * import { useSelector } from 'weave-state/react-extend'
 *
 * const state = create({ value: 0, age: 0 }).use(selector()).use(useSelector)
 *
 * // use in React Component
 * const ageValue = state.useSelector((val) => val.age)
 * ```
 */
function useSelector<T extends WeaveStatePart<any>>(store: T) {
  return {
    ...store,
    useSelector<S>(selectorField: (val: GetState<T>) => S) {
      const subject = store.selector(selectorField).addListener
      return useSyncExternalStore(subject, () => selectorField(store.getState()))
    },
  } as const
}

export default useSelector
