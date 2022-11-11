---
id: core-concepts
title: Core Concepts
description: "Introduction > Core Concepts: A quick overview of Redux's key idea, reducer functions"
---

# 핵심 Concepts

여러분 앱의 state가 평범한 object 형태로 정의되어있다고 생각해보세요. 예를들어, 투두 앱의 상태는 이런식으로 만들어질것입니다:

```js
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

이 object는 setter가 없다는 것을 제외하고는 "model" 이랑 비슷합니다. 이렇게 되면 다른 부분의 코드에서는 이 state를 임의적으로 변경할 수 없고, 이는 재생산이 어렵다는 버그를 만듭니다.

state 내의 무언가를 변경하기 위해서는 action을 dispatch 해야합니다. action은 어떤 작업을 할지 설명해주는 plain한 자바스크립트 object입니다. 아래는 몇가지 예시입니다:

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

모든 변경사항을 action으로 만들어놓으면 app에서 어떤 일이 일어나고 있는지에 대해 쉽게 알 수 있습니다. 어떤 것이 변경되면, 우리는 이게 왜 변경됐는지 알 수 있습니다. Actions는 변경사항에 대한 빵부스러기(breadcrubms)라고 할 수 있습니다.

마지막으로, state와 action을 한데 묶기 위해선, 우리는 reducer라는 함수를 작성합니다. 다시 말하지만, 엄청나게 대단할 것은 없습니다. Reducer는 그저 state와 action을 arguments로 하고, 애플리케이션의 다음 단계를 리턴해주는 함수일 뿐입니다.
큰 애플리케이션을 위해 이런 함수를 작성하는 것은 어렵기 때문에, 우리는 state의 부분 부분을 관리하도록 함수를 작게 작성합니다.
It would be hard to write such a function for a big app, so we write smaller functions managing parts of the state:

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter
  } else {
    return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        action.index === index
          ? { text: todo.text, completed: !todo.completed }
          : todo
      )
    default:
      return state
  }
}
```

그리고 reducer를 하나 더 작성하여, 동일한 state keys에 대한 reducer를 두개 호출함으로써 애플리케이션의 전체 state를 관리하도록 합니다.

```js
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}
```

이것이 기본적으로 Redux의 전체 개념입니다. 아직 Redux API는 사용하지 않았습니다. API는 이 기본 패턴을 더 쉽게 사용할 수 있는 몇가지 유틸리티를 제공해주긴 하지만, action object에 따라서 state가 어떻게 변경되는지 설명하는것이 기본 개념이며, 90%의 코드는 Redux 자체나 API나 마법같은 것이 아니라 그저 plain 자바스크립트 코드일뿐 입니다.
