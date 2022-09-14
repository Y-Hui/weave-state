import {
  getInitialValue,
  setStateAction,
  Use,
  withUse,
} from 'weave-state/utils'

import {
  InitialValue,
  Listener,
  ListenerKey,
  RemoveListenerFn,
  SetStateFn,
} from './types/index'

export interface WeaveState<S> {
  /**
   * 获取 State
   */
  readonly getState: () => S
  /**
   * 修改 State
   *
   * 若新旧值相等，则跳过触发 listener
   */
  readonly setState: SetStateFn<S>
  /**
   * 添加监听器
   *
   * @param key 设置唯一值，拥有 key 的监听器拥有优先调用权
   */
  readonly addListener: (
    listener: Listener<S>,
    key?: ListenerKey,
  ) => RemoveListenerFn
  /**
   * 移除指定监听器
   */
  readonly removeListener: (key: ListenerKey) => void
  /**
   * 清空所有监听器
   */
  readonly clearAllListener: RemoveListenerFn
  /**
   * 手动触发所有 listener
   */
  readonly notify: () => void
}

export type GetState<T> = T extends WeaveState<infer U> ? U : unknown

/**
 * @param initialState 初始值
 * @param equalityFn 比较新值旧值是否相等的函数，默认使用 `Object.is` 比较。
 */
function createStore<S>(
  initialState: InitialValue<S>,
  equalityFn = Object.is,
): Use<WeaveState<S>> {
  const initial = getInitialValue(initialState)
  const state = {
    entity: initial,
    prevEntity: initial,
    get value() {
      return this.entity
    },
    set value(newState) {
      this.entity = newState
    },
  }

  const listeners = new Set<Listener<S>>()
  const namedListeners = new Map<ListenerKey, Listener<S>>()

  const getState = () => state.value

  /**
   * 通知所有 listener
   */
  const notify = () => {
    const dispatch = (listener: Listener<S>) =>
      listener(getState(), state.prevEntity)
    // 优先调用命名的监听器
    namedListeners.forEach(dispatch)
    listeners.forEach(dispatch)
  }

  const setState: SetStateFn<S> = (action) => {
    state.prevEntity = getState()
    const prevState = state.prevEntity
    const nextState = setStateAction(action, prevState)
    if (equalityFn(prevState, nextState)) {
      return
    }
    state.value = nextState
    notify()
  }

  const addListener = (listener: Listener<S>, key?: ListenerKey) => {
    if (typeof key === 'string') {
      namedListeners.set(key, listener)
      return () => {
        namedListeners.delete(key)
      }
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  const removeListener = (key: ListenerKey) => {
    namedListeners.delete(key)
  }

  const clearAllListener = () => {
    namedListeners.clear()
    listeners.clear()
  }

  return withUse({
    getState,
    setState,
    addListener,
    removeListener,
    clearAllListener,
    notify,
  })
}

export default createStore
