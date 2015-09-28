# 예제

Redux [소스코드](https://github.com/rackt/redux/tree/master/examples)에는 몇 가지 예제 코드와 함께 배포됩니다.

>##### 복사에 대하여
>Redux 예제를 예제 폴더 밖에 복사해서 사용한다면, `webpack.config.js` 파일의 마지막 몇 줄은 지워도 괜찮습니다. 이는 "여러분의 프로젝트에서 이 부분을 안전하게 지울 수 있습니다(You can safely delete these lines in your project)."라는 주석이 있습니다.

## 카운터(Counter)

다음 명령어로 [카운터(Counter)](https://github.com/rackt/redux/tree/master/examples/counter) 예제를 실행할 수 있습니다.

```
git clone https://github.com/rackt/redux.git

cd redux/examples/counter
npm install
npm start

open http://localhost:3000/
```

카운터 예제에서는 다음 내용을 다룹니다.

* 기본적인 Redux의 흐름
* 테스트

## TodoMVC

다음 명령어로 [TodoMVC](https://github.com/rackt/redux/tree/master/examples/todomvc) 예제를 실행할 수 있습니다.

```
git clone https://github.com/rackt/redux.git

cd redux/examples/todomvc
npm install
npm start

open http://localhost:3000/
```

TodoMVC 예제에서는 다음 내용을 다룹니다.

* 리듀서 두 개를 사용한 Redux 흐름
* 중첩된 자료 갱신
* 테스트

## 비동기(Async)

다음 명령어로 [비동기(Async](https://github.com/rackt/redux/tree/master/examples/async) 예제를 실행할 수 있습니다.

```
git clone https://github.com/rackt/redux.git

cd redux/examples/async
npm install
npm start

open http://localhost:3000/
```

비동기(Async) 예제에서는 다음을 다룹니다.

* [redux-thunk](https://github.com/gaearon/redux-thunk)를 활용한 기본적인 비동기 흐름
* 응답을 캐싱하는 방법과 데이터를 가져오는 동안 로딩 이미지 보여주기
* 캐시된 데이터를 무효화하기

## 범용(Universal)

다음 명령어로 [Universal](https://github.com/rackt/redux/tree/master/examples/universal) 예제를 실행할 수 있습니다.

```
git clone https://github.com/rackt/redux.git

cd redux/examples/universal
npm install
npm start & npm run client

open http://localhost:3000/
```

It covers:

* [Universal rendering](../recipes/ServerRendering.md) with Redux and React
* Prefetching state based on input and via asynchronous fetches.
* Passing state from the server to the client

[Universal] 예제에서는 다음을 다룹니다.

* Redux와 React를 통한 [Universal 렌더링](/docs_kr/recipes/ServerRendering.md)]
* 입력이나 비동기 패치에 기반한 상태 프리패치
* 서버에서 클라이언트로 상태 넘겨주기

## 리얼 월드(Real World)

다음 명령어로 [리얼 월드(Read World)](https://github.com/rackt/redux/tree/master/examples/real-world) 예제를 실행할 수 있습니다.

```
git clone https://github.com/rackt/redux.git

cd redux/examples/real-world
npm install
npm start

open http://localhost:3000/
```

리얼 월드 예제에서는 다음을 다룹니다.

* 실제로 활용하게 될(Real-world) Redux 비동기 흐름
* 정규화된 엔티티 캐시 안에서 엔티티 유지하기
* API 호출을 위한 커스텀 미들웨어
* 응답을 캐싱하는 방법과 데이터를 가져오는 동안 로딩 이미지 보여주기
* 페이지네이션
* 라우팅

## 더 많은 예제

[Awesome Redux](https://github.com/xgrommx/awesome-redux)에서 더 많은 예제를 찾아볼 수 있습니다.
