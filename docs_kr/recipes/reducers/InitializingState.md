# 상태 초기화하기

애플리케이션의 상태를 초기화하는 방법은 크게 두 가지가 있습니다. `createStore` 메소드는 추가적인 두 번째 인자로 `preloadedState`값을 받을 수 있습니다. 또한 리듀서는 `undefined`인 인자를 찾고 초깃값으로 사용할 값을 반환해서 초깃값을 지정할 수 있습니다. 이는 리듀서 내부에서 명시적으로 확인하거나 `function myReducer(state = someDefaultValue, action)` 처럼 ES6의 기본 인자 구문을 통해 사용할 수 있습니다.

이 두 가지 접근이 항상 명확한 것은 아닙니다. 다행히 프로세스는 예측 가능한 규칙을 따르고 있습니다. 여기서는 그 조각들을 어떻게 맞추는지 알아봅니다.

## 요약

리듀서에서 `combineReducers()`와 같은 코드가 없다면 `preloadedState`는 항상 `state = ...`보다 우선합니다. 리듀서에 전달된 `state` *는* `preloadedState`이고 `undefined`가 *아니기* 때문입니다. 따라서 ES6 인수 구문이 적용되지 않습니다.

`combineReducers()`의 동작은 더욱 미묘합니다. `preloadedState`로 상태가 지정된 리듀서는 해당 상태를 받습니다. 다른 리듀서는 기본으로 정의한 `state = ...`로 돌아갈 것이기 때문에 `undefined`를 받습니다.

**일반적으로 `preloadedState`는 리듀서로 부터 정의된 상태보다 우선시됩니다. 이는 리듀서에 초깃값으로 사용될 값을 지정할 수 있을 뿐만아니라 영구적인 저장소나 서버로 부터 스토어를 가져올 때 (전체 혹은 부분적으로) 이미 존재하는 데이터를 불러올 수 있습니다.**

*주의: `preloadedState`를 통해 초기상태가 지정된 리듀서**또한 `undefined`인 상태를 처리하기위해 기본값이 필요합니다.** 모든 리듀서에는 초기에 `undefined`가 전달됩니다. 따라서 반드시 `undefined`인 경우에 어떤 값이 반환될지가 작성되어야 합니다. 이는 `undefined`가 아닌 어떤 값이라도 가능합니다; `preloadedState`의 섹션을 이곳에 기본값으로 복사할 필요가 없습니다.*

## 심화

### 간단한 단일 리듀서

먼저 리듀서가 하나인 경우를 생각해봅시다. `combineReducers()`를 사용하지않습니다.

이때 리듀서는 다음처럼 생겼을 겁니다.

```js
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT': return state + 1;
  case 'DECREMENT': return state - 1;
  default: return state;
  }
}
```

이제 스토어를 다음처럼 만들었다고 가정해봅시다.

```js
import { createStore } from 'redux';
let store = createStore(counter);
console.log(store.getState()); // 0
```

초기 상태는 0입니다. 왜 그럴까요? `createStore`의 두 번째 인자가 `undefined`이기 때문입니다. 이는 리듀서에 처음으로 전달된 `state`입니다. 리덕스가 초기화될 때 디스패처는 상태를 채우기 위해 "더미" 액션을 전달합니다. 따라서 당신의 `counter`리듀서는 `state`가 `undefined`인 상태로 호출되었습니다. **이는 기본 인자를 "활성화"하는 경우입니다.** 따라서 `state`는 기본값 (`state = 0`)에 따라 `0`이 됩니다. 그리고 이 상태가 반환됩니다.

다른 시나리오를 생각해봅시다.

```js
import { createStore } from 'redux';
let store = createStore(counter, 42);
console.log(store.getState()); // 42
```

이 경우에 왜 `0`이 아닌 `42`일까요? `createStore`는 두 번째 인자로 `42`와 함께 호출되었기 때문입니다. 이 인자는 당신의 리듀서에 더미 액션과 함께 전달되는 `state`가 됩니다. **이번에는 `state`가 undefined가 아닙니다.(`42`가 됩니다!) 그러므로 ES6의 기본 인자 문법은 효력이 없습니다.** `state`는 `42`이고 `42`는 리듀서로부터 반환됩니다.
 
### 리듀서 결합

`combineReducers()`를 사용하는 경우를 생각해봅시다.
두 개의 리듀서가 있습니다:

 ```js
function a(state = 'lol', action) {
  return state;
}

function b(state = 'wat', action) {
  return state;
}
```

`combineReducers({ a, b })`에 의해 만들어진 리듀서는 다음과같습니다:

```js
// const combined = combineReducers({ a, b })
function combined(state = {}, action) {
  return {
	a: a(state.a, action),
	b: b(state.b, action)
  };
}
```

`preloadedState`없이 `createStore`를 부른다면 `state`를 `{}`로 초기화할겁니다. 따라서 `state.a`, `state.b`는 `a`와 `b`리듀서가 불리는 시점에 `undefined`로 초기화될겁니다. **`a`와 `b`리듀서는 `undefined`를 *그것들의* 상태 인자로 받고, 기본 `state`값으로 지정한다면 반환될겁니다.** 이것이 결합된 리듀서가 첫 호출에서 `{ a: 'lol', b: 'wat' }` 상태 객체를 반환하는 방법입니다.

```js
import { createStore } from 'redux';
let store = createStore(combined);
console.log(store.getState()); // { a: 'lol', b: 'wat' }
```

다른 시나리오를 생각해봅시다.

```js
import { createStore } from 'redux';
let store = createStore(combined, { a: 'horse' });
console.log(store.getState()); // { a: 'horse', b: 'wat' }
```

`preloadedState`를 `createStore()`의 인자로 지정했습니다. 결합된 리듀서에서 반환되는 상태는 `a`리듀서에 지정된 초기 상태를 `b`리듀서의 기본 인자로 선택된 `'wat'`과 결합합니다.**

결합된 리듀서가 하는 일을 다시 한번 생각해봅시다.

```js
// const combined = combineReducers({ a, b })
function combined(state = {}, action) {
  return {
	a: a(state.a, action),
	b: b(state.b, action)
  };
}
```

이 경우에, `state`가 지정되었기 때문에 `{}`로 되돌아가지 않았습니다. `a`의 값은 `horse`이지만 `b`의 값이 없습니다. `a`리듀서가 `state`로 `'horse'`를 받아 반환했지만 `b`리듀서가 `state`로 `undefined`를 받기 때문에 이를 기본 `state`로 반환합니다. 이것이 반환 값으로 `{ a: 'horse', b: 'wat' }`를 얻을 수 있는 이유입니다.

## 요약

요약하면, 리덕스의 컨벤션을 지키고 `undefined`를 `state`인자로 호출했을 때 리듀서의 초기 상태를 반환하려면 (이를 구현하기 위한 가장 쉬운 방법은 `state`를 ES6의 기본 인자 값으로 지정하는 것) 결합된 리듀서를 위해 적절한 일을 해야 합니다. **`createStore()`함수에 전달된 `preloadedState`객체에서 상응하는 값을 넘겨주겠지만, 아무것도 전달하지 않거나 대응되는 값이 없다면 기본 `state` 인자가 초깃값으로 대신 지정됩니다.** 이 방법은 기존 데이터를 주입, 초기화하고 데이터가 보존되지 않는 경우 각 상태를 다시 설정할 수 있다는 점에서 효과적입니다. 물론 `combineReducers()`를 많은 단계에서 사용해서 이 패턴을 재귀적으로 사용할 수도 있습니다. 혹은 관련 상태 트리의 일부를 전달함으로써 부분적으로 사용할 수도 있습니다.