---
id: beyond-combinereducers
title: combineReducers 더 알아보기
description: '리듀서 구조 잡기 > combineReducers 더 알아보기: Examples of reducer logic for other use cases not handled by combineReducers'
---

&nbsp;

# `combineReducers` 더 알아보기

리덕스에 포함된 `combineReducers`는 매우 유용하지만 일반적인 경우들을 처리하기 위해 강제하는 규칙이 있습니다: 부분적인 상태를 업데이트하는 작업을 각 슬라이스리듀서에 위임함으로서 평범한 자바스크립트 객체인 상태트리를 업데이트합니다. 슬라이스 리듀서의 "정렬", 상태트리의 다른 부분을 슬라이스 리듀서의 추가적인 매개변수로 전달, Immutable.js Maps로 구성된 상태트리등과 같은 다른 케이스를 처리하진 _않습니다_. 또한 주어진 슬라이스 리듀서가 제대로 동작하는지도 확인하지 않습니다.

"다른 케이스에 대해 `combineReducers`는 어떻게 사용해야 하나요?" 라는 질문을 많이 합니다. 답은 간단히 말해: "하지마세요 - 다른 방법이 있을 겁니다". **일단 `combineReducers`에 대한 핵심적인 사용예제를 보고나면** 일회용이든 널리 재사용가능한 함수던간에 더 많은 "커스텀"리듀서로직을 사용할 수 있습니다. 여기선 이를 다루는 두가지 전형적 케이스이지만 자유롭게 접근하시길 권합니다.

## 슬라이스 리듀서를 Immutable.js 객체와 사용하기

