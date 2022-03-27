---
id: refactoring-reducer-example
title: 리듀서 리팩토링하기 예제
description: '리듀서 구조 잡기 > 리듀서 리팩토링하기: Examples of ways to refactor reducer logic'
---

&nbsp;

# 기능적 분해와 리듀서 구성을 통해 리듀서 리팩토링하기

서브리듀서 함수가 어떻게 생겼는지, 어떻게 서로 같이 동작시키는지에 대한 여러유형의 예제를 보는 것이 도움이 될 수 있습니다. 거대한 하나의 리듀서 함수가 여러 개의 작은 함수로 나뉠 수 있음을 보도록 합시다.

> **주의**: 이 예제는 리팩토링에 대해 설명하기 위해 일부러 완벽히 간결한 코드가 아닌, 장황한 코드로 작성되었습니다.

### 초기 리듀서

아래와 같은 초기 리듀서에 대해 봅시다.

```js
const initialState = {
  visibilityFilter: 'SHOW_ALL',
  todos: []
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER': {
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    }
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat({
          id: action.id,
          text: action.text,
          completed: false
        })
      })
    }
    case 'TOGGLE_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.map(todo => {
          if (todo.id !== action.id) {
            return todo
          }

          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        })
      })
    }
    case 'EDIT_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.map(todo => {
          if (todo.id !== action.id) {
            return todo
          }

          return Object.assign({}, todo, {
            text: action.text
          })
        })
      })
    }
    default:
      return state
  }
}
```

이 함수는 짧아 보여도 이미 충분히 복잡합니다. 우리는 생길 수 있는 두 가지 종류의 문제(필터링 vs todos의 목록을 관리)를 다룹니다. 중첩은 로직을 읽기 어렵게 만들고, 무슨 일이 일어나는지 명확히 알 수 없게 합니다.

#### 유틸리티 함수 추출하기

업데이트된 필드를 포함된 새로운 객체를 반환하는 함수를 만드는 것이 좋은 첫걸음이 될 수 있습니다. 배열의 특정 항목을 업데이트하다보면 추출 가능한 반복된 패턴이 나타냅니다.

```js
function updateObject(oldObject, newValues) {
  // 새로운 객체를 첫번째 매개변수로 전달한다는 아이디어를 캡슐화
  // 데이터를 변경하는 대신에 데이터를 확실히 복사하기 위해 Object.assign을 사용합니다.
  return Object.assign({}, oldObject, newValues)
}

function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      // 한가지 항목만 업데이트하기 때문에 다른 항목은 유지합니다.
      return item
    }

    // 업데이트 된 항목을 만들기 위해 주어진 콜백을 사용합니다.
    const updatedItem = updateItemCallback(item)
    return updatedItem
  })

  return updatedItems
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER': {
      return updateObject(state, { visibilityFilter: action.filter })
    }
    case 'ADD_TODO': {
      const newTodos = state.todos.concat({
        id: action.id,
        text: action.text,
        completed: false
      })

      return updateObject(state, { todos: newTodos })
    }
    case 'TOGGLE_TODO': {
      const newTodos = updateItemInArray(state.todos, action.id, todo => {
        return updateObject(todo, { completed: !todo.completed })
      })

      return updateObject(state, { todos: newTodos })
    }
    case 'EDIT_TODO': {
      const newTodos = updateItemInArray(state.todos, action.id, todo => {
        return updateObject(todo, { text: action.text })
      })

      return updateObject(state, { todos: newTodos })
    }
    default:
      return state
  }
}
```

중복을 줄이고 읽기가 더 쉬워졌습니다.

#### 케이스 리듀서 추출

다음으로, 각 케이스를 자체함수로 나눌 수 있습니다.

```js
// 생략
function updateObject(oldObject, newValues) {}
function updateItemInArray(array, itemId, updateItemCallback) {}

function setVisibilityFilter(state, action) {
  return updateObject(state, { visibilityFilter: action.filter })
}

function addTodo(state, action) {
  const newTodos = state.todos.concat({
    id: action.id,
    text: action.text,
    completed: false
  })

  return updateObject(state, { todos: newTodos })
}

function toggleTodo(state, action) {
  const newTodos = updateItemInArray(state.todos, action.id, todo => {
    return updateObject(todo, { completed: !todo.completed })
  })

  return updateObject(state, { todos: newTodos })
}

function editTodo(state, action) {
  const newTodos = updateItemInArray(state.todos, action.id, todo => {
    return updateObject(todo, { text: action.text })
  })

  return updateObject(state, { todos: newTodos })
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return setVisibilityFilter(state, action)
    case 'ADD_TODO':
      return addTodo(state, action)
    case 'TOGGLE_TODO':
      return toggleTodo(state, action)
    case 'EDIT_TODO':
      return editTodo(state, action)
    default:
      return state
  }
}
```

이제 무슨 일이 일어나는지 _매우_ 명확합니다. 또한, 우리는 어떤 패턴이 나타나기 시작함을 볼 수 있습니다.

#### 데이터관리를 도메인으로 분리하기

우리의 리듀서는 여전히 애플리케이션속의 모든 다른 케이스를 알고 있습니다. 필터 로직과 todo로직이 분리되도록 항목을 분리해 봅시다.

