---
id: basic-reducer-structure
title: 기본 리듀서 구조
description: '리듀서 구조 잡기 > 기본 리듀서 구조: Overview of how reducer functions work with Redux state'
hide_title: true
---

&nbsp;

# 기본 리듀서 구조와 상태의 형태

## 기본 리듀서 구조

우선 우리 애플리케이션의 리듀서는 사실 `createStore`로 전달한 첫 번째 매개변수인 **하나의 함수**라는 것을 이해하는 것이 중요합니다. 이 하나의 리듀서는 궁극적으로 몇 가지 일을 해야합니다.

- 리듀서가 처음 호출될 때, `state`값은 `undefined`가 됩니다. 초깃값을 지정해서 액션이 발생하기 전에 이 케이스에 대해 처리해줘야 합니다.
- 이전의 상태와 전달된 액션을 통해 어떤 일을 해야 하는지를 결정해야 합니다.
- 실제로 변경이 일어나면 업데이트된 데이터로 만들어져야 할 새로운 객체와 배열을 만들어 반환합니다.
- 변경이 필요하지 않다면 기존 상태를 그대로 반환합니다.

가장 쉬운 접근은 아래와 같이 모든 리듀서 로직을 한가지 함수에 전부 넣는 것입니다.

```js
function counter(state, action) {
  if (typeof state === 'undefined') {
    state = 0 // 상태가 undefined이면 기본값으로 초기화합니다.
  }

  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT') {
    return state - 1
  } else {
    return state // 정해놓지 않은 액션인 경우
  }
}
```

이 간단한 함수가 모든 필요사항을 충족함에 주목하세요. (액션이) 존재하지 않으면 기본값을 반환하고, 저장소를 초기화합니다; 액션의 종류에 따라 어떤 업데이트가 필요한지를 결정하고 새로운 값을 반환합니다; 또한 아무 일도 안 해도 된다면 이전의 상태를 반환합니다.

이 리듀서를 만들수 있는 간단한 방법이 있습니다. 첫째,`if`/`else` 는 빠르게 무거워지기 때문에 대신 `switch`문을 사용합니다. 둘째, "기존 데이터가 없는" 경우를 위해 ES6의 default parameter 문법을 사용합니다.

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
```

이것이 전형적인 리덕스 리듀서함수의 기본 구조입니다.

## 기본적인 상태의 형태

리덕스는 관리해야 할 데이터라는 측면에서 애플리케이션을 생각할 것을 권장합니다. 특정 시점의 데이터는 애플리케이션의 "_상태_"라고 하고 이 상태의 구조와 구성은 보통 "_형태_" 라고 합니다. 상태의 형태는 리듀서의 로직을 구성하는 데 중요한 역할을 합니다.

리덕스의 상태는 보통 상태 트리의 제일 꼭대기에 일반적인 자바스크립트 객체를 가지고 있습니다. (분명 숫자나 배열 혹은 다른 데이터구조를 가지는 것도 가능하지만 대부분의 라이브러리에서는 맨 꼭대기의 값이 객체라고 가정합니다) 꼭대기 객체의 데이터를 구성하는 일반적인 방법은 최상위의 키를 연관된 "도메인"이나 "조각"을 나타내는 서브 트리로 나누는 것입니다. 예를 들어 기본 Todo 앱의 상태는 다음과 같을 것입니다:

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

이 예제에서 `todos`와 `visibilityFilter`는 모두 상태의 최상위 키이며 각각 특정 개념에 대한 상태의 조각입니다.

보통 애플리케이션에서는 여러 데이터종류를 가지며, 크게 세가지 범주로 나뉩니다.

- _Domain data_: 애플리케이션으로 보여주거나 사용, 수정할 데이터 (서버에서 가져온 모든 Todos와 같은 것들)
- _App state_: 애플리케이션의 동작을 위한 특정 데이터 ("현재 Todo #5가 선택됨." 혹은 "Todos를 가져오는 요청이 있습니다."와 같은 것들)
- _UI_state_: 현재 UI가 어떻게 보일 것인가에 대한 데이터 ("EditTodo Modal 상자가 현재 열려있음"과 같은 것들)

저장소는 애플리케이션의 핵심이기 때문에 반드시 **상태는 UI 컴포넌트가 아닌 도메인데이터와 앱의 상태에 따라** 구성해야 합니다. 예를 들어 `state.leftPane.todoList.todos`의 형태는 좋지 못합니다. "todos"는 그저 UI의 한 부분이 아니라 전체 애플리케이션의 중심이기 때문입니다.

**드물게** UI트리와 상태 트리가 일대일대응인 경우가 있을 수 있습니다. 이 경우는 다양한 UI 데이터의 양상을 리덕스 저장소에서 추적하는 경우 일겁니다. 하지만 그때 역시 UI데이터와 도메인데이터의 모양은 다를겁니다.

전형적인 앱 상태의 형태는 대충 다음과 같을겁니다.

```js
{
  domainData1 : {},
  domainData2 : {},
  appState1 : {},
  appState2 : {},
  ui : {
    uiState1 : {},
    uiState2 : {},
  }
}
```
