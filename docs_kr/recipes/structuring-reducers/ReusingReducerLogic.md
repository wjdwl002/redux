---
id: reusing-reducer-logic
title: 리듀서 로직 재사용하기
description: '리듀서 구조 잡기 > 리듀서 로직 재사용하기: Patterns for creating reusable reducers'
hide_title: true
---

# 리듀서 로직 재사용하기

애플리케이션의 크기가 커지면 리듀서 로직의 공통된 패턴이 나타날 겁니다. 어쩌면 당신의 리듀서로직이 다른 종류만 다른 데이터에 대해 같은 일을 함을 발견하고 중복을 줄이고자 각 데이터 타입에 대해 같은 로직을 재사용하고 싶을 수 있습니다. 또는 특정 데이터에 대해 여러 "인스턴스"를 스토어에서 처리하고 싶을 수도 있습니다. 하지만 전역 리덕스 구조는 몇 가지 트레이드오프가 있습니다: 이는 애플리케이션의 전체적인 상태를 쉽게 추적할 수 있게 해줍니다. 하지만 특히 `combineReducers`를 사용하는 경우, 업데이트가 필요한 상태 조각을 "지정하는 작업"을 어렵게 합니다.

예제에서, 우리는 애플리케이션에서 A,B,C라는 여러 카운터를 추적하고 싶어합니다. 우리는 초기 `counter`를 정의하고 상태를 설정하기 위해 `combineReducers`를 사용합니다.

```js
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

const rootReducer = combineReducers({
  counterA: counter,
  counterB: counter,
  counterC: counter
})
```

안타깝게도 이 설정엔 문제가 있습니다.`combineReducers`는 같은 액션에 대해 각 슬라이스 리듀서를 호출합니다. `{type : 'INCREMENT'}`가 디스패치되면 하나가 아닌 세 카운터 값을 증가시킬 겁니다. 우리가 원하는 카운터값만을 증가시키기 위해 `counter`로직을 래핑하는 방법이 필요합니다.

## 고차 리듀서로 동작 커스터마이징하기

[리듀서 로직 분리하기](SplittingReducerLogic.md)에서 정의된 것처럼, 고차 리듀서는 리듀서 함수를 인자로 가지는 함수이며 결과로 새로운 리듀서함수를 리턴합니다. 이는 "리듀서 공장"으로 볼 수 있습니다. `combineReducers`는 고차 리듀서의 한 예제입니다. 이 패턴을 사용해서 특정 액션에 반응하는 자신만의 리듀서 함수의 특수 버전을 정의할 수 있습니다.

```js
function createCounterWithNamedType(counterName = '') {
  return function counter(state = 0, action) {
    switch (action.type) {
      case `INCREMENT_${counterName}`:
        return state + 1
      case `DECREMENT_${counterName}`:
        return state - 1
      default:
        return state
    }
  }
}

function createCounterWithNameData(counterName = '') {
  return function counter(state = 0, action) {
    const { name } = action
    if (name !== counterName) return state

    switch (action.type) {
      case `INCREMENT`:
        return state + 1
      case `DECREMENT`:
        return state - 1
      default:
        return state
    }
  }
}
```

우리는 이제 특수한 카운터 리듀서를 생성하기 위해 이 중 하나를 사용할 수 있어야 하며 우리가 필요한 상태의 부분에만 영향을 줄 수 있는 액션을 디스패치 할 수 있어야 합니다.

```js
const rootReducer = combineReducers({
  counterA: createCounterWithNamedType('A'),
  counterB: createCounterWithNamedType('B'),
  counterC: createCounterWithNamedType('C')
})

store.dispatch({ type: 'INCREMENT_B' })
console.log(store.getState())
// {counterA : 0, counterB : 1, counterC : 0}
```

또한 접근법을 약간 바꿔서 주어진 리듀서 혹은 이름 또는 구분자를 모두 받아들이는 고차 리듀서함수를 만듭니다.

```js
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

function createNamedWrapperReducer(reducerFunction, reducerName) {
  return (state, action) => {
    const { name } = action
    const isInitializationCall = state === undefined
    if (name !== reducerName && !isInitializationCall) return state

    return reducerFunction(state, action)
  }
}

const rootReducer = combineReducers({
  counterA: createNamedWrapperReducer(counter, 'A'),
  counterB: createNamedWrapperReducer(counter, 'B'),
  counterC: createNamedWrapperReducer(counter, 'C')
})
```

일반 필터링이 적용된 고차 리듀서를 만들 수도 있습니다.

```js
function createFilteredReducer(reducerFunction, reducerPredicate) {
    return (state, action) => {
        const isInitializationCall = state === undefined;
        const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
        return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
    }
}

const rootReducer = combineReducers({
    // 접미사 체크
    counterA : createFilteredReducer(counter, action => action.type.endsWith('_A')),
    // 액션의 추가데이터 체크
    counterB : createFilteredReducer(counter, action => action.name === 'B'),
    // 모든 'INCREMENT'액션에 반응하지만 'DECREMENT'는 아닙니다.
    counterC : createFilteredReducer(counter, action => action.type === 'INCREMENT')
};
```

이 기본패턴은 UI에서 스마트하게 연결된 인스턴스를 여러 개 만들거나, 페이지네이션이나 정렬 같은 기능에 일반적인 로직을 재사용할 수 있습니다.

## Collection / Item Reducer Pattern

This pattern allows you to have multiple states and use a common reducer to update each state based on an additional parameter inside the action object.

```js
function counterReducer(state, action) {
    switch(action.type) {
        case "INCREMENT" : return state + 1;
        case "DECREMENT" : return state - 1;
    }
}

function countersArrayReducer(state, action) {
    switch(action.type) {
        case "INCREMENT":
        case "DECREMENT":
            return state.map( (counter, index) => {
                if(index !== action.index) return counter;
                return counterReducer(counter, action);
            });
        default:
            return state;
    }
}

function countersMapReducer(state, action) {
    switch(action.type) {
        case "INCREMENT":
        case "DECREMENT":
            return {
                ...state,
                state[action.name] : counterReducer(state[action.name], action)
            };
        default:
            return state;
    }
}
```
