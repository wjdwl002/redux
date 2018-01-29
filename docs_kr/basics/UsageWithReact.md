# React와 함께 사용하기

처음 시작할때부터 우리는 Redux가 React와는 관계가 없음을 강조했습니다. 여러분은 React, Angular, Ember, jQuery, 순수 JavaScript 중 어떤 것을 가지고도 Redux 앱을 만들 수 있습니다.

그렇긴 하지만 Redux는 액션에 반응하여 상태를 변경하기 때문에, [React](http://facebook.github.io/react/)나 [Deku](https://github.com/dekujs/deku)와 같이 UI를 상태에 대한 함수로 기술하는 프레임워크와 특히 잘 어울립니다.

우리의 간단한 할일 앱을 React로 만들어 보겠습니다.


## React Redux 설치하기

[React 바인딩](https://github.com/gaearon/react-redux)은 Redux에 기본적으로 포함되어있지는 않습니다. 여러분이 명시적으로 설치해줘야 합니다:

```
npm install --save react-redux
```

npm을 사용하지 않는 경우 unpkg로부터 최신 UMD 빌드를 가져올 수도 있습니다. ([개발 빌드](https://unpkg.com/react-redux@latest/dist/react-redux.js) 혹은 [운영 빌드](https://unpkg.com/react-redux@latest/dist/react-redux.min.js) 중에 고르세요). `<script>` 태그를 통해 UMD 빌드를 페이지에 삽입하면, `window.ReactRedux`라는 전역 변수를 내보내줍니다.

## Presentational 컴포넌트와 Container 컴포넌트

Redux용 React 바인딩은 **presentational 컴포넌트와 container 컴포넌트 components를 분리**하는 아이디어를 채택했습니다. 이런 용어에 익숙하지 않으시다면, [이 글을 먼저 읽어보시고](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 다시 이곳으로 돌아오세요. 이 개념들은 아주 중요하니, 돌아오실 때까지 기다리겠습니다!

글을 모두 읽어셨나요? 둘의 차이점을 다시 한 번 살펴봅시다:

<table>
    <thead>
        <tr>
            <th></th>
            <th scope="col" style="text-align:left">Presentational 컴포넌트</th>
            <th scope="col" style="text-align:left">Container 컴포넌트</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <th scope="row" style="text-align:right">목적</th>
          <td>어떻게 보여질 지 (마크업, 스타일)</td>
          <td>어떻게 동작할 지 (데이터 불러오기, 상태 변경하기)</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">Redux와 연관됨</th>
          <td>아니오</th>
          <td>예</th>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">데이터를 읽기 위해</th>
          <td>props에서 데이터를 읽음</td>
          <td>Redux 상태를 구독</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">데이터를 바꾸기 위해</th>
          <td>props에서 콜백을 호출</td>
          <td>Redux 액션을 보냄</td>
        </tr>
    </tbody>
</table>

우리가 작성할 대부분의 컴포넌트는 presentational 컴포넌트가 될 것입니다. 하지만 여러 개의 container 컴포넌트를 만들어서 Redux store와 연결해야 할 필요성도 있습니다. 이것이 container 컴포넌트가 컴포넌트 트리 상단에 위치해야 한다는 것을 의미하지는 않습니다. 만약 container 컴포넌트가 너무 복잡해지면 (예를 들어 presentational 컴포넌트가 엄청나게 중첩되어 있고 셀 수 없는 콜백이 내려보내지고 있다면), [FAQ](../faq/ReactRedux.md#react-multiple-components)에서 설명한 대로 다른 container 컴포넌트를 만들어서 컴포넌트 트리 중간에 도입해보세요.

엄밀히 말하면 여러분이 직접 [`store.subscribe()`](../api/Store.md#subscribe)을 사용해서 container 컴포넌트를 작성할 수도 있습니다. 하지만 이렇게 하는 것을 추천하지는 않는데, React Redux는 여러분이 직접 구현하기는 힘든 여러가지 성능 최적화를 해주기 때문입니다. 이런 이유에서, 우리는 container 컴포넌트를 직접 작성하지 않고 React Redux가 제공해주는 [`connect()`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 함수를 사용해 container 컴포넌트를 생성해줄 것입니다. 이를 어떻게 할 수 있는지 아래에서 확인해보겠습니다.

## 컴포넌트 계층을 설계하기

우리가 어떻게 [루트 상태 객체의 형태를 설계](Reducers.md)했는지 기억하시나요? 이제 그에 맞게 UI 계층을 설계하겠습니다. 이는 Redux에만 한정된 일은 아닙니다. [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)는 이 과정을 설명하는 좋은 튜토리얼입니다.

우리의 설계를 요약하면 간단합니다. 우리는 할일 목록을 보여줄겁니다. 할일을 클릭하면 완료한 것으로 표시됩니다. 사용자가 할일을 추가할 필드도 보여줘야 합니다. 푸터에는 모든 할일을 보여주거나 / 완료된 할일만 보여주거나 / 완료되지 않은 할일만 보여주는 토글을 놓겠습니다.

### Presentational 컴포넌트 설계하기

위의 내용을 바탕으로 아래의 presentational 컴포넌트들과 그 속성들을 이끌어낼 수 있습니다.

* **`AddTodo`**는 버튼이 달린 입력 필드입니다.
  - `onAddClick(text: string)`은 버튼을 누르면 불러올 콜백입니다.
* **`TodoList`**는 표시 중인 할일 목록입니다.
  - `todos: Array`는 `{ text, completed }` 형태의 할일 배열입니다.
  - `onTodoClick(index: number)`은 할일을 누르면 호출할 콜백입니다.
* **`Todo`**는 할일 하나입니다.
  - `text: string`은 보여줄 텍스트입니다.
  - `completed: boolean`은 할일을 완료된것으로 표시할지 여부입니다.
  - `onClick()`은 할일을 누르면 호출할 콜백입니다.
* **`Link`** is a link with a callback.
  - `onClick()` is a callback to invoke when the link is clicked.
* **`Footer`**는 표시할 할일 필터를 사용자가 바꿀 수 있게끔 해주는 컴포넌트입니다.
* **`App`**은 다른 모든 컴포넌트를 렌더링하는 최상단 컴포넌트입니다.

이 컴포넌트들은 모두 *외양*을 담당하지만 데이터가 *어디에서* 온 것인지, 또 *어떻게* 데이터를 변경해야 하는지는 알지 못합니다. 그저 주어진 것을 표시해줄 뿐이죠. 만약 Redux를 쓰다가 Redux 대신 다른 무언가를 쓰게 된다면, 이 모든 컴포넌트들을 그대로 유지할 수 있습니다. Redux에 대한 의존성이 없기 때문입니다.

### Container 컴포넌트 설계하기

Presentational 컴포넌트를 Redux에 연결하기 위해서는 container 컴포넌트 역시 필요합니다. 예를 들어, `TodoList` presentational 컴포넌트는 `VisibleTodoList`와 같은 container 컴포넌트를 필요로 합니다. 여기서 `VisibleTodoList`는 Redux 스토어의 변경사항을 구독하고 현재 필터를 어떻게 적용해야 할 지를 아는 컴포넌트입니다. 필터를 변경하기 위해, `FilterLink` 컴포넌트를 만들어서 `Link` 컴포넌트를 렌더링하고 여기에 클릭이 일어날 때마다 적절한 액션을 파견해 줄 것입니다:

* **`VisibleTodoList`** 컴포넌트는 현재 필터 상태에 따라 할일 목록을 필터링해서 `TodoList` 컴포넌트를 표시합니다.
* **`FilterLink`** 컴포넌트는 현재 필터 상태를 가져와서 `Link` 컴포넌트를 표시합니다.
  - `filter: string` 속성에는 이 컴포넌트가 어떤 필터를 나타내는지 저장합니다.

### 그 밖의 컴포넌트 설계하기

가끔 어떤 컴포넌트를 presentational 컴포넌트로 만들어야 할 지, container 컴포넌트로 만들어야 할 지 결정하기 어려운 경우가 있습니다. 예를 들어, 다음과 같이 폼과 기능이 밀접하게 결합되어 있는 경우입니다:

* **`AddTodo`** 컴포넌트는 “Add” 버튼이 있는 입력 필드입니다.

엄밀히 따져보자면 우리는 이것을 두 개의 컴포넌트로 쪼갤 수 있지만, 이 단계에서 그렇게까지 할 필요는 없습니다. 아주 작은 컴포넌트의 경우 외양과 논리구조가 섞어있어도 괜찮습니다. 컴포넌트가 커짐에 따라, 그것을 어떻게 쪼개야 할 지 더 명확해 질 것이므로, 일단은 이렇게 섞어놓은 채로 남겨두겠습니다.

## 컴포넌트 구현하기

이제 컴포넌트를 작성해봅시다! Presentational 컴포넌트부터 시작할 것이므로, 일단 지금은 Redux와 어떻게 엮을 것인지를 생각하지 않아도 괜찮습니다.

### Presentational Component 구현하기

이들은 모두 평범한 React 컴포넌트이므로, 여기서 자세히 뜯어보지는 않겠습니다. 우리는 지역 상태나 생애주기(lifecycle) 메소드가 필요하지 않은 경우 항상 상태를 갖지 않는 함수형 컴포넌트를 만들 것입니다. 이것이 presentational 컴포넌트는 항상 *함수여야만 한다*는 것을 뜻하지는 않습니다. 그냥 이 쪽이 정의하기 더 쉬운 것일 뿐이죠. 만약 지역 상태나 생애주기 메소드, 혹은 성능 최적화가 필요한 때가 오면 클래스로 바꿔주면 됩니다.

#### `components/Todo.js`

```js
import React from 'react'
import PropTypes from 'prop-types'

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={ {
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default Todo
```

#### `components/TodoList.js`

```js
import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map((todo, index) => (
      <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
    ))}
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TodoList
```

#### `components/Link.js`

```js
import React from 'react'
import PropTypes from 'prop-types'

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a
      href=""
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {children}
    </a>
  )
}

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Link
```

#### `components/Footer.js`

```js
import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter="SHOW_ALL">
      All
    </FilterLink>
    {', '}
    <FilterLink filter="SHOW_ACTIVE">
      Active
    </FilterLink>
    {', '}
    <FilterLink filter="SHOW_COMPLETED">
      Completed
    </FilterLink>
  </p>
)

export default Footer
```

### Container 컴포넌트 구현하기

이제 위에서 만들었던 presentational 컴포넌트를 Redux와 연결해줄 시간입니다. 이를 위해 몇 개의 container 컴포넌트를 만들 것입니다. 사실 container 컴포넌트는 그저 React 컴포넌트일 뿐입니다. 다만 [`store.subscribe()`](../api/Store.md#subscribe)를 사용해서 Redux 상태 트리를 일부분을 읽어오기도 하고, 다른 presentational 컴포넌트에 속성을 넘겨주기도 하죠. 여러분이 container 컴포넌트를 직접 작성할 수도 있지만, 그 대신 React Redux 라이브러리에 내장된 [`connect()`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 함수를 통해 container 컴포넌트를 생성하는 것을 추천합니다. `connect()`를 사용하면, 쓸데없는 렌더링을 막아주어 성능이 향상됩니다. (이로써 직접 `shouldComponentUpdate`를 직접 구현해야 하는 부담을 덜 수 있게 됩니다. 자세한 내용은 [React performance suggestion](https://facebook.github.io/react/docs/advanced-performance.html)을 참고하세요.)

`connect()`를 사용하려면, `mapStateToProps`라 불리는 특별한 함수를 정의해야 합니다. 이 함수에는 현재 Redux 스토어의 상태를 어떻게 변형할지, 그리고 어떤 속성을 통해 presentational 컴포넌트로 넘겨줄 지를 서술하면 됩니다. 예를 들어, `VisibleTodoList` 컴포넌트는 `todos`를 필터링해서 `TodoList`에 넘겨주어야 하기 때문에, `state.visibilityFilter`에 따라 `state.todos`를 필터링하는 함수를 작성하고 이 함수를 `mapStateToProps`로서 사용할 수 있습니다:

```js
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    case 'SHOW_ALL':
    default:
      return todos
  }
}

const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```

상태를 읽어오는 일 외에, container 컴포넌트는 스토어에 액션을 보낼 수 있습니다. 위와 비슷한 방식으로 `mapDispatchToProps()` 함수를 정의하면 되는데, 이 함수는 [`dispatch()`](../api/Store.md#dispatch) 메소드를 인자로 받습니다. 이 함수가 콜백으로 이루어진 속성들을 반환하도록 만들어주면, presentational 컴포넌트에 이 속성들이 주입됩니다. 예를 들어, `VisibleTodoList`가 `onTodoClick` 속성을 `TodoList`에 주입하면서 `onTodoClick` 함수가 `TOGGLE_TODO` 액션을 파견하게끔 만들어주고 싶다면 아래와 같이 하면 됩니다:

```js
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}
```

마지막으로, `connect`를 호출하면서 앞의 두 함수들을 인자로 넘겨줌으로써 `VisibleTodoList`를 만들어낼 수 있습니다.

```js
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

위에서 보신 것은 React Redux API의 기본적인 부분으로, 몇몇 편의 기능과 설정 사항이 더 있으므로 [공식 문서](https://github.com/reactjs/react-redux)를 읽어보시기 바랍니다. 만약 `mapStateToProps`가 새 객체를 너무 자주 생성하는 것이 걱정되신다면, [reselect](https://github.com/reactjs/reselect)를 이용해 [파생된 데이터 계산하기](../recipes/ComputingDerivedData.md)를 알아보세요.

나머지 container 컴포넌트들이 아래에 정의되어 있습니다:

#### `containers/FilterLink.js`

```js
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink
```

#### `containers/VisibleTodoList.js`

```js
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

## 그 밖의 컴포넌트 구현하기

[위에서 언급했던 것처럼](#designing-other-components), `AddTodo` 컴포넌트에 대한 외양과 논리구조를 섞어놓을 것입니다.

```js
import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(addTodo(input.value))
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
AddTodo = connect()(AddTodo)

export default AddTodo
```

만약 `ref` 속성에 친숙하지 않으시다면, [공식 문서](https://facebook.github.io/react/docs/refs-and-the-dom.html)를 통해 `ref`의 올바른 사용법을 익혀보세요.

### 여러 Container를 하나의 컴포넌트 안에 묶기
#### `components/App.js`

```js
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App
```

## 스토어 넘겨주기

모든 container 컴포넌트는 Redux 스토어에 접근하거나 스토어를 구독할 수 있어야 합니다. 이렇게 만들 수 있는 한 가지 방법은 모든 container 컴포넌트의 속성에다가 스토어를 넘겨주는 것입니다. 하지만 이 방법은 너무 진이 빠지는 방법이고, 컴포넌트 트리 하부에 있는 container 컴포넌트에 스토어를 넘겨주기 위해 presentational 컴포넌트에까지 스토어를 넘겨주어야 합니다.

저희가 권장하는 방법은 React Redux가 제공하는 특별한 컴포넌트인 [`<Provider>`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)를 사용하는 것입니다. 이 컴포넌트는 명시적으로 스토어를 넘겨주지 않더라도 [마법처럼](https://facebook.github.io/react/docs/context.html) 모든 container 컴포넌트에서 스토어를 사용할 수 있도록 해줍니다. 이 컴포넌트는 최상단 컴포넌트를 렌더링할 때 한 번만 사용해주면 됩니다.

#### `index.js`

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## 다음 단계

배운 지식을 더 잘 소화하려면 [이 튜토리얼의 전체 소스코드](ExampleTodoList.md)를 읽어보세요. 그런 다음 [심화 튜토리얼](../advanced/README.md)에서 네트워크 요청과 라우팅을 어떻게 처리하는지 배워봅시다!
