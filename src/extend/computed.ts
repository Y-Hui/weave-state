import type { GetState, WeaveState } from '../create-store'
import type { WithSelector } from './selector'
import withSelector from './with-selector'

type WeaveStateGetter<T> = Pick<
  WeaveState<T>,
  'getState' | 'addListener' | 'setState'
>
type WeaveStateSelector<T> = WeaveStateGetter<T> & WithSelector<T>

type WeaveStatePart<T> = WeaveStateGetter<T> | WeaveStateSelector<T>

export type ReadFn = <S extends WeaveStatePart<any>, R = GetState<S>>(
  store: S,
  selectorFn?: (state: GetState<S>) => R,
) => R

export type ReadonlyValue<R> = (read: ReadFn) => R

export type Setter<R> = (nextState: R) => void

type Listener<S> = (state: S, prevState: S) => void

export interface WritableValue<R> {
  get: ReadonlyValue<R>
  set: Setter<R>
}

export interface ComputedValue<R> {
  addListener(listener: (state: R, prevState: R) => void): void
  getState(): R
}

export type ComputedWritableValue<R> = ComputedValue<R> & {
  setState(nextState: R): void
}

function computed<R>(action: ReadonlyValue<R>): ComputedValue<R>
function computed<R>(action: WritableValue<R>): ComputedWritableValue<R>
function computed<R>(action: ReadonlyValue<R> | WritableValue<R>) {
  const listeners = new Set<Listener<R>>()
  const deps = new Set<WeaveStatePart<unknown>>()
  const updateState: { current?: Setter<R> } = {}
  const cacheState: { current?: R } = {}

  const toggleListener = () => {
    const state = run()
    if (Object.is(state, cacheState.current)) return
    listeners.forEach((listener) => {
      const prevState = cacheState.current as R
      cacheState.current = state
      listener(state, prevState)
    })
  }

  const read: ReadFn = (store, selectorFn) => {
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
    updateState.current = set
    return get(read)
  }
  cacheState.current = run()

  const addListener = (listener: Listener<R>) => {
    listeners.add(listener)
  }

  const setState = (nextState: R) => {
    if (updateState.current) {
      updateState.current(nextState)
    }
  }

  const getState = () => {
    return cacheState.current as R
  }

  if (typeof action === 'function') {
    return { addListener, getState }
  }

  return {
    addListener,
    setState,
    getState,
  }
}

export default computed
