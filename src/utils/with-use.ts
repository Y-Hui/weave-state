export type Use<T extends Record<PropertyKey, any>> = T & {
  use: <R>(mixin: (value: T) => R) => Use<R>
}

function mixinUse<T>(value: T): Use<T> {
  return {
    ...value,
    use: (mixin) => mixinUse(mixin(value)),
  }
}

export default mixinUse
