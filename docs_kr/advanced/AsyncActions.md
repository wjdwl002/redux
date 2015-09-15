# 비동기 액션

[이전 세션](Middleware.md)에서 우리는 Redux 미들웨어가 어떻게 액션이 리듀서에 도달하기 전에 가로채고, 지연시키고, 변환하는지 알아보았습니다. 미들웨어를 사용하는 경우는 다양합니다: 로깅과 충돌 보고가 좋은 예시입니다. 하지만, 미들웨어를 사용하는 가장 흔한 경우는 비동기 API 호출입니다.

[기초 가이드](../basics/README.md)에서 우리는 간단한 할일 애플리케이션을 만들었습니다. 이 앱은 완전히 동기적이었죠. 매번 액션이 보내질때마다, 상태가 바로 변경되었습니다.

이 가이드에서 우리는 비동기 애플리케이션을 만들겠습니다. Reddit API를 써서 선택한 subreddit의 현재 헤드라인을 보여줄겁니다. 비동기가 어떻게 Redux의 흐름에 들어가게 될까요?

## 액션

여러분이 비동기 API를 호출하더라도, 저장된 데이터를 바꾸기 위해서는 액션이 보내져야 하고 이들이 리듀서에 의해 동기적으로 처리되어야 합니다. 보통 어떤 API 요청이건간에 여러분은 최소한 3가지 다른 액션을 보내게 됩니다:

* **리듀서에게 요청이 시작되었음을 알리는 액션.**

  리듀서는 이 액션을 처리하기 위해 상태의 `isFetching` 표지를 바꾸는 것 같은 일을 할겁니다. 이를 통해 UI가 스피너를 표시해야 한다는걸 알 수 있습니다.

* **리듀서에게 요청이 성공적으로 완료되었다고 알리는 액션.**  

  리듀서는 새 데이터를 상태에 합치고 `isFetching`을 되돌려서 이 액션을 처리할겁니다. UI는 스피너를 숨기고 가져온 데이터를 표시합니다.

* **리듀서에게 요청이 실패했음을 알리는 액션.**  

  리듀서는 `isFetching`을 되돌려서 이 액션을 처리합니다. 리듀서는 에러 메시지를 UI에 표시하기 위해 상태에 저장할수도 있습니다.
  
여러분은 액션에 따로 `status` 필드를 두고 사용할겁니다:

```js
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
```

아니면 이들의 타입을 따로 정의할수도 있습니다:

```js
{ type: 'FETCH_POSTS_REQUEST' }
{ type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
{ type: 'FETCH_POSTS_SUCCESS', response: { ... } }
```

