# React Router와 함께 사용하기

Redux 앱에서 라우팅을 하기 원한다면 [React Router](https://github.com/reactjs/react-router)와 함께 사용할 수 있습니다. Redux가 데이터의 진실의 원천이 될 것이고 React Router가 URL의 진실의 원천이 될 것입니다. 시간여행이나 URL을 바꾸는 액션들을 되감을 필요가 없다면 대부분의 경우엔 이들을 따로 두어도 **괜찮습니다**.

## React Router 설치하기
`react-router`는 npm에서 사용 가능합니다. 이 가이드는 `react-router@^2.7.0`을 사용한다고 가정합니다.

`npm install --save react-router`

## Fallback URL 설정하기

React Router와 통합하기 전에, 개발 서버를 설정합시다. 물론 개발 서버가 React Router 설정 내의 라우트 정의를 아는 것은 아닙니다. 예를 들어, 여러분이 `/todos`로 접근한다음 새로고침하면, 개발서버는 단일 페이지 앱의 `index.html`을 제공하도록 설정되어 있어야 합니다. 아래에서 유명 개발 서버들에서 이를 어떻게 활성화하는지 알아보겠습니다.

>### Create React App에 대해

> Create React App을 사용한다면, fallback URL은 자동으로 설정되기 때문에 따로 해줄 필요가 없습니다.

### Express 설정하기
`index.html`을 Express에서 제공한다면:
``` js
  app.get('/*', (req,res) => {
    res.sendfile(path.join(__dirname, 'index.html'))
  })
```

### WebpackDevServer 설정하기
`index.html`을 WebpackDevServer에서 제공한다면:
webpack.config.dev.js에 추가하면 됩니다:
```js
  devServer: {
    historyApiFallback: true,
  }
```

## React Router와 Redux 앱 연결하기

이 장에서, 우리는 [Todos](https://github.com/reactjs/redux/tree/master/examples/todos) 예시를 사용하겠습니다. 이 장을 읽는 동안 복제(clone)해두면 좋습니다.

먼저 `<Router />`와 `<Route />`를 React Router에서 임포트하겠습니다. 이렇게 하면 됩니다:

```js
import { Router, Route, browserHistory } from 'react-router';
```

보통 React 앱에서는 `<Router />`로 `<Route />`를 감싸서, URL이 바뀔 때 `<Router />`가 여러 라우팅을 매치시키고 설정된 컴포넌트들을 랜더합니다. `<Route />`는 라우트를 앱의 컴포넌트 계층구조에 선언적으로 연결합니다. `path`에는 URL에서 사용되는 경로를 정의하고 `component`에는 라우트가 URL과 매치될때 랜더할 단일 컴포넌트를 정의하면 됩니다.

```js
const Root = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>  
);
```

하지만, 우리의 Redux 앱에는 여전히 `<Provider />`가 필요합니다. `<Provider />`는 React Redux가 제공하는 고차 컴포넌트로 Redux를 React에 바인드하도록 해줍니다([React와 함께 사용하기](../basics/UsageWithReact.md) 참고).

React Redux에서 `<Provider />`를 임포트합시다:

```js
import { Provider } from 'react-redux';
```

`<Router />`를 `<Provider />`로 감싸서 라우트 핸들러가 [`store`에 접근](http://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store)할 수 있게 하겠습니다. 

```js
const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);
```

이제 URL이 '/'에 매치되면 `<App />` 컴포넌트가 랜더될겁니다. 그리고 URL에서 파라메터를 읽어올 때 필요한 `(:filter)` 파라메터를 `/`에 추가해 주겠습니다.  

```js
<Route path="/(:filter)" component={App} />
```

아마 URL에서 해시도 제거하고 싶을겁니다(예: `http://localhost:3000/#/?_k=4sbb0i`). 이를 위해서 React Router에서 `browserHistory`를 임포트합시다:

```js
import { Router, Route, browserHistory } from 'react-router';
```

이것을 `<Router />`에 전달해서 URL에서 해시를 제거할 수 있습니다:

```js
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={App} />
    </Router>
```

IE9 처럼 낡은 브라우저를 지원해야 하는 경우가 아니면 언제나 `browserHistory`를 사용할 수 있습니다.

#### `components/Root.js`
``` js
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={App} />
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
```

## React Router로 이동하기

React Router에는 [`<Link />`](https://github.com/reactjs/react-router/blob/master/docs/API.md#link) 컴포넌트가 포함되어 있어 앱 내에서 이동할 수 있게 해줍니다. 예시 안에서 이를 사용해서 `<FilterLink />` 컴포넌트가 URL을 변경하도록 바꿔줍시다. `activeStyle={}` 속성은 활성화된 상태에 스타일을 적용하도록 해줍니다.


#### `containers/FilterLink.js`
```js
import React from 'react';
import { Link } from 'react-router';

const FilterLink = ({ filter, children }) => (
  <Link
    to={filter === 'all' ? '' : filter}
    activeStyle={{
      textDecoration: 'none',
      color: 'black'
    }}
  >
    {children}
  </Link>
);

export default FilterLink;
```

#### `components/Footer.js`
```js
import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = () => (
  <p>
    Show:
    {" "}
    <FilterLink filter="all">
      All
    </FilterLink>
    {", "}
    <FilterLink filter="active">
      Active
    </FilterLink>
    {", "}
    <FilterLink filter="completed">
      Completed
    </FilterLink>
  </p>
);

export default Footer
```

이제 `<FilterLink />`를 클릭하면 URL이 `'/complete'`, `'/active'`, `'/'`로 변하는 것을 볼 수 있습니다. 브라우저에서 뒤로가기를 하더라도, 브라우저의 방문기록을 사용해서 실제로 이전 URL로 이동하게 해줍니다.

## URL에서 읽어오기

지금은 URL이 바뀌더라도 할일 목록이 필터링되지 않습니다. 필터링을 제공하는 `<VisibleTodoList />`'의 `mapStateToProps()`가 URL이 아닌 `state`에 바인드되어 있기 때문입니다. `mapStateToProps`에는 두 번째 인수인 `ownProps`가 있어서 `<VisibleTodoList />`로 전달되는 모든 프로퍼티를 전달받을 수 있습니다
#### `components/App.js`
```js
const mapStateToProps = (state, ownProps) => {
  return {
    todos: getVisibleTodos(state.todos, ownProps.filter) // 바꾸기 전에는 getVisibleTodos(state.todos, state.visibilityFilter)
  };
};
```

당장은 우리가 `<App />`에 아무것도 전달하지 않기 때문에 `ownProps`는 빈 객체입니다. 할일을 URL에 따라 필터링하기 위해 URL 파라메터를 `<VisibleTodoList />`에 전달해야 합니다.

아까 작성했던대로 하면: `<Route path="/(:filter)" component={App} />`, `App` 내에서 `params` 속성을 사용할 수 있게 됩니다.

`params` 속성은 URL 내에 지정된 모든 파라메터를 가지는 객체입니다. *예: `localhost:3000/completed`로 이동하면 `params`은 `{ filter: 'completed' }`이 됩니다. 이제 우리는 `<App />`에서 URL을 읽을 수 있습니다.*

`params`를 `<VisibleTodoList />`로 전달하기 위해 속성에 [ES6 destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)를 사용했다는걸 유념해두세요.

#### `components/App.js`
```js
const App = ({ params }) => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList
        filter={params.filter || 'all'}
      />
      <Footer />
    </div>
  );
};
```

## 다음 단계

이제 기본적인 라우팅을 할 수 있게 되었으니, [React Router API](https://github.com/reactjs/react-router/tree/master/docs)에서 더 배워볼 수 있습니다.

>##### 다른 라우팅 라이브러리에 대해서

>*Redux Router*는 실험적인 라이브러리로, URL의 전체 상태를 전부 리덕스 스토어 안에 저장하게 해줍니다. React Router와 같은 API를 가졌지만 react-router보다 지원하는 커뮤니티는 작습니다.

>*React Router Redux*는 리덕스 앱과 react-router 사이를 바인딩해서 동기화가 유지되도록 해줍니다. 이 바인딩 없이는 시간여행을 통해 액션을 되돌릴 수 없습니다. 이 기능이 필요하지 않다면, React-router와 Redux는 완전히 분리되어 작동할 수 있습니다.