`combineReducers`는 현재 일반적인 자바스크립트 객체로만 동작하기 때문에 최상위 상태에서 Immutable.js Map 객체를 사용하는 애플리케이션에서는 Map관리를 위해 `combineReducers`를 사용할 수 없습니다. 많은 개발자들이 Immutable.js를 사용하기 때문에 동일한 기능을 하는 [redux-immutable](https://github.com/gajus/redux-immutable)과 같은 많은 유틸리티가 있습니다. 이 패키지는 일반적인 자바스크립트 객체 대신에 Immutable Map을 사용할 수 있게하는 `combineReducers`를 자체적으로 구현했습니다.

## 슬라이스 리듀서간의 데이터 공유

마찬가지로, 특정 액션에서 `sliceReducerA`가 `sliceReducerB`의 데이터의 부분적인 상태가 필요하다던지, `sliceReducerB`가 매개변수로 전체 상태가 필요한 경우 `combineReducers`가 해당 작업을 처리하지 않습니다. 이는 다음과 같이 필요한 데이터를 알고있는 특정 함수를 추가적인 매개변수로 넘김으로서 해결할 수 있습니다:

```js
function combinedReducer(state, action) {
  switch (action.type) {
    case 'A_TYPICAL_ACTION': {
      return {
        a: sliceReducerA(state.a, action),
        b: sliceReducerB(state.b, action)
      }
    }
    case 'SOME_SPECIAL_ACTION': {
      return {
        // 추가적인 매개변수로 state.b를 넘깁니다
        a: sliceReducerA(state.a, action, state.b),
        b: sliceReducerB(state.b, action)
      }
    }
    case 'ANOTHER_SPECIAL_ACTION': {
      return {
        a: sliceReducerA(state.a, action),
        // 전체 상태를 추가적인 매개변수로 넘깁니다.
        b: sliceReducerB(state.b, action, state)
      }
    }
    default:
      return state
  }
}
```

"슬라이스 공유 업데이트" 문제에 대한 또 다른 대안은 더 많은 데이터를 액션에 넣는것입니다. 이는 다음 예에서 처럼 thunk함수 혹은 유사한 것을 사용해서 쉽게 해결할 수 있습니다.

```js
function someSpecialActionCreator() {
  return (dispatch, getState) => {
    const state = getState()
    const dataFromB = selectImportantDataFromB(state)

    dispatch({
      type: 'SOME_SPECIAL_ACTION',
      payload: {
        dataFromB
      }
    })
  }
}
```

B의 부분으로 부터 온 데이터가 이미 액션속에 있기 때문에 부모 리듀서는 `sliceReducerA`를 사용하기 위해 별 다른 일을 하지 않아도 됩니다.

세번 째 방법은 각 슬라이스 리듀서가 독립적으로 업데이트 될 수 있는 "간단한" 케이스를 처리하기 위해 `combineReducers`로부터 생성된 리듀서를 사용하는 것이지만 이또한 슬라이스간의 데이터 공유가 필요한 "특별한" 케이스를 처리할 수 있는 리듀서가 필요합니다. 그런다음 래핑 함수는 두 리듀서를 차례로 호출해서 최종결과를 생성 할 수 있습니다:

```js
const combinedReducer = combineReducers({
  a: sliceReducerA,
  b: sliceReducerB
})

function crossSliceReducer(state, action) {
  switch (action.type) {
    case 'SOME_SPECIAL_ACTION': {
      return {
        // 추가적인 매개변수로 state.b를 넘깁니다
        a: handleSpecialCaseForA(state.a, action, state.b),
        b: sliceReducerB(state.b, action)
      }
    }
    default:
      return state
  }
}

function rootReducer(state, action) {
  const intermediateState = combinedReducer(state, action)
  const finalState = crossSliceReducer(intermediateState, action)
  return finalState
}
```

결론적으로 이런 프로세스를 쉽게 만들 수 있는 [reduce-reducers](https://github.com/acdlite/reduce-reducers)라는 유틸이 있습니다. 이는 여러개의 리듀서를 `reduce()`에 전달하고 중간상태를 다음 리듀서에 전달합니다:

```js
// 위의 수동으로 만든 rootReducer와 같습니다.
const rootReducer = reduceReducers(combinedReducers, crossSliceReducer)
```

`reduceReducers`를 사용한다면 전달된 리스트에서 처음 리듀서가 초기 상태를 정의해야함을 주의하세요. 이후의 리듀서들은 이미 상태가 존재한다고 가정하고 기본값을 제공하지 않습니다.

## 추가사항

리덕스 리듀서는 _단순한_ 함수 임을 이해하는 것이 중요함을 다시한번 강조합니다. `combineReducer`가 유용하지만 이는 그저 하나의 도구일 뿐입니다. 함수는 swich문이 아니더라도 다른 조건절을 포함 할 수 있고, 다른 함수들을 래핑할 수 있으며, 다른 함수를 호출할 수도 있습니다. 당신의 슬라이스 리듀서를 상태를 리셋하는데 사용할 수도 있습니다. 또한 특정 액션에대해서만 전반적으로 사용할 수도 있습니다. 다음을 보세요:

```js
const undoableFilteredSliceA = compose(
  undoReducer,
  filterReducer('ACTION_1', 'ACTION_2'),
  sliceReducerA
)
const rootReducer = combineReducers({
  a: undoableFilteredSliceA,
  b: normalSliceReducerB
})
```

`combineReducers`는 `a`에 대해 특별히 관리할 책임이 없고 알지도 못 한다는 것에 주의하세요. 우리는 실행취소하는 법을 알기 위해 `combineReducers`를 수정할 필요가 없습니다 - 우리는 그저 우리가 필요한 조각들로 새로운 함수로 구축하기만 하면 됩니다.

또한 `combineReducers`는 리덕스에 포함된 하나의 리듀서 유틸리티지만 재사용을 위해 다양한 third-party 리듀서 유틸리티들이 나왔습니다. [ Redux Addons Catalog](https://github.com/markerikson/redux-ecosystem-links)에는 많은 third-party 라이브러리들이 나와있습니다. 나와있는 유틸리티중 당신의 문제를 해결할 수 있는 유틸리티가 없다면, 필요한 함수를 직접 만들 수 있습니다.