하나의 액션 타입에 표지를 두고 사용하건, 여러 액션 타입을 사용하건 여러분에게 달렸습니다. 여러분이 팀과 함께 정할 규칙일 뿐입니다. 여러 타입을 쓰면 실수는 줄겠지만, 여러분이 [redux-actions](https://github.com/acdlite/redux-actions)와 같은 헬퍼 라이브러리를 써서 액션 생산자와 리듀서를 만든다면 이게 별 문제가 되지 않을 수도 있습니다.

어떤 규칙을 택하건 이를 애플리케이션 내내 유지하세요.
우리는 이 튜토리얼에서 별도의 타입을 쓰겠습니다.

## 동기 액션 생산자

몇가지 동기 액션 타입과 이들을 위한 액션 생산자를 정의하면서 시작해봅시다. 우리의 앱에서 사용자는 표시할 reddit을 선택할 수 있습니다:

```js
export const SELECT_REDDIT = 'SELECT_REDDIT';

export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  };
}
```

사용자들은 "새로고침" 버튼을 눌러 업데이트할수도 있습니다:

```js
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT';

export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  };
}
```

이들 액션은 사용자의 상호작용에 의해 통제됩니다. 우리에겐 네트워크 요청에 의해 통제되는 다른 종류의 액션 또한 있어야 합니다. 이들을 어떻게 보낼지는 나중에 보도록 하고, 지금은 일단 이들을 정의하도록 합시다.

reddit에서 포스트를 받아와야 할 때가 되면, 우리는 `REQUEST_POSTS` 액션을 보낼겁니다:

```js
export const REQUEST_POSTS = 'REQUEST_POSTS';

export function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}
```

`SELECT_REDDIT`과 `INVALIDATE_REDDIT`을 분리하는건 중요합니다. 이들이 하나씩 일어나기는 하지만, 앱이 커지고 복잡해짐에 따라 사용자 액션과는 별개로 데이터를 가져오기를 원하게 될 수 있습니다(예를 들어 가장 인기있는 reddit을 미리 불러오거나, 가끔씩 오래된 데이터를 새로고침하는 등). 아니면 라우트 변경에 따라 응답을 가져올수도 있으므로, 특정 UI 이벤트에 가져오기를 엮어두는것은 좋지 않습니다.

마지막으로 네트워크 요청이 도달했을때 `RECEIVE_POSTS`를 보내겠습니다:

```js
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}
```

당장 알아야 할 것들은 이게 다입니다. 이들 액션을 네트워크 요청에 따라 보내는 작동방식은 나중에 논의하도록 하겠습니다.


>##### 에러 핸들링에 대해

>실제 앱에서 여러분은 요청 실패에 대해서도 액션을 보내기를 원할겁니다. 이 튜토리얼에서는 에러 핸들링을 구현하지 않았지만, [real world example](../introduction/Examples.html#real-world)에서 가능한 접근법 중 하나를 볼 수 있습니다.

## 상태의 모양을 설계하기

기초 튜토리얼에서와 마찬가지로 여러분은 구현하기 전에 [애플리케이션의 상태가 어떤 모양일지 설계해야](../basics/Reducers.md#상태-설계하기) 합니다. 비동기 코드에서는 신경써야 할 상태가 더 많기 때문에 이에 대해 생각해 볼 필요가 있습니다.

이 부분은 초보자에게는 종종 혼란스럽습니다. 비동기 애플리케이션에서 상태가 어떤 정보를 기술해야 하고 이를 단일 트리 안에 어떻게 정리해야 할지 바로 명백해지지 않기 때문입니다.

우리는 가장 흔한 케이스에서 시작하겠습니다: 목록입니다. 웹 애플리케이션은 종종 어떤 것들의 목록을 표시합니다. 예를 들어 포스트의 목록이나 친구의 목록처럼요. 여러분은 앱에서 어떤 종류의 목록을 표시해야 할지 알아야 합니다. 이들은 캐시했다가 필요할때만 다시 받아와야 하기 때문에, 별도의 상태로 저장해야 합니다.

우리의 “Reddit headlines” 앱의 상태는 이런 모양입니다:

```js
{
  selectedReddit: 'frontend',
  postsByReddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [{
        id: 42,
        title: 'Confusion about Flux and Relay'
      }, {
        id: 500,
        title: 'Creating a Simple Application Using React JS and Flux Architecture'
      }]
    }
  }
}
```

몇가지 중요한 점이 있습니다:

* 우리는 각각의 subreddit에 대한 정보를 따로 캐시할 수 있도록 별도로 저장합니다. 사용자가 이들 사이를 왔다갔다하면 화면은 즉시 업데이트되고, 우리가 원할때만 정보를 다시 받아올겁니다. 모든 항목이 메모리에 있다고 걱정할 필요는 없습니다: 우리가 수만개의 항목을 다루는 것도 아니고, 사용자는 거의 탭을 닫지 않을 것이므로 청소는 필요 없을겁니다.

* 여러분은 모든 목록에 대해서 스피너를 보여주기 위한 `isFetching`과 데이터가 낡았을 때 켜고 끄기 위한 `didInvalidate`와 마지막으로 가져온 시점인 `lastUpdated`와 항목들인 `items`를 저장하기를 원할겁니다. 실제 앱에서는 페이지 상태를 저장히기 위한 `fetchedPageCount`나 `nextPageUrl` 같은 상태도 저장할 수 있습니다.

>##### 중첩된 개체에 관하여

>이 예시에서 우리는 받은 항목들을 페이지 정보와 함께 저장합니다. 하지만 이런 접근방식은 여러분이 서로를 참고하는 중첩된 개체를 가질 때나 사용자가 항목들을 편집하게 하려고 할 때엔 맞지 않을겁니다. 사용자가 받아온 포스트를 수정하려고 하는데 이 포스트가 상태 트리의 여러 군데에 중복되어있다고 생각해보세요. 구현하기 정말 고통스러울겁니다.

>여러분이 중첩된 개체를 가지고 있거나 사용자들이 개체를 편집할 수 있게 하고 싶다면 이들을 데이터베이스에 넣듯이 상태에 분리해서 보관해야 합니다. 페이지 정보에는 이들의 ID만을 참조하게 하면 됩니다. 이를 통해 개체들을 항상 최신으로 유지할 수 있습니다. [real world example](../introduction/Examples.html#real-world)에서는 [normalizr](https://github.com/gaearon/normalizr)를 통해 중첩된 API 응답을 정규화하는 방법을 포함하여 이런 접근법을 보여줍니다. 이 접근에 따르면 여러분의 상태는 이렇게 생겼을겁니다:

>```js
> {
>   selectedReddit: 'frontend',
>   entities: {
>     users: {
>       2: {
>         id: 2,
>         name: 'Andrew'
>       }
>     },
>     posts: {
>       42: {
>         id: 42,
>         title: 'Confusion about Flux and Relay',
>         author: 2
>       },
>       100: {
>         id: 100,
>         title: 'Creating a Simple Application Using React JS and Flux Architecture',
>         author: 2
>       }
>     }
>   },
>   postsByReddit: {
>     frontend: {
>       isFetching: true,
>       didInvalidate: false,
>       items: []
>     },
>     reactjs: {
>       isFetching: false,
>       didInvalidate: false,
>       lastUpdated: 1439478405547,
>       items: [42, 100]
>     }
>   }
> }
>```

>이 가이드에서 우리는 개체들을 정규화하지는 않았습니다만 더 동적인 애플리케이션에서는 고려해볼만할겁니다.

## 액션 다루기

네트워크 요청에 따른 액션 보내기를 자세히 알아보기 전에, 위에서 정의한 액션을 위해 리듀서를 작성합시다.

>##### 리듀서 결합에 대하여

> 여러분이 [`combineReducers()`](../api/combineReducers.md)를 통한 리듀서 결합을 이해하고 있다고 가정하겠습니다. [기초 가이드](../basics/README.md)의 [리듀서 쪼개기](../basics/Reducers.md#리듀서-쪼개기)에서 설명했었죠. 만약 잘 모르겠다면 [먼저 읽고 오세요](../basics/Reducers.md#리듀서-쪼개기).

#### `reducers.js`

```js
import { combineReducers } from 'redux';
import {
  SELECT_REDDIT, INVALIDATE_REDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions';

function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
  case SELECT_REDDIT:
    return action.reddit;
  default:
    return state;
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
  case INVALIDATE_REDDIT:
    return Object.assign({}, state, {
      didInvalidate: true
    });
  case REQUEST_POSTS:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    });
  case RECEIVE_POSTS:
    return Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      items: action.posts,
      lastUpdated: action.receivedAt
    });
  default:
    return state;
  }
}

function postsByReddit(state = { }, action) {
  switch (action.type) {
  case INVALIDATE_REDDIT:
  case RECEIVE_POSTS:
  case REQUEST_POSTS:
    return Object.assign({}, state, {
      [action.reddit]: posts(state[action.reddit], action)
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
});

export default rootReducer;
```

이 코드에는 두 가지 흥미로운 부분이 있습니다:

* ES6의 연산을 사용한 프로퍼티 문법을 사용했기 때문에 `state[action.reddit]`를 `Object.assign()`을 통해 간단명료하게 수정할 수 있었습니다: 

  ```js
    return Object.assign({}, state, {
      [action.reddit]: posts(state[action.reddit], action)
    });
    ```
  위의 코드는 아래와 동일합니다:

  ```js
    let nextState = {};
    nextState[action.reddit] = posts(state[action.reddit], action);
    return Object.assign({}, state, nextState);
  ```

* 우리는 상태에서 특정 포스트 목록을 관리하는 `posts(state, action)`를 분리했습니다. 이건 그냥 [리듀서 결합](../basics/Reducers.md#리듀서-쪼개기)입니다! 리듀서를 어떻게 쪼갤지는 우리가 정하기 나름이고, 이 경우엔 객체 안의 항목들을 수정하는 일을 `posts` 리듀서에 맡겼습니다. [real world example](../introduction/Examples.html#real-world)에서는 더 나아가서 매개변수화된 페이지 리듀서를 위한 리듀서 팩토리를 어떻게 만드는지 보여줍니다.

리듀서는 단지 함수일 뿐이라는걸 기억하세요. 여러분은 함수형 결합이나 고차함수등을 편하신대로 사용할 수 있습니다.

## 비동기 액션 생산자

마지막으로, 우리가 [앞에서 선언한](#동기-액션-생산자) 동기화된 액션을 어떻게 네트워크 요청과 함께 사용할 수 있을까요? 물론 직접 하면 됩니다:

```js
import fetch from 'isomorphic-fetch';
import { createStore } from 'redux';
import { selectReddit, requestPosts, receivePosts } from './actions';
import rootReducer from './reducers';

const reddit = 'reactjs';
const store = createStore(rootReducer);

store.dispatch(selectReddit(reddit));

store.dispatch(requestPosts('reactjs'));
fetch(`http://www.reddit.com/r/${reddit}.json`)
  .then(response => response.json())
  .then(json =>
    store.dispatch(receivePosts(reddit, json))
  )
  .then(() => {
    console.log(store.getState());
  });
```

>##### `fetch`에 대하여

>이 예시에서는 [`fetch` API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API)를 사용했습니다. 일반적인 경우에 `XMLHttpRequest`를 대신해서 네트워크 요청을 만들어주는 새로운 API입니다. 대부분의 브라우저는 아직 이를 지원하지 않기 때문에 [`isomorphic-fetch`](https://github.com/matthew-andrews/isomorphic-fetch)를 사용하는 것을 권장합니다:

>```js
// `fetch`를 사용하는 모든 파일마다 
>import fetch from 'isomorphic-fetch';
>```

>내부적으로 이 라이브러리는 클라이언트에서 [`whatwg-fetch` polyfill](https://github.com/github/fetch)을, 서버에서 [`node-fetch`](https://github.com/bitinn/node-fetch)를 사용하므로 여러분이 앱을 [유니버셜](https://medium.com/@mjackson/universal-javascript-4761051b7ae9)로 바꾸더라도 API 호출을 바꿀 필요가 없습니다.

>`fetch` 폴리필들은 [약속](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 폴리필이 이미 적용되어 있다고 가정한다는 점을 명심하세요. 약속 폴리필이 적용되어 있도록 하는 가장 확실한 방법은 Babel의 ES6 폴리필을 모든 엔트리 포인트에서 사용하는겁니다:

>```js
>// 앱의 다른 코드들 앞에 한번 넣어줍니다
>import 'babel-core/polyfill';
>```

우리는 API를 호출하고 컴포넌트에서 적절한 액션을 보낼수도 있습니다. 하지만 이건 금방 지루해지죠. 보통은 요청을 수행하기 전에 상태를 확인하고, 데이터가 캐시되어 있으면 가져오지 않기로 결정하는 일반적인 로직을 원할겁니다. 

액션은 흐름 제어를 표현하지 않습니다. 흐름 제어를 위한 최고의 도구는 함수죠. 함수는 `if`문을 가질 수도 있고 일찍 `return` 할 수도 있습니다. 함수가 `dispatch` 메서드에 접근할 수 있다면 몇번이든 호출할 수 있고, 어쩌면 비동기적으로도 가능할겁니다. 감이 오시나요?

[이전 섹션](Middleware.md)에서 우리는 Redux의 가장 일반적인 확장 방법인 미들웨어를 알아봤습니다. 미들웨어는 여러분이 최초의 `dispatch()` 호출에서부터 액션이 리듀서에 이르는 순간까지 임의의 로직을 끼워넣을 수 있게 해주죠.

우리가 **액션 생산자로부터 함수를 반환하는** 미들웨어를 짠다면 어떨까요? 함수를 반환하는 함수는 예전부터 "썽크"라고 불렸으니, 이를 "썽크 미들웨어"라고 부르겠습니다. 아마 이렇게 생겼을겁니다:

```js
const thunkMiddleware = store => next => action => {
  if (typeof action !== 'function') {
    // Normal action, pass it on
    return next(action);
  }

  // Woah, somebody tried to dispatch a function!
  // We will invoke it immediately and give `store.dispatch`
  // to it. This will invert control and let it dispatch
  // many times. We will also pass `getState` to it so it
  // can peek into the current state and make decisions based on it.

  const result = action(store.dispatch, store.getState);

  // Whatever the user returned from that function, we'll return too,
  // so it becomes `dispatch()` returns value. This is convenient
  // in case user wants to return a Promise to wait for.

  return result;
};
```

이게 이해가 안 되신다면, [미들웨어 소개](Middleware.md)로 돌아가세요. 이를 통해 우리는 예시를 재작성해서 액션 생산자일 뿐인 `fetchPosts()`가 함수를 반환하게 해줄 수 있습니다:

#### `actions.js`

```js
import fetch from 'isomorphic-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

export function fetchPosts(reddit) {
  // thunk middleware knows how to handle functions
  return function (dispatch) {
    dispatch(requestPosts(reddit));

    // Return a promise to wait for
    // (this is not required by thunk middleware, but it is convenient for us)
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json =>
        // We can dispatch many times!
        dispatch(receivePosts(reddit, json))
      );
  };
}
```

#### `index.js`

```js
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { selectReddit, fetchPosts } from './actions';
import rootReducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

store.dispatch(selectReddit('reactjs'));
store.dispatch(fetchPosts('reactjs')).then(() =>
  console.log(store.getState());
);
```

썽크의 좋은 점은 각각의 결과를 보내준다는 겁니다:

#### `actions.js`

```js
import fetch from 'isomorphic-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit));
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)));
  };
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit];
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchPosts(reddit));
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  };
}
```

이는 우리가 더 세련된 비동기 흐름 제어 코드를 짤 수 있게 하면서도, 데이터를 처리하는 코드는 거의 비슷하게 남겨둘 수 있게 해줍니다:

#### `index.js`

```js
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
  console.log(store.getState());
);
```

>##### 서버 랜더링에 대하여

>비동기 액션 생산자는 서버 랜더링에서 특히 편리합니다. 여러분은 스토어를 만들고, 다른 비동기 액션 생성자들을 보내주는 비동기 액션 생성자 하나를 보내고, 여기서 반환되는 약속이 완료되었을 때에만 그려주면 됩니다. 그러면 여러분의 스토어는 랜더링에 필요한 상태로 이미 채워져있을겁니다.

[썽크 미들웨어](https://github.com/gaearon/redux-thunk)만이 Redux에서 비동기 액션을 통제하는 방법은 아닙니다. 함수 대신 약속을 보내기 위해 [redux-promise](https://github.com/acdlite/redux-promise)나 [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)를 사용할 수도 있습니다. [redux-rx](https://github.com/acdlite/redux-rx)를 통해 옵서버(Observables)를 보낼 수도 있습니다. 아니면 [real world example](../introduction/Examples.html#real-world)에서처럼 API 호출을 위한 미들웨어를 직접 작성할수도 있습니다. 미들웨어를 쓰건 쓰지 않건, 몇가지 선택지들을 시도해보고 마음에 드는 규칙을 골라서 사용하는것은 여러분에게 달렸습니다.

## UI에 연결하기

비동기 액션을 보내는것은 동기 액션을 보내는 것과 차이가 없으므로 자세한 이야기는 하지 않겠습니다. React 컴포넌트에서 Redux를 사용하는 것에 대한 소개는 [React와 함께 사용하기](../basics/UsageWithReact.md)를 보세요. 이 예시에서 사용했던 소스코드의 완성본은 [예시: Reddit API](ExampleRedditAPI.md)를 보면 됩니다.

## 다음 단계

[비동기 흐름](AsyncFlow.md)을 읽고 비동기 액션이 Redux에 어떻게 적용되는지 복습해봅시다.
