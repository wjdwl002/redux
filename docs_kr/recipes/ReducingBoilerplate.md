---
id: reducing-boilerplate
title: 보일러플레이트 줄이기
hide_title: true
---

# 보일러플레이트 줄이기

Redux는 [Flux에서 영감을 받았고](../introduction/PriorArt.md), Flux에서 가장 일반적인 불만은 보일러플레이트를 많이 쓰게 된다는 점이었습니다. 이 레시피에서 우리는 어떻게 개인적 스타일이나, 팀 세팅이나, 장기 유지보수성 등에 따라 코드를 어떻게 짜야 할지를 Redux가 다양하게 선택 가능하게 하는지 볼 것입니다.

## 액션

액션은 앱에서 무엇이 일어날지 기술하는 평범한 객체이며, 데이터를 어떻게 변경하려는건지 기술할 유일한 방법입니다. **디스패치할 객체로서의 액션은 보일러플레이트가 아니라 Redux의 [기반이 되는 설계적 선택](../introduction/ThreePrinciples.md) 중 하나**라는 점이 중요합니다.
Flux와 비슷한 프레임워크들이 있지만, 액션 객체의 개념은 없습니다. 예측가능성의 측면에서 보자면 Flux나 Redux보다 퇴보한겁니다. 직렬화가능한 평범한 객체인 액션이 없다면, 사용자 세션을 기록하고 재생하거나 [시간여행형 디버거와 결합된 실시간 코드 수정](https://www.youtube.com/watch?v=xsSnOQynTHs)을 구현할 수 없습니다. 여러분이 데이터를 직접 수정하길 원한다면 Redux가 필요 없을겁니다.

액션은 이렇게 생겼습니다:

```js
{ type: 'ADD_TODO', text: 'Use Redux' }
{ type: 'REMOVE_TODO', id: 42 }
{ type: 'LOAD_ARTICLE', response: { ... } }
```

액션이 리듀서(나 Flux의 스토어)가 액션을 구분하게 돕는 상수 타입을 갖는것이 일반적인 규칙입니다. 우리는 기록하고 재생하기 어려운 [심볼](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol)이 아니라 직렬화가 가능한 문자열을 타입으로 쓰는 것을 권합니다.

Flux에서는 전통적으로 모든 액션 타입을 문자열 상수로 정의합니다:

```js
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const LOAD_ARTICLE = 'LOAD_ARTICLE'
```

이게 어떤 잇점이 있을까요? **작은 프로젝트에서 상수는 불필요하다는 지적이 종종 있었고 옳은 말입니다.** 큰 프로젝트에서는 액션 타입을 상수로 정의하는 잇점들이 있습니다:

- 모든 액션 타입이 한 곳에 모이기 때문에 이름짓기의 일관성을 유지하는데 도움이 됩니다.
- 새 기능을 만들기 전에 기존의 모든 액션을 한눈에 보고 싶을 때가 잇을겁니다. 여러분이 필요로 하는 액션이 팀의 다른 사람에 의해 이미 추가되었지만 여러분이 모르고 있을 수도 있으니까요.
- 추가되고, 제거되고, 변경된 액션 타입의 목록은 풀 리퀘스트에서 팀원 모두가 새 기능의 범위와 구현을 따라가는걸 도와줄겁니다.
- 만약 여러분이 액션 상수를 불러오다가 오타를 내면 `undefined`가 나올겁니다. 액션을 보냈는데 아무 일도 일어나지 않는 것보다는 훨씬 알아차리기 쉽습니다.

프로젝트에서 어떤 규칙을 택하는지는 여러분에게 달렸습니다. 인라인 문자열로 시작해서 상수로 옮기고, 별도의 파일로 묶을수도 있을겁니다. Redux는 여기에 대해 별다른 의견이 없으니 여러분의 판단에 따르세요.

## 액션 생산자

액션 객체를 액션을 보내는 곳에서 만드는 대신 이를 만들어주는 함수를 만드는것이 또 다른 일반적인 규칙입니다.

예를 들어 `dispatch`를 오브젝트 리터럴로 호출하는 대신:

```js
// somewhere in an event handler
dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
})
```

별도의 파일에 액션 생산자를 작성해서 컴포넌트로 불러올 수 있습니다:

#### `actionCreators.js`

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}
```

#### `AddTodo.js`

```js
import { addTodo } from './actionCreators'

