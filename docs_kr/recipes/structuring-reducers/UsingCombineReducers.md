---
id: using-combinereducers
title: combineReducers 사용하기
description: '리듀서 구조 잡기 > combineReducers 사용하기: Explanations of how combineReducers works in practice'
hide_title: true
---

# `combineReducers`사용하기

## 핵심 개념

리덕스 앱에서 상태의 가장 일반적인 형태는 각 최상위 키마다 도메인별 데이터조각을 포함한 일반적인 자바스크립트 객체입니다. 이처럼, 일반적으로 상태의 형태에 대한 리듀서 로직을 작성하는 방법은 "슬라이스 리듀서"기능을 가지고, 각각은 동일한 `(state, action)`의 형태를 가지며, 특정 상태의 부분을 업데이트 하는 겁니다. 여러 슬라이스 리듀서가 하나의 액션에 응답할 수 있고 독립적으로 필요에 따라 자체적으로 업데이트할 수도 있습니다. 또한 업데이트된 슬라이스는 새로운 객체로 합쳐집니다.

이런 패턴이 매우 흔하기 때문에 리덕스는 이를 구현한 유틸리티인 `combineReducers`를 제공합니다. 이는 슬라이스 리듀서들로 이루어진 객체를 취하는 *고차 리듀서*의 예입니다.

`combineReducers`를 사용할 때 알아야 할 몇 가지가 있습니다.

- 우선 `combineReducers`는 **리덕스 리듀서를 작성할 때 가장 일반적인 용례를 단순화 하는 유틸리티 함수입니다.** 모든 애플리케이션에서 사용할 필요는 _없으며_ 모든 가능한 시나리오를 처리하지 _않습니다._ 이 함수를 사용하지 않고도 리듀서로직을 작성할 수 있으며, `combineReducers`를 사용하지 않는 경우는 보통 커스텀 리듀서를 직접 만들어줘야 합니다. (예제는 [`combineReducers`더 알아보기](./BeyondCombineReducers.md) 를 참조하세요)
- 리덕스는 상태의 구성에 대해서는 관여하지 않지만 `combineReducers`는 일반적으로 발생하는 에러를 피하기 위해 몇 가지 규칙을 강제합니다. (자세한건 [`combineReducers`](../../api/combineReducers.md)를 참고하세요)
- 자주 하는 질문 중 하나는 리덕스가 액션을 디스패치 했을 때 "모든 리듀서를 호출"하는가? 입니다. 루트 리듀서 함수는 오직 하나만 존재하기 때문에 이에 대한 대답은 "아니오"입니다. 하지만 `combineReducers`에는 이러한 방식으로 _작동하는_ 특정 동작이 있습니다. `combineReducers`는 새로운 상태 트리를 조립하기 위해 상태의 부분과 현재 액션을 처리하는 각 슬라이스 리듀서를 호출하고, 필요하다면 슬라이스 리듀서에게 상태를 업데이트할 수 있게 할겁니다. 그래서 `combineReducers`는 "모든 리듀서를 호출"하거나 래핑 된 모든 슬라이스 리듀서를 호출합니다.

## 상태의 형태를 정의하기

초기의 형태와 저장소 상태의 형태의 개념을 정의하는 것은 두 가지 방법이 있습니다. 첫 번째는 `createStore`가 두번째 매개변수로 취하는 `preloadedState`입니다. 이는 주로 브라우저의 localStorage처럼 이전의 상태로 저장소를 초기화하기 위한 것입니다. 또 다른 벙법은 루트 리듀서의 상태 매개변수가 `undefined` 일때 초기 상태를 반환하는 것입니다. 이 두 가지 접근방식은 [상태 초기화](./InitializingState.md)에서 더 자세히 설명합니다. 여기선 `combineReducers`를 사용할 때 주의해야할 몇가지 사항이 있습니다.

`combineReducers`는 슬라이스 리듀서 함수들로 이루어진 객체를 취하며, 동일한 키를 가진 상태 객체를 출력하는 함수를 만듭니다. 이는 `createStore`에 사전 로드된 상태가 제공되지 않는다면, 인풋 슬라이스 리듀서 객체의 키의 이름에 따라 아웃풋 상태객체의 키의 이름이 결정됨을 의미합니다. 이 이름 간의 관계는 항상 명확하진 않으며, default module exports나 객체리터럴과 같은 ES6의 기능을 사용할 때 특히 그렇습니다.

아래는 `combineReducers`에서 ES6의 객체리터럴로 상태의 형태를 정의한 예제입니다.

```js
// reducers.js
export default theDefaultReducer = (state = 0, action) => state

export const firstNamedReducer = (state = 1, action) => state

export const secondNamedReducer = (state = 2, action) => state

// rootReducer.js
import { combineReducers, createStore } from 'redux'

import theDefaultReducer, {
  firstNamedReducer,
  secondNamedReducer
} from './reducers'

// 객체의 형태를 정의하기 위해 ES6의 객체리터럴 단축문법을 사용
const rootReducer = combineReducers({
  theDefaultReducer,
  firstNamedReducer,
  secondNamedReducer
})

const store = createStore(rootReducer)
console.log(store.getState())
// {theDefaultReducer : 0, firstNamedReducer : 1, secondNamedReducer : 2}
```

객체리터럴을 정의하기 위해 ES6의 단축 문법을 사용했기 때문에, 생성된 상태의 키의 이름이 imports 한 변수 이름이라는 것에 주의하세요. 이는 항상 원하는 동작이 아닐 수도 있으며, ES6 구문에 익숙하지 않으 사람에게 종종 혼란을 일으키기도 합니다.

또한 이름이 약간 이상합니다. 일반적으로 이름에 "reducer"와 같은 단어를 포함하는 것은 좋은 습관이 아닙니다. - 키에는 보유한 데이터의 도메인이나 유형을 단순하게 반영해야 합니다. 이는 상태 아웃풋의 키를 정의하기 위해서 슬라이스 리듀서 객체의 키의 이름을 반드시 명시적으로 지정해야 함을 의미합니다. 아니면 단축 객체리터럴 문법을 사용할 때 불러온 슬라이스 리듀서에 대한 변수의 이름을 신중하게 재지정해주어야 합니다.

개선된 방법을 사용하면 다음과 같습니다:

```js
import { combineReducers, createStore } from 'redux'

// default import의 이름을 원하는 대로 바꿀 수 있습니다. 이는 import에도 사용될 수 있습니다.
import defaultState, {
  firstNamedReducer,
  secondNamedReducer as secondState
} from './reducers'

const rootReducer = combineReducers({
  defaultState, // default import에서 신중하게 다시 명명된 것과 동일한 키 이름
  firstState: firstNamedReducer, // 변수이름 대신 키 지정
  secondState // default import에서 신중하게 다시 명명된 것과 동일한 키 이름
})

const reducerInitializedStore = createStore(rootReducer)
console.log(reducerInitializedStore.getState())
// {defaultState : 0, firstState : 1, secondState : 2}
```

이런 상태의 형태는 `combineReducers`에게 키를 신중하게 전달했기 때문에 관련된 데이터를 더욱 잘 반영합니다.
