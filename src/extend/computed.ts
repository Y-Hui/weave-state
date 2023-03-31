import type { WeaveState } from 'weave-state'
import { setStateAction, Use, withUse } from 'weave-state/utils'

import type {
  Listener,
  Prettify,
  RemoveListenerFn,
  SetStateFn,
} from '../types/index'
import type { WithSelector } from './selector'
import withSelector from './with-selector'

type WeaveStateGetter<T> = Pick<
  WeaveState<T>,
  'getState' | 'addListener' | 'setState'
>
type WeaveStateSelector<T> = WeaveStateGetter<T> & WithSelector<T>
type WeaveStatePart<T> = WeaveStateGetter<T> | WeaveStateSelector<T>
type GetState<T> = T extends WeaveStatePart<infer U> ? U : unknown
type Setter<R> = (nextState: R) => void

export type Read = <S extends WeaveStatePart<any>, R = GetState<S>>(
  store: S,
  selectorFn?: (state: GetState<S>) => R,
) => R

export type ReadonlyValue<R> = (read: Read) => R

export interface WritableValue<R> {
  get: ReadonlyValue<R>
  set: Setter<R>
}

export type ComputedValue<R> = {
  addListener(listener: Listener<R>): () => void
  clearAllListener: RemoveListenerFn
  getState(): R
}

export type ComputedWritableValue<R> = ComputedValue<R> & {
  setState: SetStateFn<R>
}

function computed<R>(action: ReadonlyValue<R>): Prettify<Use<ComputedValue<R>>>
function computed<R>(
  action: WritableValue<R>,
): Prettify<Use<ComputedWritableValue<R>>>
function computed<R>(action: ReadonlyValue<R> | WritableValue<R>) {
  const listeners = new Set<Listener<R>>()
  const deps = new Set<WeaveStatePart<unknown>>()
  let updateState: Setter<R>
  let cacheState: R

  const toggleListener = () => {
    const state = run()
    if (Object.is(state, cacheState)) return
    listeners.forEach((listener) => {
      const prevState = cacheState
      cacheState = state
      listener(state, prevState)
    })
  }
  const read: Read = (store, selectorFn) => {
    if (selectorFn) {
      if (!deps.has(store)) {
        const selectorStore = withSelector(store)
        deps.add(store)
        selectorStore.selector(selectorFn).addListener(toggleListener)
      }
      return selectorFn(store.getState())
    }
    if (!deps.has(store)) {
      deps.add(store)
      store.addListener(toggleListener)
    }
    return store.getState()
  }
  const run = () => {
    if (typeof action === 'function') {
      return action(read)
    }
    const { get, set } = action
    updateState = set
    return get(read)
  }
  cacheState = run()

  const getState = () => cacheState
  const setState: SetStateFn<R> = (stateAction) => {
    if (updateState) {
      updateState(setStateAction(stateAction, cacheState))
    }
  }
  const addListener = (listener: Listener<R>) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
  const clearAllListener = () => {
    listeners.clear()
  }

  if (typeof action === 'function') {
    return withUse({ addListener, getState, clearAllListener })
  }

  return withUse({
    addListener,
    setState,
    getState,
    clearAllListener,
  })
}

export default computed
