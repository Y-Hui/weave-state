export type EqualityFn = (value1: unknown, value2: unknown) => boolean
export type Listener<T> = (state: T, prevState: T) => void
export type SetStateAction<S> = S | ((prevState: S) => S)
export type SetStateFn<S> = (action: SetStateAction<S>) => void
export type RemoveListenerFn = () => void
export type ListenerKey = string | symbol
export type InitialValue<S> = S | (() => S)
export type Prettify<T> = {
  [K in keyof T]: T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}
