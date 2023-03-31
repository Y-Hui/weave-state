import type { Prettify } from '../types'

export type Use<T> = T & {
  // create(0).use(useValue.install)
  // 直接在 use 内部调用 install 让 hook 更简洁，不过类型推导似乎不好做。
  // create(0).use(useValue)
  // use: <R>(plugin: { install: (state: T) => R }) => Use<Prettify<R>>

  use: <R>(plugin: (state: T) => R) => Use<Prettify<R>>
}

function mixinUse<T>(value: T): Use<Prettify<T>> {
  return {
    ...value,
    use: (mixin) => mixinUse(mixin(value)),
  }
}

export default mixinUse
