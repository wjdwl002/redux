# 3가지 원칙

Redux의 근본적인 원칙들은 다음과 같습니다.

### 진실은 하나의 소스로부터

**애플리케이션의 모든 [상태](../Glossary.md#state)는 하나의 [스토어](../Glossary.md#store) 안에 하나의 객체 트리 구조로 저장됩니다.**

이를 통해 범용적인 애플리케이션(universal application, 하나의 코드 베이스로 다양한 환경에서 실행 가능한 코드)을 만들기 쉽게 만들 수 있습니다. 서버로부터 가져온 상태는 시리얼라이즈되거나(serialized) 수화되어(hydrated) 전달되며 클라이언트에서 추가적인 코딩 없이도 사용할 수 있습니다. 또한 하나의 상태 트리만을 가지고 있기 때문에 디버깅에도 용이할 것입니다. 빠른 개발 사이클을 위해 개발중인 애플리케이션의 상태를 저장해놓을 수도 있습니다. 하나의 상태 트리만을 가지고 있기 때문에 이전에는 굉장히 구현하기 어려웠던 기능인 실행취소/다시실행(undo/redo)을 손쉽게 구현할 수 있습니다.

```js
console.log(store.getState());

{
  visibilityFilter: 'SHOW_ALL',
  todos: [{
    text: 'Consider using Redux',
    completed: true,
  }, {
    text: 'Keep all state in a single tree',
    completed: false
  }]
}
```

### 상태는 읽기 전용이다

**상태를 변화시키는 유일한 방법은 무슨 일이 벌어지는 지를 묘사하는 [액션](../Glossary.md#action) 객체를 전달하는 방법뿐입니다.**

이를 통해서 뷰나 네트워크 콜백에서 결코 상태를 직접 바꾸지 못 한다는 것을 보장할 수 있습니다. 모든 상태 변화는 중앙에서 관리되며 모든 액션은 엄격한 순서에 의해 하나하나 실행되기 때문에, 신경써서 관리해야할 미묘한 경쟁 상태는 없습니다. 액션은 그저 평범한 객체입니다. 따라서 기록을 남길 수 있고, 시리얼라이즈할 수 있으며, 저장할 수 있고, 이후에 테스트나 디버깅을 위해서 재현하는 것도 가능합니다.

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
});

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
});
```

### 변화는 순수 함수로 작성되어야한다

**액션에 의해 상태 트리가 어떻게 변화하는 지를 지정하기 위해 프로그래머는 순수 [리듀서](../Glossary.md#reducer)를 작성해야합니다.**

리듀서는 그저 이전 상태와 액션을 받아 다음 상태를 반환하는 순수 함수입니다. 이전 상태를 변경하는 대신 새로운 상태 객체를 생성해서 반환해야한다는 사실을 기억해야 합니다. 처음에는 하나의 리듀서만으로 충분하지만, 애플리케이션이 성장해나가면 상태 트리의 특정한 부분들을 조작하는 더 작은 리듀서들로 나누는 것도 가능합니다. 리듀서는 그저 함수이기 때문에 호출되는 순서를 정하거나 추가적인 데이터를 넘길 수도 있습니다. 심지어 페이지네이션과 같이 일반적인 재사용 가능한 리듀서를 작성하는 것도 가능합니다.

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
  case 'SET_VISIBILITY_FILTER':
    return action.filter;
  default:
    return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
  case 'ADD_TODO':
    return [...state, {
      text: action.text,
      completed: false
    }];
  case 'COMPLETE_TODO':
    return [
      ...state.slice(0, action.index),
      Object.assign({}, state[action.index], {
        completed: true
      }),
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
}

import { combineReducers, createStore } from 'redux';
let reducer = combineReducers({ visibilityFilter, todos });
let store = createStore(reducer);
```

이게 전부입니다. Redux가 무엇인지에 대해서 전부 배웠습니다.