// somewhere in an event handler
dispatch(addTodo('Use Redux'))
```

액션 생산자는 보일러플레이트라고 비판받기도 합니다. 이들을 반드시 작성할 필요는 없습니다! **프로젝트에서 그게 더 적당하다고 생각하는 부분에는 객체 리터럴을 사용할 수 있습니다.** 하지만 액션 생산자를 작성하는 잇점을 알아둘 필요는 있습니다.

디자이너가 우리 프로토타입을 리뷰하고 왔다고 해봅시다. 디자이너는 우리가 할일을 최대 3개까지만 허용해야 한다고 말했습니다. 우리는 액션 생산자를 재작성해서 [redux-thunk](https://github.com/gaearon/redux-thunk) 미들웨어와 이른 종료를 추가할 수 있습니다:

```js
function addTodoWithoutCheck(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

export function addTodo(text) {
  // This form is allowed by Redux Thunk middleware
  // described below in “Async Action Creators” section.
  return function (dispatch, getState) {
    if (getState().todos.length === 3) {
      // Exit early
      return
    }

    dispatch(addTodoWithoutCheck(text))
  }
}
```

우리는 `addTodo` 액션 생산자가 작동하는 방식을 호출하는 코드는 전혀 모르고 있는 상태에서 바꾸어 놓았습니다. **우리는 할일이 추가되는 모든 곳을 보면서 위의 체크 코드가 있는지 확인할 팔요가 없습니다.** 액션 생산자는 여러분이 액션을 보내는 부근의 추가적인 로직을 이 액션이 나오는 실제 컴포넌트에서 분리할 수 있도록 해줍니다. 애플리케이션이 개발중이고 요구사항이 자주 바뀔때 매우 유용합니다.

### 액션 생산자 만들기

[Flummox](https://github.com/acdlite/flummox) 같은 몇가지 프레임워크들은 액션 타입 상수를 액션 생산자 함수의 정의에서 자동으로 만들어줍니다. 여러분이 `ADD_TODO` 상수와 `addTodo()` 액션 생산자를 동시에 정의할 필요가 없다는 겁니다. 내부적으로는 이들 방법도 여전히 액션 타입 상수를 만들지만 우회적인 수준입니다.

우리는 이런 접근을 권장하지 않습니다. 여러분이 이와 같은 단순한 액션 생산자를 작성하는데 지쳤다면:

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

export function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}
```

액션 생산자를 만들어주는 함수를 작성할 수 있습니다:

```js
function makeActionCreator(type, ...argNames) {
  return function (...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

export const addTodo = makeActionCreator('ADD_TODO', 'todo')
export const removeTodo = makeActionCreator('REMOVE_TODO', 'id')
```

이런 유틸리티의 예제로는 [redux-action-utils](https://github.com/insin/redux-action-utils)와 [redux-actions](https://github.com/acdlite/redux-actions)를 보세요.

이들 유틸리티는 여러분의 코드에 마법적인 부분을 추가한다는 점을 염두해두세요.
몇 줄의 코드를 피하려고 마법과 우회법을 쓸 가치가 있을까요?

## 비동기 액션 생산자

[미들웨어](../Glossary.html#미들웨어)는 여러분이 모든 액션을 보내기 전에 번역해주는 임의의 로직을 삽입할 수 있게 해줍니다. 비동기 액션은 미들웨어의 가장 일반적인 용례입니다.

미들웨어 없이는 [`dispatch`](../api/Store.md#dispatch)가 평범한 객체만을 받아들일 수 있어서, AJAX 호출을 컴포넌트 안에서 해야만 합니다:

#### `actionCreators.js`

```js
export function loadPostsSuccess(userId, response) {
  return {
    type: 'LOAD_POSTS_SUCCESS',
    userId,
    response
  }
}

export function loadPostsFailure(userId, error) {
  return {
    type: 'LOAD_POSTS_FAILURE',
    userId,
    error
  }
}

export function loadPostsRequest(userId) {
  return {
    type: 'LOAD_POSTS_REQUEST',
    userId
  }
}
```

#### `UserInfo.js`

```js
import { Component } from 'react'
import { connect } from 'react-redux'
import {
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFailure
} from './actionCreators'

class Posts extends Component {
  loadData(userId) {
    // Injected into props by React Redux `connect()` call:
    let { dispatch, posts } = this.props

    if (posts[userId]) {
      // There is cached data! Don't do anything.
      return
    }

    // Reducer can react to this action by setting
    // `isFetching` and thus letting us show a spinner.
    dispatch(loadPostsRequest(userId))

    // Reducer can react to these actions by filling the `users`.
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch(loadPostsSuccess(userId, response)),
      error => dispatch(loadPostsFailure(userId, error))
    )
  }

  componentDidMount() {
    this.loadData(this.props.userId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.loadData(nextProps.userId)
    }
  }

  render() {
    if (this.props.isFetching) {
      return <p>Loading...</p>
    }

    let posts = this.props.posts.map(post => <Post post={post} key={post.id} />)

    return <div>{posts}</div>
  }
}

export default connect(state => ({
  posts: state.posts
}))(Posts)
```

하지만 서로 다른 컴포넌트들이 같은 API 엔드포인트에서 데이터를 요청하기 때문에 이 부분을 금방 반복하게 됩니다. 더구나 우리는 이 로직의 일부(예를 들어 캐시된 데이터가 있으면 일찍 종료하기 등)를 여러 컴포넌트에서 재사용하기를 원합니다.

**미들웨어는 우리가 좀 더 표현력 있는 비동기 액션 생산자를 작성하게 해줍니다.** 미들웨어는 우리가 평범한 객체 외의 다른 것을 보낼 수 있게 해주고, 그 값을 변환해줍니다. 예를 들어 미들웨어는 약속이 보내지면 "잡아서" 요청과 성공/실패 액션으로 바꿔줄 수 있습니다.

미들웨어의 가장 간단한 예는 [redux-thunk](https://github.com/gaearon/redux-thunk)입니다. **"썽크" 미들웨어는 여러분이 액션 생산자를 함수를 반환하는 함수인 "썽크"로 작성할 수 있게 해줍니다.** 이는 제어를 역전합니다: 여러분은 `dispatch`를 인자로 받기 떄문에 액션을 여러번 보내는 액션 생산자를 작성할 수 있습니다.

> ##### 한마디

> 썽크 미들웨어는 한가지 예일 뿐입니다. 미들웨어는 "함수를 보낼 수 있게 해주는 것"이 아닙니다: 이는 특정한 미들웨어가 다룰 줄 아는 무엇인가를 보내게 해줍니다. 썽크 미들웨어는 여러분이 함수를 보냈을 때 특정한 행동을 추가하지만, 이는 여러분이 사용하는 미들웨어에 달렸습니다.

위의 코드를 [redux-thunk](https://github.com/gaearon/redux-thunk)를 이용해 재작성해봅시다:

#### `actionCreators.js`

```js
export function loadPosts(userId) {
  // Interpreted by the thunk middleware:
  return function (dispatch, getState) {
    let { posts } = getState()
    if (posts[userId]) {
      // There is cached data! Don't do anything.
      return
    }

    dispatch({
      type: 'LOAD_POSTS_REQUEST',
      userId
    })

    // Dispatch vanilla actions asynchronously
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response =>
        dispatch({
          type: 'LOAD_POSTS_SUCCESS',
          userId,
          response
        }),
      error =>
        dispatch({
          type: 'LOAD_POSTS_FAILURE',
          userId,
          error
        })
    )
  }
}
```

#### `UserInfo.js`

```js
import { Component } from 'react'
import { connect } from 'react-redux'
import { loadPosts } from './actionCreators'

class Posts extends Component {
  componentDidMount() {
    this.props.dispatch(loadPosts(this.props.userId))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.props.dispatch(loadPosts(nextProps.userId))
    }
  }

  render() {
    if (this.props.isFetching) {
      return <p>Loading...</p>
    }

    let posts = this.props.posts.map(post => <Post post={post} key={post.id} />)

    return <div>{posts}</div>
  }
}

export default connect(state => ({
  posts: state.posts
}))(Posts)
```

입력할 것이 훨씬 출었습니다! 원하신다면 "똑똑한" `loadPosts` 액션 생산자 대신 `loadPostsSuccess`와 같은 "평범한" 액션 생산자를 쓸 수도 있습니다.

**마지막으로, 여러분은 미들웨어를 직접 작성할 수 있습니다.** 여러분이 위의 패턴을 일반화해서, 비동기 액션 생산자를 아래처럼 하는 대신에:

```js
export function loadPosts(userId) {
  return {
    // Types of actions to emit before and after
    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
    // Check the cache (optional):
    shouldCallAPI: state => !state.users[userId],
    // Perform the fetching:
    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
    // Arguments to inject in begin/end actions
    payload: { userId }
  }
}
```

이런 액션들을 아래처럼 변환해주는 미들웨어를 만들 수 있습니다:

```js
function callAPIMiddleware({ dispatch, getState }) {
  return function (next) {
    return function (action) {
      const {
        types,
        callAPI,
        shouldCallAPI = () => true,
        payload = {}
      } = action

      if (!types) {
        // Normal action: pass it on
        return next(action)
      }

      if (
        !Array.isArray(types) ||
        types.length !== 3 ||
        !types.every(type => typeof type === 'string')
      ) {
        throw new Error('Expected an array of three string types.')
      }

      if (typeof callAPI !== 'function') {
        throw new Error('Expected fetch to be a function.')
      }

      if (!shouldCallAPI(getState())) {
        return
      }

      const [requestType, successType, failureType] = types

      dispatch(
        Object.assign({}, payload, {
          type: requestType
        })
      )

      return callAPI().then(
        response =>
          dispatch(
            Object.assign({}, payload, {
              response: response,
              type: successType
            })
          ),
        error =>
          dispatch(
            Object.assign({}, payload, {
              error: error,
              type: failureType
            })
          )
      )
    }
  }
}
```

이 미들웨어를 [`applyMiddleware(...middlewares)`](../api/applyMiddleware.md)에 넘기고 나면 여러분의 모든 API 호출 액션 생산자들을 같은 방식으로 작성할 수 있습니다:

```js
export function loadPosts(userId) {
  return {
    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
    shouldCallAPI: state => !state.users[userId],
    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
    payload: { userId }
  }
}

export function loadComments(postId) {
  return {
    types: [
      'LOAD_COMMENTS_REQUEST',
      'LOAD_COMMENTS_SUCCESS',
      'LOAD_COMMENTS_FAILURE'
    ],
    shouldCallAPI: state => !state.posts[postId],
    callAPI: () => fetch(`http://myapi.com/posts/${postId}/comments`),
    payload: { postId }
  }
}

export function addComment(postId, message) {
  return {
    types: [
      'ADD_COMMENT_REQUEST',
      'ADD_COMMENT_SUCCESS',
      'ADD_COMMENT_FAILURE'
    ],
    callAPI: () =>
      fetch(`http://myapi.com/posts/${postId}/comments`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      }),
    payload: { postId, message }
  }
}
```

## 리듀서

Redux는 업데이트 로직을 함수로 기술함으로써 Flux 스토어의 보일러플레이트를 상당히 줄였습니다. 함수는 객체보다 단순하고, 클래스보다는 더욱 단순합니다.

이 Flux 스토어를 봅시다:

```js
let _todos = [];

export default const TodoStore = assign({}, EventEmitter.prototype, {
  getAll() {
    return _todos;
  }
});

AppDispatcher.register(function (action) {
  switch (action.type) {
  case ActionTypes.ADD_TODO:
    let text = action.text.trim();
    _todos.push(text);
    TodoStore.emitChange();
  }
});
```

Redux에서 같은 업데이트 로직을 리듀싱 함수로 표현할 수 있습니다:

```js
export function todos(state = [], action) {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      let text = action.text.trim()
      return [...state, text]
    default:
      return state
  }
}
```

`switch`문은 진짜 보일러플레이트가 **아닙니다**. Flux의 진짜 보일러플레이트는 개념적인 부분입니다: 변경사항을 보내야 하고, 디스패쳐에 스토어를 등록해야 하고, 스토어가 객체가 되어야 합니다(그리고 유니버셜 앱을 만들때 그 복잡성이 드러나죠).

많은 이들이 아직도 문서에 `switch`문을 사용하는가를 보고 프레임워크를 선택한다는건 불행한 일입니다. 여러분이 `switch`를 싫어한다면, 아래에 나온 것처럼 함수 하나로 해결할 수 있습니다.

### 리듀서 만들기

리듀서가 액션 타입에서 핸들러로 객체를 매핑하도록 만들어주는 함수를 짜봅시다. 예를 들어 `todos` 리듀서는 이와 같이 정의됩니다:

```js
export const todos = createReducer([], {
  [ActionTypes.ADD_TODO](state, action) {
    let text = action.text.trim();
    return [...state, text];
  }
}
```

이를 완성하기 위해 아래의 헬퍼를 작성합니다:

```js
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
```

어렵지 않지요? 이렇게 작성하는 방법엔 여러 가지가 있기 때문에 Redux는 이런 헬퍼를 기본적으로 지원하지는 않습니다. 여러분은 서버 상태를 채워넣기 위해 평범한 JS 객체를 Immutable 객체로 자동으로 변환하고 싶을 수도 있습니다. 반환된 상태를 현재 상태와 병합하고 싶을 수도 있지요. "모두 다 잡아내는" 핸들러에는 여러 접근이 있을 수 있습니다. 이들 모두는 여러분의 팀이 특정 프로젝트를 위해 정할 규칙에 달렸습니다.

Redux의 리듀서 API는 `(state, action) => state`이지만, 이들 리듀서를 어떻게 만들지는 여러분에게 달렸습니다.
