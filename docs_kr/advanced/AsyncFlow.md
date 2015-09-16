# 비동기 흐름

[미들웨어](Middleware.md)가 없으면 Redux는 [동기 데이터 흐름](../basics/DataFlow.md)만을 지원합니다. [`createStore()`](../api/createStore.md)의 기본값입니다.

[`applyMiddleware()`](../api/applyMiddleware.md)를 이용해 [`createStore()`](../api/createStore.md)를 강화할 수 있습니다. 이게 필수는 아니지만, 이를 통해 [비동기 액션을 편리하게 표현할 수 있습니다](AsyncActions.md).

[redux-thunk](https://github.com/gaearon/redux-thunk)나 [redux-promise](https://github.com/acdlite/redux-promise) 같은 비동기 미들웨어는 스토어의 [`dispatch()`](../api/Store.md#dispatch)를 감싸서 액션이 아니라 함수나 약속같은 다른 것들을 보낼 수 있게 해줍니다. 미들웨어는 여러분이 보내는 무엇이든 받아서 해석한 다음 체인의 다음 미들웨어로 액션을 넘깁니다. 예를 들어 약속 미들웨어는 약속을 붙잡아서 각 약속의 응답에 따라 시작/끝 액션을 비동기적으로 보내줄 수 있습니다.

체인의 마지막 미들웨어가 액션을 보내면, 이 액션은 보통의 객체여야 합니다. 그러고 나서 [동기 Redux 데이터 흐름](../basics/DataFlow.md)이 들어가게 됩니다.

## 다음 단계

여러분은 이제 Redux 앱에서 데이터 흐름에 대한 모든 것을 알았습니다! [비동기 예시의 소스 코드](ExampleRedditAPI.md)를 확인하거나 [React Router 통합하기](UsageWithReactRouter.md)를 읽어보세요.
