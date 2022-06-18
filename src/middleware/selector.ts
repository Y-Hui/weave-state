import type { Store } from '../create-store'
import {
  EqualityFn,
  Listener,
  ListenerKey,
  SetStateAction,
} from '../types/index'

type StoreWithSelector<S> = Omit<Store<S>, 'setState'> & {
  /**
   * 更新 state，采用 `selector` 所指定的比较函数
   */
  setState: (action: SetStateAction<S>) => void
  /**
   * 指定一个值添加监听器。
   *
   * @param firstCall 注册监听器后是否立即调用一次
   */
  selector: (
    selectorState: (state: S) => unknown,
    firstCall?: boolean,
  ) => Store<S>
}

/**
 * 接收一个比较新值旧值是否相等的函数。
 *
 * 默认使用 `Object.is` 比较。
 *
 * 比较函数将用于 `setState` 函数和 `selector` 内部实现。
 */
function selector<S>(equalityFn: EqualityFn = Object.is) {
  return (store: Store<S>): StoreWithSelector<S> => {
    const originListen = store.addListener
    const originSetState = store.setState
    return {
      ...store,
      setState(action) {
        originSetState(action, equalityFn)
      },
      selector(selectorState: (state: S) => unknown, firstCall = false) {
        return {
          ...store,
          addListener: (listener: Listener<S>, key?: ListenerKey) => {
            const cache = store.getState()
            let currentState = selectorState(cache)
            const proxyListener: Listener<S> = (state, prevState) => {
              const nextState = selectorState(state)
              if (!equalityFn(currentState, nextState)) {
                currentState = nextState
                listener(state, prevState)
              }
            }
            if (firstCall) {
              listener(cache, cache)
            }
            return originListen(proxyListener, key)
          },
        }
      },
    }
  }
}

export default selector
