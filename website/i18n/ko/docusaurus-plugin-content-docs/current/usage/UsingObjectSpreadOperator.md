---
id: using-object-spread-operator
title: 객체 확산 연산자 사용하기
---

&nbsp;

# 객체 확산 연산자 사용하기

Redux 의 핵심 규칙 중 하나가 절대 state를 직접 변경하지 않는 것이기 때문에 새로운 값이 추가되거나 업데이트 된 객체를 복사하기 위해서 [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)을 자주 사용하게 될 것입니다. 예를 들면, `todoApp` 에서 아래의 `Object.assign()`은 `visibilityFilter` 프로퍼티가 업데이트 된 새로운 `state` 객체를 리턴하기 위해 쓰였습니다.

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

효과적이긴 하지만, `Object.assign()` 의 장황한 문법 때문에 간단한 reducer를 읽기 어렵게 만듭니다.

또 다른 접근법은 다음 버전에 제안된 [객체 확산 문법 object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread)를 사용하는 것입니다. 이것은 확산 연산자 (`...`)를 사용해서 객체에서 다른 객체로 열거 가능한 프로퍼티들을 좀 더 간결하게 복사 할 수 있습니다. 객체 확산 연산자 (Object Spread Operator)는 개념적으로 ES6의 [배열 확산 연산자 array spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) 와 비슷합니다. 우리는 위의 `todoApp`예제를 다음과 같이 객체 확산 문법을 사용하여 단순화 할 수 있습니다:

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter: action.filter }
    default:
      return state
  }
}
```

객체 확산 문법의 장점은 복잡한 객체를 구성할 때 명확해 집니다.아래에서 `getAddedIds`가 `id`값의 배열을 `getProduct`와 `getQuantity`에서 리턴된 값을 가진 객체의 배열에 맵핑합니다.

```js
return getAddedIds(state.cart).map(id =>
  Object.assign({}, getProduct(state.products, id), {
    quantity: getQuantity(state.cart, id)
  })
)
```

객체 확산은 위의 `map` 호출을 다음과 같이 단순화 시켜줍니다:

```js
return getAddedIds(state.cart).map(id => ({
  ...getProduct(state.products, id),
  quantity: getQuantity(state.cart, id)
}))
```

객체 확산 문법은 여전히 ECMAScript의 2단계 제안이므로 그것을 이용하려면 [Babel](http://babeljs.io/) 같은 트렌스파일러를 사용하셔야 됩니다. 기존의 `es2015` 프리셋을 이용 하실 수 있습니다. [`babel-plugin-transform-object-rest-spread`](http://babeljs.io/docs/plugins/transform-object-rest-spread/)를 설치하고 당신의 `.babelrc` 안 `plugins` 배열에 개별적으로 추가하면 됩니다.

```json
{
  "presets": ["es2015"],
  "plugins": ["transform-object-rest-spread"]
}
```

아직 실험적인 언어 기능 제안이기 때문에 미래에 바뀔 수 있다는 것을 알아두세요. 그럼에도 불구하고 [React Native](https://github.com/facebook/react-native)와 같은 일부 대규모 프로젝트에서는 이미 이 객체 확산 문법을 광범위하게 사용하기 때문에 혹시 변경 되더라도 좋은 자동 마이그레이션(migration) 경로가 있을 것 이라 말할 수 있습니다.
