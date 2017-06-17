# <a href='https://deminoth.github.io/redux'><img src='https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67' height='60'></a>

Redux는 자바스크립트 앱을 위한 예측 가능한 상태 컨테이너입니다.
(혹시 워드프레스 프레임워크를 찾아오셨다면, [Redux Framework](https://reduxframework.com/)를 확인해보세요.)

Redux는 여러분이 일관적으로 동작하고, 서로 다른 환경(서버, 클라이언트, 네이티브)에서 작동하고, 테스트하기 쉬운 앱을 작성하도록 도와줍니다. 여기에 더해서 [시간여행형 디버거와 결합된 실시간 코드 수정](https://github.com/gaearon/redux-devtools)과 같은 훌륭한 개발자 경험을 제공합니다.

여러분은 Redux를 [React](https://facebook.github.io/react/)나 다른 뷰 라이브러리와 함께 사용할 수 있습니다.
Redux는 매우 작습니다 (2kB, 의존 라이브러리 포함).

[![build status](https://img.shields.io/travis/reactjs/redux/master.svg?style=flat-square)](https://travis-ci.org/reactjs/redux)
[![npm version](https://img.shields.io/npm/v/redux.svg?style=flat-square)](https://www.npmjs.com/package/redux)
[![npm downloads](https://img.shields.io/npm/dm/redux.svg?style=flat-square)](https://www.npmjs.com/package/redux)
[![redux channel on discord](https://img.shields.io/badge/discord-%23redux%20%40%20reactiflux-61dafb.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bZ6au5t)
[![#rackt on freenode](https://img.shields.io/badge/irc-%23rackt%20%40%20freenode-61DAFB.svg?style=flat-square)](https://webchat.freenode.net/)
[![Changelog #187](https://img.shields.io/badge/changelog-%23187-lightgrey.svg?style=flat-square)](https://changelog.com/187)

>**Learn Redux from its creator:**
>**[Part 1: Getting Started with Redux](https://egghead.io/series/getting-started-with-redux) (30 free videos)**<br>
>**[Part 2: Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) (27 free videos)**

### 추천사

>["Love what you’re doing with Redux"](https://twitter.com/jingc/status/616608251463909376)
>Jing Chen, creator of Flux

>["I asked for comments on Redux in FB's internal JS discussion group, and it was universally praised. Really awesome work."](https://twitter.com/fisherwebdev/status/616286955693682688)
>Bill Fisher, creator of Flux

>["It's cool that you are inventing a better Flux by not doing Flux at all."](https://twitter.com/andrestaltz/status/616271392930201604)
>André Staltz, creator of Cycle

### 더 나아가기 전에

>**이것도 읽어보세요:**
>**[당신에게 Redux는 필요 없을지도 모릅니다.](https://medium.com/@Dev_Bono/당신에게-redux는-필요-없을지도-모릅니다-b88dcd175754)**

### 개발자 경험

저는 Redux를 ["Hot Reloading with Time Travel"](https://www.youtube.com/watch?v=xsSnOQynTHs)이라는 React Europe 발표를 위해 작업하면서 만들었습니다. 제 목표는 최소한의 API를 가지면서도 완전히 예측 가능한 행동을 하는 상태 관리 라이브러리를 만들어서, 이를 통해 로깅, 핫 리로딩, 시간여행, 유니버셜 앱, 기록과 재생 등을 개발자의 노력 없이도 구현하는 것이었습니다.

### 영향을 받은 것들

Redux는 [Flux](https://facebook.github.io/flux)의 아이디어를 발전시키되, [Elm](https://github.com/evancz/elm-architecture-tutorial/)의 큐들을 가져옴으로써 복잡성은 줄였습니다.
이들을 써보셨는지와 상관 없이, Redux를 시작하는데는 몇 분이면 충분합니다.

### 설치

안정 버전을 설치하시려면:

```
npm install --save redux
```

이는 여러분이 [npm](https://www.npmjs.com/)을 패키지 매니저로 사용하고 있다고 가정합니다.

만약 아니라면 [이들 파일을 unpkg에서 접근](https://unpkg.com/redux/)해서 다운로드받거나 여러분의 패키지 매니저에 지정해주세요.

대부분의 사람들은 Redux를 [CommonJS](http://webpack.github.io/docs/commonjs.html) 모듈로 사용합니다. 이 모듈은 [Webpack](https://webpack.js.org/)이나 [Browserify](http://browserify.org/), 네이티브 환경에서 `redux`를 임포트할때 불러와집니다. 여러분이 최첨단을 걷고 있으며 [Rollup](http://rollupjs.org)을 사용한다면 이 역시 지원합니다.

만약 여러분이 모듈 번들러를 사용하고 있지 않더라도 괜찮습니다. `redux` npm 패키지는 미리 컴파일된 프로덕션과 개발용 [UMD](https://github.com/umdjs/umd) 빌드를 [`dist` 폴더](https://unpkg.com/redux/dist/)에 포함하고 있습니다. 이들은 번들러 없이 바로 사용 가능하고 대부분의 자바스크립트 모듈 로더나 환경과 호환됩니다. 예를 들어 UMD 빌드를 페이지 상의 [`<script>` 태그](https://npmcdn.com/redux/dist/redux.js)로 사용하거나 [Bower가 설치하게 할 수 있습니다](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975). UMD 빌드는 Redux를 `window.Redux` 전역변수로 사용하게 해줍니다.

Redux 소스코드는 ES2015로 작성되었지만 CommonJS와 UMD 빌드 모두를 ES5로 미리 컴파일해두었기 때문에 [모든 모던 브라우저](http://caniuse.com/#feat=es5)에서 작동합니다. [Redux를 시작하기](https://github.com/reactjs/redux/blob/master/examples/counter-vanilla/index.html)위해 Babel이나 모듈 번들러를 사용할 필요는 없습니다.

#### 보조 패키지

아마 여러분은 [React 바인딩](http://github.com/gaearon/react-redux)과 [개발자 도구](http://github.com/gaearon/redux-devtools)도 필요하실겁니다.

```
npm install --save react-redux
npm install --save-dev redux-devtools
```

Redux 자체와는 달리 Redux 생태계의 많은 패키지들은 UMD 빌드를 제공하지 않으므로, 편안한 개발 경험을 위해 [Webpack](https://webpack.js.org/)이나 [Browserify](http://browserify.org/) 같은 CommonJS 모듈 번들러를 사용하기를 권합니다.


### The Gist

여러분의 앱의 상태 전부는 하나의 스토어(**store**)안에 있는 객체 트리에 저장됩니다.
상태 트리를 변경하는 유일한 방법은 무엇이 일어날지 서술하는 객체인 액션(**action**)을 보내는 것 뿐입니다.
액션이 상태 트리를 어떻게 변경할지 명시하기 위해 여러분은 리듀서(**reducers**)를 작성해야 합니다.

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
 * 이 예시에서 우리는 `switch` 구문과 문자열을 썼지만,
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

// 앱의 상태를 보관하는 Redux 스토어를 만듭니다.
// API로는 { subscribe, dispatch, getState }가 있습니다.
let store = createStore(counter)

// 업데이트를 직접 구독하거나 뷰 레이어에 바인딩할수 있습니다.
// 보통은 subscribe()를 직접 사용하기보다는 뷰 바인딩 라이브러리(예를 들어 React Redux)를 사용합니다.
// 하지만 현재 상태를 localStorage에 영속적으로 저장할 때도 편리합니다.

store.subscribe(() =>
  console.log(store.getState())
)

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

만약 여러분이 Flux를 개발하다가 왔다면, 알아둬야 할 중요한 차이점이 있습니다. Redux는 Dispatcher가 없고 스토어 여러개를 지원하지도 않습니다. 대신 루트 리듀싱 함수 하나를 가지는 단 하나의 스토어가 있습니다. 당신의 앱이 커지면 스토어를 추가하는 대신 루트 리듀서를 쪼개서 상태 트리의 각기 다른 부분을 독립적으로 다루는 리듀서들을 만들면 됩니다. 마치 React 앱에는 하나의 루트 컴포넌트가 있고 이 루트 컴포넌트가 여러개의 작은 컴포넌트로 이루어진 것처럼요.

이 아키텍쳐는 숫자 세는 앱 하나 만드는데에는 과도해 보일 수 있지만 이 패턴의 아름다움은 크고 복잡한 앱으로 확장하기 좋다는 점입니다. 이는 또한 액션이 일으키는 모든 변경을 추적함으로써 강력한 개발자 도구를 가능하게 합니다. 여러분은 액션을 재생하는 것만으로 사용자 세션을 기록하고 재생산할 수 있습니다.

### 제작자로부터 Redux 배우기

[Getting Started with Redux](https://egghead.io/series/getting-started-with-redux) is a video course consisting of 30 videos narrated by Dan Abramov, author of Redux. It is designed to complement the “Basics” part of the docs while bringing additional insights about immutability, testing, Redux best practices, and using Redux with React. **This course is free and will always be.**

>[“Great course on egghead.io by @dan_abramov - instead of just showing you how to use #redux, it also shows how and why redux was built!”](https://twitter.com/sandrinodm/status/670548531422326785)
>Sandrino Di Mattia

>[“Plowing through @dan_abramov 'Getting Started with Redux' - its amazing how much simpler concepts get with video.”](https://twitter.com/chrisdhanaraj/status/670328025553219584)
>Chris Dhanaraj

>[“This video series on Redux by @dan_abramov on @eggheadio is spectacular!”](https://twitter.com/eddiezane/status/670333133242408960)
>Eddie Zaneski

>[“Come for the name hype. Stay for the rock solid fundamentals. (Thanks, and great job @dan_abramov and @eggheadio!)”](https://twitter.com/danott/status/669909126554607617)
>Dan

>[“This series of videos on Redux by @dan_abramov is repeatedly blowing my mind - gunna do some serious refactoring”](https://twitter.com/gelatindesign/status/669658358643892224)
>Laurence Roberts

So, what are you waiting for?

#### [Watch the 30 Free Videos!](https://egghead.io/series/getting-started-with-redux)

If you enjoyed my course, consider supporting Egghead by [buying a subscription](https://egghead.io/pricing). Subscribers have access to the source code for the example in every one of my videos, as well as to tons of advanced lessons on other topics, including JavaScript in depth, React, Angular, and more. Many [Egghead instructors](https://egghead.io/instructors) are also open source library authors, so buying a subscription is a nice way to thank them for the work that they've done.

### 문서

* [소개](https://deminoth.github.io/redux/introduction/index.html)
* [기초](https://deminoth.github.io/redux/basics/index.html)
* [심화](https://deminoth.github.io/redux/advanced/index.html)
* [레시피](https://deminoth.github.io/redux/recipes/index.html)
* [문제해결](https://deminoth.github.io/redux/Troubleshooting.html)
* [용어사전](https://deminoth.github.io/redux/Glossary.html)
* [API 레퍼런스](https://deminoth.github.io/redux/api/index.html)

오프라인에서 읽기 위한 PDF, ePub, MOBI 버전을 받거나 어떻게 만드는지 알고 싶다면, [paulkogel/redux-offline-docs](https://github.com/paulkogel/redux-offline-docs)을 보세요.

Offline 문서는 [devdocs](http://devdocs.io/redux/)을 보세요.

### 예시

* [Counter Vanilla](http://redux.js.org/docs/introduction/Examples.html#counter-vanilla) ([source](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla))
* [Counter](http://redux.js.org/docs/introduction/Examples.html#counter) ([source](https://github.com/reactjs/redux/tree/master/examples/counter))
* [Todos](http://redux.js.org/docs/introduction/Examples.html#todos) ([source](https://github.com/reactjs/redux/tree/master/examples/todos))
* [Todos with Undo](http://redux.js.org/docs/introduction/Examples.html#todos-with-undo) ([source](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo))
* [TodoMVC](http://redux.js.org/docs/introduction/Examples.html#todomvc) ([source](https://github.com/reactjs/redux/tree/master/examples/todomvc))
* [Shopping Cart](http://redux.js.org/docs/introduction/Examples.html#shopping-cart) ([source](https://github.com/reactjs/redux/tree/master/examples/shopping-cart))
* [Tree View](http://redux.js.org/docs/introduction/Examples.html#tree-view) ([source](https://github.com/reactjs/redux/tree/master/examples/tree-view))
* [Async](http://redux.js.org/docs/introduction/Examples.html#async) ([source](https://github.com/reactjs/redux/tree/master/examples/async))
* [Universal](http://redux.js.org/docs/introduction/Examples.html#universal) ([source](https://github.com/reactjs/redux/tree/master/examples/universal))
* [Real World](http://redux.js.org/docs/introduction/Examples.html#real-world) ([source](https://github.com/reactjs/redux/tree/master/examples/real-world))

만약 여러분이 NPM 생태계가 생소하고 프로젝트를 시작하는데 문제가 있거나 위의 코드를 어디에 붙여넣어야 할지 모르겠다면, Redux를 React와 Browserify와 함께 사용하는 [simplest-redux-example](https://github.com/jackielii/simplest-redux-example)을 참고하세요.

### 논의

[Reactiflux](http://www.reactiflux.com) Discord 커뮤니티의 [#redux](https://discord.gg/0ZcbPKXt5bZ6au5t) 채널에 참여하세요.

### 감사의 말

* [The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial) for a great intro to modeling state updates with reducers;
* [Turning the database inside-out](http://blog.confluent.io/2015/03/04/turning-the-database-inside-out-with-apache-samza/) for blowing my mind;
* [Developing ClojureScript with Figwheel](http://www.youtube.com/watch?v=j-kj2qwJa_E) for convincing me that re-evaluation should "just work";
* [Webpack](https://webpack.js.org/concepts/hot-module-replacement/) for Hot Module Replacement;
* [Flummox](https://github.com/acdlite/flummox) for teaching me to approach Flux without boilerplate or singletons;
* [disto](https://github.com/threepointone/disto) for a proof of concept of hot reloadable Stores;
* [NuclearJS](https://github.com/optimizely/nuclear-js) for proving this architecture can be performant;
* [Om](https://github.com/omcljs/om) for popularizing the idea of a single state atom;
* [Cycle](https://github.com/staltz/cycle) for showing how often a function is the best tool;
* [React](https://github.com/facebook/react) for the pragmatic innovation.

NPM 패키지명인 `redux`를 넘겨주신 [Jamie Paton](http://jdpaton.github.io)에게 특별한 감사의 말을 전합니다.

### 로고

공식 로고를 [GitHub](https://github.com/reactjs/redux/tree/master/logo)에서 찾아보실 수 있습니다.

### 변경 기록

이 프로젝트는 [유의적 버전](http://semver.org/lang/ko/)을 따릅니다.
매 릴리즈는 마이그레이션 설명과 함께 깃헙 [릴리즈](https://github.com/rackt/redux/releases) 페이지에 문서화됩니다.

### 후원자

Redux 작업은 [커뮤니티에 의해 펀딩되었습니다](https://www.patreon.com/reactdx).
이를 가능하게 했던 주요한 회사들을 소개합니다.

* [Webflow](https://github.com/webflow)
* [Ximedes](https://www.ximedes.com/)

[전체 후원자 명단](PATRONS_kr.md)과 지속적으로 늘어나고 있는 [Redux를 사용하는 사람과 회사들](https://github.com/reactjs/redux/issues/310) 목록을 볼 수 있습니다.

### 라이선스

MIT

### 번역

한국어 번역 기여는 [Github 저장소](https://github.com/deminoth/redux)로 풀 리퀘스트를 보내주시기 바랍니다.
