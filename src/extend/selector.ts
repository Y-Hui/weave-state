import type { WeaveState } from '../create-store'
import { ListenerKey, RemoveListenerFn } from '../types/index'

type WeaveStatePart<T> = Pick<
  WeaveState<T>,
  'addListener' | 'setState' | 'getState'
>
type GetState<T> = T extends WeaveStatePart<infer U> ? U : unknown

export interface SelectorOptions<S, FullState> {
  readonly addListener: (
    listener: (
      value: S,
      prevValue: S,
      state: FullState,
      prevState: FullState,
    ) => void,
    key?: ListenerKey,
  ) => RemoveListenerFn
}

export type WithSelector<S> = {
  /**
   * 指定一个值添加监听器。
   *
   * @param firstCall 注册监听器后是否立即调用一次
   */
  selector: <T>(
    selectorState: (state: S) => T,
    firstCall?: boolean,
  ) => SelectorOptions<T, S>
}

/**
 * 接收一个比较新值旧值是否相等的函数。
 *
 * 默认使用 `Object.is` 比较。
 *
 * 比较函数将用于 `setState` 函数和 `selector` 内部实现。
 */
function selector(equalityFn = Object.is) {
  return <T extends WeaveStatePart<any>>(store: T) => {
    const originListen = store.addListener

    const result: T & WithSelector<GetState<T>> = {
      ...store,
      selector: (selectorState, firstCall = false) => {
        return {
          addListener: (listener, key?: ListenerKey) => {
            const cache = store.getState()
            let value = selectorState(cache)
            if (firstCall) {
              listener(value, value, cache, cache)
            }
            return originListen((state, prevState) => {
              const nextState = selectorState(state)
              if (!equalityFn(value, nextState)) {
                value = nextState
                listener(nextState, selectorState(prevState), state, prevState)
              }
            }, key)
          },
        }
      },
    }

    return result
  }
}

export default selector
