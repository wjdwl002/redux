# 생태계

Redux는 작은 라이브러리입니다. 하지만 Redux의 규약과 API는 조심스럽게 선택되고 있으며 다양한 도구와 확장 라이브러리의 생태계가 만들어져가고 있습니다.

Redux와 관련 있는 모든 목록을 보고싶다면 [Awesome Redux](https://github.com/xgrommx/awesome-redux)를 추천합니다. 여기에는 예제, 발판코드(boilerplate), 미들웨어, 유틸리티 라이브러리를 비롯한 다양한 것들이 열거되어있습니다.

이 페이지에서는 Redux 메인터이터가 개인적으로 선택한 몇 가지만 소개합니다. 이 목록을 보더라도 다른 라이브러를 시도해보는 걸 주저하지 않기 바랍니다. Redux 생태계는 아주 빠르게 성장하고 있으며, 이들 전부를 검토하기에는 시간이 부족합니다. 아래 목록은 '개발팀이 추천한' 목록 정도로만 받아들여주세요. Redux와 함께 사용할 수 있는 멋진 도구가 있다면 망설이지 말고 풀 리퀘스트를 보내주세요.

## 바인딩

* [react-redux](https://github.com/gaearon/react-redux) — React 바인딩
* [ng-redux](https://github.com/wbuchwalter/ng-redux) — Angular 바인딩

## 미들웨어

* [redux-thunk](http://github.com/gaearon/redux-thunk) — 비동기 액션을 만들기 위한 가장 쉬운 방법
* [redux-promise](https://github.com/acdlite/redux-promise) — [FSA](https://github.com/acdlite/flux-standard-action)를 따르는 프로미즈 미들웨어
* [redux-rx](https://github.com/acdlite/redux-rx) — Observable을 위한 미들웨어를 포함한 Redux용 RxJS 유틸리티
* [redux-batched-updates](https://github.com/acdlite/redux-batched-updates) —
 Redux 디스패치에 따른 React 배치 업데이트 미들웨어
* [redux-logger](https://github.com/fcomb/redux-logger) — 모든 Redux 액션과 다음 상태에 대한 기록 도구
* [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant) — Redux 디스패처가 아닌 곳에서 상태 변화가 일어나면 경고해주는 미들웨어


## 컴포넌트

* [redux-form](https://github.com/erikras/redux-form) — Redux 스토어를 통한 HTML form을 포함한 React 컴포넌트 상태 관리 지원

## 스토어 확장

* [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) — 디스패치에 따른 배치 구독 알림(subscribe notification)을 보낼 수 있는 스토어 확장

## 유틸리티

* [reselect](https://github.com/faassen/reselect) — NuclearJS에서 영감을 받아 만들어진 효율적인 파생 데이터 셀렉터
* [normalizr](https://github.com/gaearon/normalizr) — 중첩된 API 응답을 React나 Flux에서 활용하기 쉬운 형태로 만들어주는 도구
* [redux-actions](https://github.com/acdlite/redux-actions) — Flux 표준 액션 유틸리티
* [redux-transducers](https://github.com/acdlite/redux-transducers) — Redux용 트랜스듀서
* [redux-immutablejs](https://github.com/indexiatech/redux-immutablejs) -  Redux와 [Immutable](https://github.com/facebook/immutable-js/) 통합을 위한 도구


## 개발자 도구

* [redux-devtools](http://github.com/gaearon/redux-devtools) — [React Europe에서 처음 소개된](https://www.youtube.com/watch?v=xsSnOQynTHs) 시간여행 UI, 핫 리로딩, 리듀서 에러 핸들링을 위한 액션 로거

## 튜토리얼과 기사

* [redux-tutorial](https://github.com/happypoulp/redux-tutorial) — 한 단계 한 단계 Redux를 사용법을 배울 수 있는 튜토리얼
* [Flux가 뭐야?! Redux하자.(What the Flux?! Let’s Redux.)](https://blog.andyet.com/2015/08/06/what-the-flux-lets-redux) - Redux 소개
* [(사랑을 담아) 동형 Redux 애플리케이션 만들기(Handcrafting an Isomorphic Redux Application (With Love))
](https://medium.com/@bananaoomarang/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4) - 범용적인 애플리케이션을 만들기 위한 가이드(데이터 패치와 라우팅 포함)
* [Full-Stack Redux Tutorial](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html) — 테스트 주도로 짜여진 Redux, React, Immutable 튜토리얼

## 기타

[Awesome Redux](https://github.com/xgrommx/awesome-redux) - Redux와 관련된 저장소들을 모아놓은 문서
