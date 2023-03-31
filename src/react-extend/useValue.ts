/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import type { WeaveState } from 'weave-state'

type WeaveStatePart<T> = Pick<WeaveState<T>, 'getState' | 'addListener'>
type GetState<T> = T extends WeaveStatePart<infer U> ? U : unknown

type PromiseTask<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected'
  value?: T
  reason?: unknown
}

function use<T>(promise: PromiseTask<T>): T {
  if (promise.status === 'pending') {
    throw promise
  } else if (promise.status === 'fulfilled') {
    return promise.value as T
  } else if (promise.status === 'rejected') {
    throw promise.reason
  } else {
    promise.status = 'pending'
    promise.then(
      (v) => {
        promise.status = 'fulfilled'
        promise.value = v
        return v
      },
      (e) => {
        promise.status = 'rejected'
        promise.reason = e
      },
    )
    throw promise
  }
}

/**
 * ```ts
 * import create from 'weave-state'
 * import { useValue } from 'weave-state/extend'
 *
 * const state = create({ value: 0, age: 0 }).use(useValue.install)
 *
 * // use in React Component
 * const value = state.useValue()
 * // OR
 * useValue(state)
 * ```
 */
function useValue<T extends WeaveStatePart<any>>(store: T) {
  type State = GetState<T>
  const [value, setValue] = useState(store.getState)

  useEffect(() => store.addListener(setValue), [store])

  if (value instanceof Promise) {
    return use(value) as Awaited<State>
  }
  return value as Awaited<State>
}

useValue.install = <T extends WeaveStatePart<any>>(store: T) => {
  return {
    ...store,
    useValue: () => useValue(store),
  } as const
}

export default useValue