```js
// 생략
function updateObject(oldObject, newValues) {}
function updateItemInArray(array, itemId, updateItemCallback) {}

function setVisibilityFilter(visibilityState, action) {
  // 기술적으로, 우리는 이전의 상태에 대해서도 신경쓰지 않습니다.
  return action.filter
}

function visibilityReducer(visibilityState = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return setVisibilityFilter(visibilityState, action)
    default:
      return visibilityState
  }
}

function addTodo(todosState, action) {
  const newTodos = todosState.concat({
    id: action.id,
    text: action.text,
    completed: false
  })

  return newTodos
}

function toggleTodo(todosState, action) {
  const newTodos = updateItemInArray(todosState, action.id, todo => {
    return updateObject(todo, { completed: !todo.completed })
  })

  return newTodos
}

function editTodo(todosState, action) {
  const newTodos = updateItemInArray(todosState, action.id, todo => {
    return updateObject(todo, { text: action.text })
  })

  return newTodos
}

function todosReducer(todosState = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return addTodo(todosState, action)
    case 'TOGGLE_TODO':
      return toggleTodo(todosState, action)
    case 'EDIT_TODO':
      return editTodo(todosState, action)
    default:
      return todosState
  }
}

function appReducer(state = initialState, action) {
  return {
    todos: todosReducer(state.todos, action),
    visibilityFilter: visibilityReducer(state.visibilityFilter, action)
  }
}
```

두가지 "상태조각" 리듀서가 전체 상태에 대해 자신과 관련된 부분만을 매개변수로 취하고 있기 때문에 더이상 복잡게 중첩된 상태객체를 반환하지 않아도 되고, 결과적으로 더 간단해졌습니다.

#### 보일러플레이트 줄이기

거의 다 왔습니다. 많은사람들이 switch문을 좋아하지 않기 때문에 케이스 함수를 위한 액션타입의 룩업테이블을 만드는 함수를 사용하는 것이 일반적입니다. 우리는 [보일러플레이트 줄이기](../ReducingBoilerplate.md#generating-reducers) 에서 설명한 `createReducer`를 사용할 겁니다:

```js
// 생략
function updateObject(oldObject, newValues) {}
function updateItemInArray(array, itemId, updateItemCallback) {}

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

// 생략
function setVisibilityFilter(visibilityState, action) {}

const visibilityReducer = createReducer('SHOW_ALL', {
  SET_VISIBILITY_FILTER: setVisibilityFilter
})

// 생략
function addTodo(todosState, action) {}
function toggleTodo(todosState, action) {}
function editTodo(todosState, action) {}

const todosReducer = createReducer([], {
  ADD_TODO: addTodo,
  TOGGLE_TODO: toggleTodo,
  EDIT_TODO: editTodo
})

function appReducer(state = initialState, action) {
  return {
    todos: todosReducer(state.todos, action),
    visibilityFilter: visibilityReducer(state.visibilityFilter, action)
  }
}
```

#### 슬라이스로 리듀서 결합하기

마지막에 한 것처럼, 우리는 이제 최상위 앱 리듀서에 대한 "상태의 조각"의 로직을 처리하기 위해 리덕스에서 제공하는 `combineReducers` 유틸리티를 사용할 수 있습니다. 이것이 최종결과물입니다.

```js
// 재사용 가능한 유틸리티 함수

function updateObject(oldObject, newValues) {
  // 새로운 객체를 첫번째 매개변수로 전달한다는 아이디어를 캡슐화
  // 데이터를 변경하는 대신에 데이터를 확실히 복사하기 위해 Object.assign을 사용합니다.
  return Object.assign({}, oldObject, newValues)
}

function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      // 한가지 항목만 업데이트하기 때문에 다른 항목은 유지합니다.
      return item
    }

    // 업데이트 된 항목을 만들기 위해 주어진 콜백을 사용합니다.
    const updatedItem = updateItemCallback(item)
    return updatedItem
  })

  return updatedItems
}

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

// 특정 케이스의 핸들러 ("케이스 리듀서")
function setVisibilityFilter(visibilityState, action) {
  // 기술적으로, 우리는 이전의 상태에 대해서도 신경쓰지 않습니다.
  return action.filter
}

// 전체 상태의 조각에 대한 핸들러("슬라이스 리듀서")
const visibilityReducer = createReducer('SHOW_ALL', {
  SET_VISIBILITY_FILTER: setVisibilityFilter
})

// 케이스 리듀서
function addTodo(todosState, action) {
  const newTodos = todosState.concat({
    id: action.id,
    text: action.text,
    completed: false
  })

  return newTodos
}

// 케이스 리듀서
function toggleTodo(todosState, action) {
  const newTodos = updateItemInArray(todosState, action.id, todo => {
    return updateObject(todo, { completed: !todo.completed })
  })

  return newTodos
}

// 케이스 리듀서
function editTodo(todosState, action) {
  const newTodos = updateItemInArray(todosState, action.id, todo => {
    return updateObject(todo, { text: action.text })
  })

  return newTodos
}

// 슬라이스 리듀서
const todosReducer = createReducer([], {
  ADD_TODO: addTodo,
  TOGGLE_TODO: toggleTodo,
  EDIT_TODO: editTodo
})

// "루트 리듀서"
const appReducer = combineReducers({
  visibilityFilter: visibilityReducer,
  todos: todosReducer
})
```

우리는 리듀서를 나누는 몇 가지 함수를 살펴봤습니다: `updateObject`, `createReducer`같은 헬퍼 유틸리티, `setVisibilityFilter`, `addTodo`같은 케이스에 대한 핸들러, `visibilityReducer`, `todosReducer`같은 부분상태 핸들러. 또한 `appReducer`는 "루트 리듀서"의 예입니다.

이 예제에서의 결과물은 처음보다 현저히 깁니다. 이는 유틸리티 함수를 추출했고, 명확성을 위해 분리된 명령문을 반환하는 것과 같은 방법으로 일부러 장황하게 작성했기 때문입니다. 함수를 개별적으로 보면 각각의 책임이 줄어들었고 의도가 명확해졌습니다. 또한 실제 애플리케이션에서는 아마 `reducerUtilities.js`, `visibilityReducer.js`, `todosReducer.js`, `rootReducer.js`과 같이 파일로 분리될 겁니다.
