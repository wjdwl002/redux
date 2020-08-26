---
id: getting-started
title: Redux 시작하기
description: '소개 > 시작하기: Resources to get started learning and using Redux'
hide_title: true
---

# Redux 시작하기

Redux는 자바스크립트 앱을 위한 예측 가능한 상태 컨테이너입니다.

Redux는 여러분이 일관적으로 동작하고, 서로 다른 환경(서버, 클라이언트, 네이티브)에서 작동하고, 테스트하기 쉬운 앱을 작성하도록 도와줍니다. 여기에 더해서 [시간여행형 디버거와 결합된 실시간 코드 수정](https://github.com/reduxjs/redux-devtools)과 같은 훌륭한 개발자 경험을 제공합니다.

여러분은 Redux를 [React](https://facebook.github.io/react/)나 다른 뷰 라이브러리와 함께 사용할 수 있습니다.
Redux는 매우 작습니다 (2kB, 의존 라이브러리 포함).

## 설치

### Redux Toolkit

[**Redux Toolkit**](https://redux-toolkit.js.org) is our official recommended approach for writing Redux logic. It wraps around the Redux core, and contains packages and functions that we think are essential for building a Redux app. Redux Toolkit builds in our suggested best practices, simplifies most Redux tasks, prevents common mistakes, and makes it easier to write Redux applications.

RTK includes utilities that help simplify many common use cases, including [store setup](https://redux-toolkit.js.org/api/configureStore),
[creating reducers and writing immutable update logic](https://redux-toolkit.js.org/api/createreducer),
and even [creating entire "slices" of state at once](https://redux-toolkit.js.org/api/createslice).

Whether you're a brand new Redux user setting up your first project, or an experienced user who wants to
simplify an existing application, **[Redux Toolkit](https://redux-toolkit.js.org/)** can help you
make your Redux code better.

Redux Toolkit is available as a package on NPM for use with a module bundler or in a Node application:

```bash
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

### Create a React Redux App

The recommended way to start new apps with React and Redux is by using the [official Redux+JS template](https://github.com/reduxjs/cra-template-redux) for [Create React App](https://github.com/facebook/create-react-app), which takes advantage of **[Redux Toolkit](https://redux-toolkit.js.org/)** and React Redux's integration with React components.

```sh
npx create-react-app my-app --template redux
```

### Redux Core

The Redux core library is available as a package on NPM for use with a module bundler or in a Node application:

```bash
# NPM
npm install redux

# Yarn
yarn add redux
```

It is also available as a precompiled UMD package that defines a `window.Redux` global variable. The UMD package can be used as a [`<script>` tag](https://unpkg.com/redux/dist/redux.js) directly.

For more details, see the [Installation](Installation.md) page.

## 기본 예제

여러분의 앱의 상태 전부는 하나의 저장소(_store_)안에 있는 객체 트리에 저장됩니다.
상태 트리를 변경하는 유일한 방법은 무엇이 일어날지 서술하는 객체인 액션(_action_)을 보내는 것 뿐입니다.
액션이 상태 트리를 어떻게 변경할지 명시하기 위해 여러분은 리듀서(_reducers_)를 작성해야 합니다.

이게 다입니다!

```js
import { createStore } from 'redux'

/**
 * 이것이 (state, action) => state 형태의 순수 함수인 리듀서입니다.
 * 리듀서는 액션이 어떻게 상태를 다음 상태로 변경하는지 서술합니다.
 *
 * 상태의 모양은 당신 마음대로입니다: 기본형(primitive)일수도, 배열일수도, 객체일수도,
 * 심지어 Immutable.js 자료구조일수도 있습니다. 오직 중요한 점은 상태 객체를 변경해서는 안되며,
 * 상태가 바뀐다면 새로운 객체를 반환해야 한다는 것입니다.
 *
 * 이 예제에서 우리는 `switch` 구문과 문자열을 썼지만,
 * 여러분의 프로젝트에 맞게
 * (함수 맵 같은) 다른 컨벤션을 따르셔도 좋습니다.
 */
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// 앱의 상태를 보관하는 Redux 저장소를 만듭니다.
// API로는 { subscribe, dispatch, getState }가 있습니다.
let store = createStore(counter)

// 업데이트를 직접 구독하거나 뷰 레이어에 바인딩할수 있습니다.
// 보통은 subscribe()를 직접 사용하기보다는 뷰 바인딩 라이브러리(예를 들어 React Redux)를 사용합니다.
// 하지만 현재 상태를 localStorage에 영속적으로 저장할 때도 편리합니다.

store.subscribe(() => console.log(store.getState()))

// 내부 상태를 변경하는 유일한 방법은 액션을 보내는 것뿐입니다.
// 액션은 직렬화될수도, 로깅할수도, 저장할수도 있으며 나중에 재실행할수도 있습니다.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

상태를 바로 변경하는 대신, **액션**이라 불리는 평범한 객체를 통해 일어날 변경을 명시합니다. 그리고 각각의 액션이 전체 애플리케이션의 상태를 어떻게 변경할지 결정하는 특별한 함수인 **리듀서**를 작성합니다.

만약 여러분이 Flux를 개발하다가 왔다면, 알아둬야 할 중요한 차이점이 있습니다. Redux는 Dispatcher가 없고 저장소 여러개를 지원하지도 않습니다. 대신 루트 리듀싱 함수 하나를 가지는 단 하나의 저장소가 있습니다. 당신의 앱이 커지면 저장소를 추가하는 대신 루트 리듀서를 쪼개서 상태 트리의 각기 다른 부분을 독립적으로 다루는 리듀서들을 만들면 됩니다. 마치 React 앱에는 하나의 루트 컴포넌트가 있고 이 루트 컴포넌트가 여러개의 작은 컴포넌트로 이루어진 것처럼요.

이 아키텍쳐는 숫자 세는 앱 하나 만드는데에는 과도해 보일 수 있지만 이 패턴의 아름다움은 크고 복잡한 앱으로 확장하기 좋다는 점입니다. 이는 또한 액션이 일으키는 모든 변경을 추적함으로써 강력한 개발자 도구를 가능하게 합니다. 여러분은 액션을 재생하는 것만으로 사용자 세션을 기록하고 재생산할 수 있습니다.

## Redux 배우기

Redux를 배우는 데 도움이 될 다양한 자료가 있습니다.

### Redux Essentials Tutorial

The [**Redux Essentials tutorial**](../tutorials/essentials/part-1-overview-concepts.md) is a "top-down" tutorial that teaches how to use Redux the right way, using our latest recommended APIs and best practices. We recommend starting there.

### Additional Tutorials

- The Redux docs [**Basic tutorial**](../basics/README.md) and [**Advanced tutorial**](../advanced/README.md) are a "bottom-up" tutorial that teaches how Redux works, starting from first principles.
- The Redux repository contains several example projects demonstrating various aspects of how to use Redux. Almost all examples have a corresponding CodeSandbox sandbox. This is an interactive version of the code that you can play with online. See the complete list of examples in the **[Examples page](./Examples.md)**.
- Redux creator Dan Abramov's **free ["Getting Started with Redux" video series](https://egghead.io/series/getting-started-with-redux)** and **[Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)** video courses on Egghead.io
- Redux maintainer Mark Erikson's **["Redux Fundamentals" conference talk](http://blog.isquaredsoftware.com/2018/03/presentation-reactathon-redux-fundamentals/)** and [**"Redux Fundamentals" workshop slides**](https://blog.isquaredsoftware.com/2018/06/redux-fundamentals-workshop-slides/)
- Dave Ceddia's post [**A Complete React Redux Tutorial for Beginners**](https://daveceddia.com/redux-tutorial/)

### Other Resources

- The **[Redux FAQ](../FAQ.md)** answers many common questions about how to use Redux, and the **["Recipes" docs section](../recipes/README.md)** has information on handling derived data, testing, structuring reducer logic, and reducing boilerplate.
- Redux maintainer Mark Erikson's **["Practical Redux" tutorial series](http://blog.isquaredsoftware.com/series/practical-redux/)** demonstrates real-world intermediate and advanced techniques for working with React and Redux (also available as **[an interactive course on Educative.io](https://www.educative.io/collection/5687753853370368/5707702298738688)**).
- The **[React/Redux links list](https://github.com/markerikson/react-redux-links)** has categorized articles on working with [reducers and selectors](https://github.com/markerikson/react-redux-links/blob/master/redux-reducers-selectors.md), [managing side effects](https://github.com/markerikson/react-redux-links/blob/master/redux-side-effects.md), [Redux architecture and best practices](https://github.com/markerikson/react-redux-links/blob/master/redux-architecture.md), and more.
- Our community has created thousands of Redux-related libraries, addons, and tools. The **["Ecosystem" docs page](./Ecosystem.md)** lists our recommendations, and there's a complete listing available in the **[Redux addons catalog](https://github.com/markerikson/redux-ecosystem-links)**.

## 도움과 논의

The **[#redux channel](https://discord.gg/0ZcbPKXt5bZ6au5t)** of the **[Reactiflux Discord community](http://www.reactiflux.com)** is our official resource for all questions related to learning and using Redux. Reactiflux is a great place to hang out, ask questions, and learn - come join us!

You can also ask questions on [Stack Overflow](https://stackoverflow.com) using the **[#redux tag](https://stackoverflow.com/questions/tagged/redux)**.

If you have a bug report or need to leave other feedback, [please file an issue on the Github repo](https://github.com/reduxjs/redux)

## Redux를 사용해야 할까요?

Redux는 상태를 관리하기에 좋은 도구이지만 여러분의 상황에 적당한지는 따져 보아야 합니다. **단지 누군가가 사용하라고 했다는 이유만으로 Redux를 사용하지는 마세요 - 시간을 들여서 잠재적인 이점과 그에 따른 장단점에 대해 이해하세요.**

Redux를 사용할만한 시점을 알기 위한 몇 가지 제안이 있습니다:

- 계속해서 바뀌는 상당한 양의 데이터가 있다
- 상태를 위한 단 하나의 원천이 필요하다
- 모든 상태를 가지고 있기에는 최상위 컴포넌트가 더 이상 적당하지 않다

> **Redux가 어떻게 사용되어야 하는지에 대한 여러 생각들을 보려면:**
>
> - **[Redux FAQ: When should I use Redux?](../faq/General.md#when-should-i-use-redux)**
> - **[당신에게 Redux는 필요 없을지도 모릅니다.](https://medium.com/@Dev_Bono/당신에게-redux는-필요-없을지도-모릅니다-b88dcd175754)**
>
> - **[The Tao of Redux, Part 1 - Implementation and Intent](http://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
>
> - **[The Tao of Redux, Part 2 - Practice and Philosophy](http://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/)**
> - **[Redux FAQ](../FAQ.md)**
