export type EqualityFn = (value1: unknown, value2: unknown) => boolean
export type Listener<T> = (state: T, prevState: T) => void
export type SetStateAction<S> = S | ((prevState: S) => S)
export type RemoveListenerFn = () => void
export type ListenerKey = string | symbol
