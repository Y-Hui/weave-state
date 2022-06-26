export type Use<T extends Record<PropertyKey, any>> = T & {
  use: <R>(mixin: (value: T) => R) => Use<R>
}

function createMixin<T>(value: T): Use<T> {
  return {
    ...value,
    use: (mixin) => createMixin(mixin(value)),
  }
}

export default createMixin
