---
id: part-1-overview-concepts
title: 'Redux 핵심, 파트 1: Redux 개요 및 개념'
sidebar_label: 'Redux 개요 및 개념'
description: 'Redux 공식 핵심 튜토리얼: Redux를 올바른 방향으로 사용하는 방법 배우기'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

::: 팁 배울 내용

- 리덕스가 무엇이고 왜 사용하는지
- 핵심 리덕스 용어와 개념
- 리덕스 앱에서 데이터가 어떻게 흘러가는지
  
:::

## 소개

Redux 핵심 튜토리얼에 오신 것을 환영합니다! **이 튜토리얼은 Redux를 소개하고, 최신 추천 툴과 최선의 방법으로 Redux를 올바르게 사용하는 방법에 대해 가르칩니다.** 이 강의를 끝낼 때 쯤이면, 여러분은 여기서 배운 툴들과 패턴으로 여러분만의 Redux 애플리케이션을 만들 수 있게 될거에요.

이 튜토리얼 파트 1에서, 우리는 Redux를 사용하기 위해 알아야할 핵심 개념과 용어들을 살펴볼거고, [파트 2: Redux 앱 구조](./part-2-app-structure.md)에서는 각각의 조각이 어떻게 서로 끼워맞춰지는지 조사해볼거에요.

[파트 3: 기본 Redux 데이터 흐름](./part-3-data-flow.md)에서부터는 이 지식을 사용해서 실세계의 기능들을 가진 작은 소셜 미디어 피드 앱을 만들어서 이 조각들이 실제적으로 어떻게 동작하는지 보고, Redux 사용에 있어서 중요한 패턴과 가이드라인들에 대해 이야기 해볼것입니다.
### 튜토리얼

이 페이지는 Redux를 _어떻게_ 올바르게 사용하는지 보여주는데 초점을 맞추고 Redux 앱을 빌드하는 방법에 대해 이해하기 위한 정도로 개념을 설명합니다. 

초심자가 이해할 수 있게 설명하려고 노력하긴 했지만, 이 강의를 보기전에 알고 있을거라고 가정한 몇가지 사항들이 있습니다:

:::중요 선행 지식

