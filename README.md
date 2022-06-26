## weave-state

将状态放置在组件之外，自由编织它们。

`weave-state` 虽然有 React Hook 预设，但是它本身并不依赖某个特定的前端框架/库。

> 此状态库受到 [Jotai](https://github.com/pmndrs/jotai)、[zustand](https://github.com/pmndrs/zustand) 的启发，感谢这些优秀的开源项目。
>

### 基本用法

```ts
import create from 'weave-state'

const store = create({ name: 'Andrew', age: 14 })

store.addListener((state) => {
  console.log('数据发生变化：', state.age)
})

// 必须使用 setState 才能触发 listener
store.setState((prevState) => ({ ...prevState, age: prevState.age + 1 }))

// 即使没有修改 age, 上面的 listener 依然会被触发。
store.setState((prevState) => ({ ...prevState, name: 'Helen' }))
```


### 指定 state 的 listener

```ts
import create from 'weave-state'
import { selector } from 'weave-state/extend'

const store = create({ name: 'Andrew', age: 14 })
const scopeStore = store.use(selector()) // 使用 selector 增强

scopeStore
  .selector((state) => state.age)
  .addListener((state) => {
    console.log('age 发生变化：', state.age)
  })

// 修改 age, 触发 listener
scopeStore.setState((prevState) => ({ ...prevState, age: prevState.age + 1 }))
// 与此行代码等价 
// store.setState((prevState) => ({ ...prevState, age: prevState.age + 1 }))

// 修改 name 不会触发 listener
scopeStore.setState((prevState) => ({ ...prevState, name: 'Helen' }))
// 与此行代码等价 
// store.setState((prevState) => ({ ...prevState, name: 'Helen' }))
```

### 指定 key 的 listener

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

### 移除 listener

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

该函数是用于扩展原始 api 所存在的。

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

### 派生状态

有时候，你需要依赖 state 并进行重新计算，那么这时候你可以考虑派生一个新的状态来实现：

```ts
import create from 'weave-state'
import { derived } from 'weave-state/extend'

const state = create({ value: 0, age: 0 })
const age = derived(state, val => val.age)
const doubleValue = derived(state, val => val.value * 2)

age.addListener((val) => {
  console.log('age changed', val)
})
```

### 在 React 中使用

我们创建了一些函数，方便在 React 中使用。

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

const store = create({ value: 0, age: 0 }).use(selector).use(selectorHook)

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

// 结合 derived 一起使用
const derivedState = derived(store, val => val.age).use(valueHook)
const age = derivedState.useValue()
```


### TODO

- [ ] Build Script
