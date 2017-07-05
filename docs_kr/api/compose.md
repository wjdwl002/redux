# `compose(...functions)`

함수를 오른쪽에서 왼쪽으로 조합합니다.

이것은 함수형 프로그래밍 유틸리티로, Redux에는 편리함을 위해 포함되었습니다.
여러 [스토어 인핸서](../Glossary.md#스토어-인핸서)들을 순차적으로 적용하기 위해 사용할 수 있습니다.

#### 인수

1. (*arguments*): 조합할 함수들입니다. 각각의 함수는 하나의 인자를 받아야 합니다. 함수의 반환값은 왼쪽에 있는 함수의 인수로 제공되는 식으로 연속됩니다. 예외는 가장 오른쪽에 있는 인수로, 여러 개의 인자를 받을 수 있으며 조합된 함수의 시그니처는 이를 따릅니다.

#### 반환

(*Function*): 오른쪽에서 왼쪽으로 조합된 최종 함수입니다.

#### 예시

이 예시는 `compose`를 사용해 [스토어](Store.md)를 [`applyMiddleware`](applyMiddleware.md)와 [redux-devtools](https://github.com/gaearon/redux-devtools) 패키지의 몇몇 개발툴로 강화하는 방법을 보여줍니다.

```js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import DevTools from './containers/DevTools'
import reducer from '../reducers/index'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
)
```

#### 팁

* `compose`가 하는 일은 깊이 중첩된 함수 변환을 길게 늘어진 코드 없이 작성하게 해주는 것 뿐입니다. 너무 대단하게 여기지 마세요!
