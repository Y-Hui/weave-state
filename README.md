## weave-state

将状态放置在组件之外，自由编织它们。

`weave-state` 虽然有 React Hook 预设，但是它本身并不依赖某个特定的前端框架/库。

> 此状态库受到 [Jotai](https://github.com/pmndrs/jotai)、[zustand](https://github.com/pmndrs/zustand) 的启发，感谢这些优秀的开源项目。



### 基本用法

#### 基本类型值

```ts
import create from 'weave-state'

// 创建一个状态
const countState  = create(0)
// 使用函数创建
const countState2 = create(() => 0)

// 获取状态
console.log(countState.getState())

// 监听状态发生变化
countState.addListener((state) => {
  console.log('状态发生变化：', state)
})

// 更新状态。调用后将触发 listener
countState.setState(1)
// 使用函数可获取最新的状态值
countState.setState((val) => val + 1)
```



#### 引用类型值

```ts
import create from 'weave-state'

const store = create({ name: 'Andrew', age: 14 })

store.addListener((state) => {
  console.log('数据发生变化：', state.age)
})

// 注意：即使没有修改 age, listener 依然会被触发。
store.setState((prevState) => ({ ...prevState, name: 'Helen' }))
```



### 指定 state 的 listener

在上面的例子中可以看到，只要调用 setState  并修改数据后，便会触发 listener。

不过，侦听更加细粒度的状态有时候会很有用，此时可以使用  `selector`：

```ts
import create from 'weave-state'
import { selector } from 'weave-state/extend'

// 使用 selector 来对 store 对象进行扩展
const store = create({ name: 'Andrew', age: 14 }).use(selector())

store
  .selector((state) => state.age)
  .addListener((state) => {
    console.log('age 发生变化：', state.age)
  })

// 修改 age, 将触发 listener
store.setState((prevState) => ({ ...prevState, age: prevState.age + 1 }))

// 修改 name 不会触发 listener
store.setState((prevState) => ({ ...prevState, name: 'Helen' }))
```



### 派生状态 computed

有时候，你需要依赖 state 并进行计算，那么这时候你可以考虑使用 computed 来实现：

```ts
import create from 'weave-state'
import { computed } from 'weave-state/extend'

const state = create(2)

const doubleValue = computed((read) => {
  return read(state) * 2
})

const user = create({ name: 'Andrew', disabled: true })
const isDisabledUser = computed((read) => {
  // read 函数支持 selector 的特性
  return read(user, (val) => val.disabled)
})
```

computed 会缓存上一次的计算结果。

它在创建之初便立即运行一次，在此之后，只有它所依赖的值发生变化后才会重新执行。



#### 可写的派生状态

当你从一个复杂状态中遴选一个特定的值作为一个独立的状态后，若你需要更新它，便会发现比较麻烦，并且在语义上还不够友好。

此时你可以传入一个包含名为  `get`, `set` 函数的对象，独立配置数据读取与修改时的行为。

```ts
import create from 'weave-state'
import { computed } from 'weave-state/extend'

const state = create({ value: 0 })

const value = computed({
  get(read) {
    return read(state, (val) => val.value)
  },
  set(val) {
    state.setState((prevState) => ({...prevState, value: val}))
  },
})

value.setState((val) => val + 1)
```



[computed 中的 read 是什么？](###computed 中的 read 是什么？)



### listener

#### 设置 key 值

携带 key 值的 listener 拥有优先调用权。

```ts
import create from 'weave-state'

const store = create({ name: 'Andrew', age: 14 })
const KEY = 'YOUR_STRING_KEY'

store.addListener((state) => {
  console.log(state)
  console.log('即使声明在前，但是稍后调用')
})

store.addListener(() => {
  console.log('拥有优先调用权')
}, KEY)
```

#### 移除 listener

```ts
const store = create({ name: 'Andrew', age: 14 })

// addListener 返回值便是该 listener 的移除函数
const removeFn = store.addListener(() => {
  console.log('listener call')
})

const KEY = 'YOUR_STRING_KEY'
store.addListener(() => {
  console.log('listener2 call')
}, KEY)

store.removeListener(KEY) // 指定 key 值移除

store.clearAllListener() // 清空所有 listener
```



### API 签名及解释

#### 参数

```ts
import create from 'weave-state'

// 初始化默认值
create(0)
create(() => 0) // 支持使用函数创建

// 参数 2 接收一个函数，用于在 setState 时比较新值与旧值是否相等，
// 若两值相等，则跳过触发 `listener`。
create(0, Object.is)
```

####  `getState`
获取当前最新的状态值。

#### `setState`

函数签名如下：

  ```ts
   type SetStateAction<S> = S | ((prevState: S) => S)
   type SetStateFn<S> = (action: SetStateAction<S>) => void
  ```

  `setState` 接收 1 个参数：

  可以为新的值或者函数调用。
```ts
const store = create(false)

store.setState(true) // 新值
// 或者
store.setState((currentState) => !currentState) // 函数调用
```

#### `addListener`

添加一个侦听器，当数据变化时则会触发。

函数签名：

```ts
type RemoveListenerFn = () => void
type ListenerKey = string | symbol
type Listener<T> = (state: T, prevState: T) => void

function addListener: (listener: Listener<S>, key?: ListenerKey ) => RemoveListenerFn
```

它接收两个参数：

1. 参数 1 `listener`

   侦听器函数，数据变化后调用该函数。

2. 参数 2 `key`

   该参数为可选参数，用于标记并保持唯一。确保侦听器不会重复添加。

   并且，拥有 key 值的侦听器总是在匿名侦听器前调用。

函数返回值：

`addListener` 返回一个函数，可用于销毁此侦听器。



#### `removeListener`

根据传入的 key 销毁侦听器。

#### `clearAllListener`

销毁所有的侦听器。

#### `notify`

手动触发所有 listener。

#### `use`

该函数可用于扩展 state 对象的功能。

它接收一个函数，并将函数的返回值返回，作为新的 api 使用。

这是一个例子：

```ts
import create from 'weave-state'

const store = create(2).use((api) => {
  return {
    ...api, // 将原始 api 合并
    getDoubleValue() { // 新增一个获取 2 倍数值的函数
      return api.getState() * 2
    },
  }
})

console.log(store.getState()) // 2
console.log(store.getDoubleValue()) // 4
```

`use` 函数的返回值是没有任何约束的，你可以随心所欲创造任何功能。




### 在 React 中使用

我们创建了一些 hook，方便在 React 中使用。

#### useWeaveState

用于在 React 中读取状态并更新的 hook，它的使用方法和 React.useState 一致。

```tsx
import create from 'weave-state'
import { stateHook } from 'weave-state/extend'

const store = create({ value: 0, age: 0 }).use(stateHook)

// 以下代码需要写在 React Component 中
const [state, setState] = state.useWeaveState()
```

#### useSelector

借助 selector 我们可以侦听指定的 state。

```tsx
import create from 'weave-state'
import { selector, selectorHook } from 'weave-state/extend'

const store = create({ value: 0, age: 0 }).use(selector()).use(selectorHook)

// 以下代码需要写在 React Component 中
const value = state.useSelector(val => val.value)
const doubleValue = state.useSelector(val => val.value * 2)
```

#### useValue

仅读取 state，而不需要 update 函数。

```tsx
import create from 'weave-state'
import { derived, valueHook } from 'weave-state/extend'

const store = create({ value: 0, age: 0 }).use(valueHook)

// 以下代码需要写在 React Component 中
const state = state.useValue()
```



### weave-state 是如何运行的？

weave-state 是一个非常简单的状态管理库。它的核心是“发布订阅”机制，便是我们看到的 addListener 函数。

当一个状态被创建时，便会在函数内部维护一个 listener 数组。每次调用 addListener 时，便会将 listener 记录在其中。而调用 setState 更新状态时，则调用数组内所有的 listener。

这就是它的实现，非常简单。



### 为什么读取状态是使用 getState？

这其实是为了获取最新的基本类型值。

在设计 weave-state 时，为了与 setState 函数相对应，所以明明了 getState 函数。并且它也解决了获取基本类型值的问题。

还有其他的解决方案，例如 Vue 3 中的 `ref` 函数支持声明基本类型值，而基本类型值无法做到响应式，所以 Vue 将其包装在一个拥有名称为 `value` 的响应式对象中。



### computed 中的 read 是什么？

weave-state 是通过“发布订阅”机制来实现的。而 computed 作为派生状态，并在它所依赖的状态发生变化后重新执行，必然需要使用 addListener 来跟踪状态的变化。

所以，read 函数其实是 addListener 的封装，通过 read 函数标记依赖，以此完成依赖收集。所以 computed 才能在依赖更新后重新执行。

read 使用 `selector` 来支持细粒度的依赖标记。

若你明确派生状态中不需要某些依赖，那你依然可以使用 getState。若非必要，应当避免这种用法。

```ts
import create from 'weave-state'
import { computed } from 'weave-state/extend'

const age = create(14)
const name  = create('Andrew')

computed((read) => {
  // 只有 age 被标记为依赖
  return `${name.getState()} is ${read(age)} years old.`
})
```

通过 read 函数手动标记依赖，也有利于后续为 computed 添加异步支持。



### TODO

- [ ] Build Script