- [HTML & CSS](https://internetingishard.com/)에 익숙할 것.
- [ES6 문법 및 기능](https://www.taniarascia.com/es6-syntax-and-feature-overview/)에 익숙할것
- React 용어들에 대한 지식: [JSX](https://reactjs.org/docs/introducing-jsx.html), [상태](https://reactjs.org/docs/state-and-lifecycle.html), [함수 컴포넌트, 프롭스](https://reactjs.org/docs/components-and-props.html), [훅](https://reactjs.org/docs/hooks-intro.html)
- [자바스크립트 비동기처리](https://javascript.info/promise-basics) 와 [AJAX 요청](https://javascript.info/fetch)에 대한 지식

:::

**만약 위의 토픽들에 익숙하지 않다면, 이것들을 조금 익힐 시간을 먼저 가진 뒤 다시 돌아와서 Redux를 배우는 것을 추천드려요**. 준비될때까지 기다릴게요!

우선, 브라우저에 React와 Redux 개발자도구 확장프로그램을 설치해주세요:

- React 개발자도구 확장프로그램:
  - [크롬 React 개발자도구 확장프로그램](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  - [파이어폭스 React 개발자도구 확장프로그램](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- Redux 개발자도구 확장프로그램:
  - [크롬 Redux 개발자도구 확장프로그램](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
  - [파이어폭스 Redux 개발자도구 확장프로그램](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## Redux는 무엇인가요?

우선 이 "Redux"가 무엇인지 이해하는게 도움이 될것입니다. 이것은 어떤 일을 할까요? 무슨 문제를 해결하는데 도움을 줄까요? 왜 이것을 사용할까요?

**Redux "액션"이라고 불리는 이벤트를 이용해, 애플리케이션 상태를 관리하고 업데이트하는 패턴이자 라이브러리입니다.** 이것은 전체 애플리케이션에 걸쳐 사용할 수 있고, 오직 예측가능한 방식으로만 상태가 업데이트 될수 있는 규칙들을 가진 중앙 집중식 스토어로 기능합니다.
### Redux를 왜 사용해야하나요?

Redux는 "전역"상태(애플리케이션의 여러 부분에서 사용될 필요가 있는 상태)를 관리하는데 도움을 줍니다.

**Redux가 제공하는 패턴과 도구들은 상태가 언제, 어디서, 왜, 어떻게 업데이트되고 있는지와 그 변경사항이 발생할때 애플리케이션 로직이 어떻게 대응할지 대해 쉽게 이해할 수 있게합니다.** Redux는 개발자가 예측가능하고 검증가능한 코드를 작성하도록하며, 이는 애플리케이션이 예상대로 동작할 것이라는 확신을  갖게합니다.
### Redux를 언제 사용해야하나요?

Redux는 공유 상태 관리를 도와주지만, 다른 여느 도구들처럼 장단점이 있습니다. 배워야할 개념이 더 많아지고, 작성할 코드가 더 많아진다는 것입니다. 또한 Redux는 여러분의 코드에 몇몇 간접적인 영향을 주고, 특정한 제약사항을 따르라고 요구합니다. 이는 단기 및 장기 생산성 사이에서의 트레이드오프입니다.

Redux는 이럴때 더 유용해요:

- 애플리케이션의 여러곳에서 사용되는 상태가 많이 있을 때
- 애플리케이션의 상태가 시간에 따라 자주 업데이트 될 때
- 상태를 업데이트하는 로직이 복잡할 때
- 앱이 중간 정도나 큰 사이즈의 코드베이스를 가지고, 많은 사람들이 함께 작업할 때

**모든 애플리케이션이 Redux가 필요한 것은 아닙니다. 여러분이 빌드하려고 하는 앱이 어떤 종류인지 한번 생각해보고, 어떤 도구가 당신이 작업중인 문제사항을 해결하는데에 가장 최적의 도움을 줄지 결정해보세요.**

:::정보 더 알고싶으신가요?

만약 Redux가 당신의 앱에 대해 좋은 선택인지 잘 모르겠다면, 이 자료들을 참고해보세요:

- **[Redux를 사용해야할(혹은 사용하지 말아야할) 때](https://changelog.com/posts/when-and-when-not-to-reach-for-redux)**
- **[Redux의 도, 파트 1 - 구현과 의도](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
- **[Redux 자주 묻는 질문들: 언제 Redux를 사용해야 하나요?](../../faq/General.md#when-should-i-use-redux)**
- **[당신은 Redux가 필요하지 않을지도 모른다](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**

:::

### Redux 라이브러리와 도구들

Redux 작은 독립적인 JS 라이브러입니다. 하지만 대체로는 다른 몇몇 패키지들과 함께 사용됩니다:

#### React-Redux

Redux는 어떤 UI 프레임워크와도 통합될 수 있는데, React와 가장 자주 함께 사용됩니다. [**React-Redux**](https://react-redux.js.org/)는  공식 패키지로, 상태 조각을 읽고 스토어를 업데이트하기 위해 액션을 디스패치 함으로써 여러분의 React 컴포넌트가 Redux 스토어와 상호작용할 수 있게 합니다. 

#### Redux Toolkit

[**Redux Toolkit**](https://redux-toolkit.js.org)는 우리가 Redux 로직 작성을 위해 추천하는 접근법입니다. 이는 우리가 Redux 앱 제작에 필요하다고 생각한 패키지들과 함수들을 포함하고 있습니다. Redux Toolkit은 우리가 제한하는 최적의 방식으로 빌드되고, Redux의 많은 작업을 단순화하고, 흔한 실수들을 방지하고, Redux 애플리케이션을 더욱 쉽게 만들 수 있도록 합니다.

#### Redux 개발자도구 확장프로그램

[**Redux 개발자도구 확장프로그램**](https://github.com/reduxjs/redux-devtools/tree/main/extension)은 Redux 저장소 내 상태들의 시간에 따른 변경사항 기록을 보여줍니다. 이는 "시간역행 디버깅"이라는 강력한 기술을 사용해 애플리케이션 디버깅을 더욱 효율적으로 할 수 있도록 합니다.

## Redux 용어와 개념

Before we dive into some actual code, let's talk about some of the terms and concepts you'll need to know to use Redux.

### State Management

Let's start by looking at a small React counter component. It tracks a number in component state, and increments the number when a button is clicked:

```jsx
function Counter() {
  // State: a counter value
  const [counter, setCounter] = useState(0)

  // Action: code that causes an update to the state when something happens
  const increment = () => {
    setCounter(prevCounter => prevCounter + 1)
  }

  // View: the UI definition
  return (
    <div>
      Value: {counter} <button onClick={increment}>Increment</button>
    </div>
  )
}
```

It is a self-contained app with the following parts:

- The **state**, the source of truth that drives our app;
- The **view**, a declarative description of the UI based on the current state
- The **actions**, the events that occur in the app based on user input, and trigger updates in the state

This is a small example of **"one-way data flow"**:

- State describes the condition of the app at a specific point in time
- The UI is rendered based on that state
- When something happens (such as a user clicking a button), the state is updated based on what occurred
- The UI re-renders based on the new state

![One-way data flow](/img/tutorials/essentials/one-way-data-flow.png)

However, the simplicity can break down when we have **multiple components that need to share and use the same state**, especially if those components are located in different parts of the application. Sometimes this can be solved by ["lifting state up"](https://reactjs.org/docs/lifting-state-up.html) to parent components, but that doesn't always help.

One way to solve this is to extract the shared state from the components, and put it into a centralized location outside the component tree. With this, our component tree becomes a big "view", and any component can access the state or trigger actions, no matter where they are in the tree!

By defining and separating the concepts involved in state management and enforcing rules that maintain independence between views and states, we give our code more structure and maintainability.

This is the basic idea behind Redux: a single centralized place to contain the global state in your application, and specific patterns to follow when updating that state to make the code predictable.

### Immutability

"Mutable" means "changeable". If something is "immutable", it can never be changed.

JavaScript objects and arrays are all mutable by default. If I create an object, I can change the contents of its fields. If I create an array, I can change the contents as well:

```js
const obj = { a: 1, b: 2 }
// still the same object outside, but the contents have changed
obj.b = 3

const arr = ['a', 'b']
// In the same way, we can change the contents of this array
arr.push('c')
arr[1] = 'd'
```

This is called _mutating_ the object or array. It's the same object or array reference in memory, but now the contents inside the object have changed.

**In order to update values immutably, your code must make _copies_ of existing objects/arrays, and then modify the copies**.

We can do this by hand using JavaScript's array / object spread operators, as well as array methods that return new copies of the array instead of mutating the original array:

```js
const obj = {
  a: {
    // To safely update obj.a.c, we have to copy each piece
    c: 3
  },
  b: 2
}

const obj2 = {
  // copy obj
  ...obj,
  // overwrite a
  a: {
    // copy obj.a
    ...obj.a,
    // overwrite c
    c: 42
  }
}

const arr = ['a', 'b']
// Create a new copy of arr, with "c" appended to the end
const arr2 = arr.concat('c')

// or, we can make a copy of the original array:
const arr3 = arr.slice()
// and mutate the copy:
arr3.push('c')
```

**Redux expects that all state updates are done immutably**. We'll look at where and how this is important a bit later, as well as some easier ways to write immutable update logic.

:::info Want to Know More?

For more info on how immutability works in JavaScript, see:

- [A Visual Guide to References in JavaScript](https://daveceddia.com/javascript-references/)
- [Immutability in React and Redux: The Complete Guide](https://daveceddia.com/react-redux-immutability-guide/)

:::

### Terminology

There are some important Redux terms that you'll need to be familiar with before we continue:

#### Actions

An **action** is a plain JavaScript object that has a `type` field. **You can think of an action as an event that describes something that happened in the application**.

The `type` field should be a string that gives this action a descriptive name, like `"todos/todoAdded"`. We usually write that type string like `"domain/eventName"`, where the first part is the feature or category that this action belongs to, and the second part is the specific thing that happened.

An action object can have other fields with additional information about what happened. By convention, we put that information in a field called `payload`.

A typical action object might look like this:

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

#### Action Creators

An **action creator** is a function that creates and returns an action object. We typically use these so we don't have to write the action object by hand every time:

```js
const addTodo = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

#### Reducers

A **reducer** is a function that receives the current `state` and an `action` object, decides how to update the state if necessary, and returns the new state: `(state, action) => newState`. **You can think of a reducer as an event listener which handles events based on the received action (event) type.**

:::info

"Reducer" functions get their name because they're similar to the kind of callback function you pass to the [`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) method.

:::

Reducers must _always_ follow some specific rules:

- They should only calculate the new state value based on the `state` and `action` arguments
- They are not allowed to modify the existing `state`. Instead, they must make _immutable updates_, by copying the existing `state` and making changes to the copied values.
- They must not do any asynchronous logic, calculate random values, or cause other "side effects"

We'll talk more about the rules of reducers later, including why they're important and how to follow them correctly.

The logic inside reducer functions typically follows the same series of steps:

- Check to see if the reducer cares about this action
  - If so, make a copy of the state, update the copy with new values, and return it
- Otherwise, return the existing state unchanged

Here's a small example of a reducer, showing the steps that each reducer should follow:

```js
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === 'counter/increment') {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1
    }
  }
  // otherwise return the existing state unchanged
  return state
}
```

Reducers can use any kind of logic inside to decide what the new state should be: `if/else`, `switch`, loops, and so on.

<DetailedExplanation title="Detailed Explanation: Why Are They Called 'Reducers?'" >

The [`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) method lets you take an array of values, process each item in the array one at a time, and return a single final result. You can think of it as "reducing the array down to one value".

`Array.reduce()` takes a callback function as an argument, which will be called one time for each item in the array. It takes two arguments:

- `previousResult`, the value that your callback returned last time
- `currentItem`, the current item in the array

The first time that the callback runs, there isn't a `previousResult` available, so we need to also pass in an initial value that will be used as the first `previousResult`.

If we wanted to add together an array of numbers to find out what the total is, we could write a reduce callback that looks like this:

```js
const numbers = [2, 5, 8]

const addNumbers = (previousResult, currentItem) => {
  console.log({ previousResult, currentItem })
  return previousResult + currentItem
}

const initialValue = 0

const total = numbers.reduce(addNumbers, initialValue)
// {previousResult: 0, currentItem: 2}
// {previousResult: 2, currentItem: 5}
// {previousResult: 7, currentItem: 8}

console.log(total)
// 15
```

Notice that this `addNumbers` "reduce callback" function doesn't need to keep track of anything itself. It takes the `previousResult` and `currentItem` arguments, does something with them, and returns a new result value.

**A Redux reducer function is exactly the same idea as this "reduce callback" function!** It takes a "previous result" (the `state`), and the "current item" (the `action` object), decides a new state value based on those arguments, and returns that new state.

If we were to create an array of Redux actions, call `reduce()`, and pass in a reducer function, we'd get a final result the same way:

```js
const actions = [
  { type: 'counter/increment' },
  { type: 'counter/increment' },
  { type: 'counter/increment' }
]

const initialState = { value: 0 }

const finalResult = actions.reduce(counterReducer, initialState)
console.log(finalResult)
// {value: 3}
```

We can say that **Redux reducers reduce a set of actions (over time) into a single state**. The difference is that with `Array.reduce()` it happens all at once, and with Redux, it happens over the lifetime of your running app.

</DetailedExplanation>

#### Store

The current Redux application state lives in an object called the **store** .

The store is created by passing in a reducer, and has a method called `getState` that returns the current state value:

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

#### Dispatch

The Redux store has a method called `dispatch`. **The only way to update the state is to call `store.dispatch()` and pass in an action object**. The store will run its reducer function and save the new state value inside, and we can call `getState()` to retrieve the updated value:

```js
store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```

**You can think of dispatching actions as "triggering an event"** in the application. Something happened, and we want the store to know about it. Reducers act like event listeners, and when they hear an action they are interested in, they update the state in response.

We typically call action creators to dispatch the right action:

```js
const increment = () => {
  return {
    type: 'counter/increment'
  }
}

store.dispatch(increment())

console.log(store.getState())
// {value: 2}
```

#### Selectors

**Selectors** are functions that know how to extract specific pieces of information from a store state value. As an application grows bigger, this can help avoid repeating logic as different parts of the app need to read the same data:

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

### Redux Application Data Flow

Earlier, we talked about "one-way data flow", which describes this sequence of steps to update the app:

- State describes the condition of the app at a specific point in time
- The UI is rendered based on that state
- When something happens (such as a user clicking a button), the state is updated based on what occurred
- The UI re-renders based on the new state

For Redux specifically, we can break these steps into more detail:

- Initial setup:
  - A Redux store is created using a root reducer function
  - The store calls the root reducer once, and saves the return value as its initial `state`
  - When the UI is first rendered, UI components access the current state of the Redux store, and use that data to decide what to render. They also subscribe to any future store updates so they can know if the state has changed.
- Updates:
  - Something happens in the app, such as a user clicking a button
  - The app code dispatches an action to the Redux store, like `dispatch({type: 'counter/increment'})`
  - The store runs the reducer function again with the previous `state` and the current `action`, and saves the return value as the new `state`
  - The store notifies all parts of the UI that are subscribed that the store has been updated
  - Each UI component that needs data from the store checks to see if the parts of the state they need have changed.
  - Each component that sees its data has changed forces a re-render with the new data, so it can update what's shown on the screen

Here's what that data flow looks like visually:

![Redux data flow diagram](/img/tutorials/essentials/ReduxDataFlowDiagram.gif)

## What You've Learned

Redux does have a number of new terms and concepts to remember. As a reminder, here's what we just covered:

:::tip Summary

- **Redux is a library for managing global application state**
  - Redux is typically used with the React-Redux library for integrating Redux and React together
  - Redux Toolkit is the recommended way to write Redux logic
- **Redux uses a "one-way data flow" app structure**
  - State describes the condition of the app at a point in time, and UI renders based on that state
  - When something happens in the app:
    - The UI dispatches an action
    - The store runs the reducers, and the state is updated based on what occurred
    - The store notifies the UI that the state has changed
  - The UI re-renders based on the new state
- **Redux uses several types of code**
  - _Actions_ are plain objects with a `type` field, and describe "what happened" in the app
  - _Reducers_ are functions that calculate a new state value based on previous state + an action
  - A Redux _store_ runs the root reducer whenever an action is _dispatched_

:::

## What's Next?

We've seen each of the individual pieces of a Redux app. Next, continue on to [Part 2: Redux App Structure](./part-2-app-structure.md), where we'll look at a full working example to see how the pieces fit together.
