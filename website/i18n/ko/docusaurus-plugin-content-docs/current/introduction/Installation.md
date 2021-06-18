---
id: installation
title: 설치
description: '소개 > 설치: Redux와 관련 패키지 설치 방법'
hide_title: true
---

&nbsp;

# 설치

## Redux Toolkit

Redux Toolkit은 Redux 코어 뿐 아니라 저희가 Redux 앱을 만들 때 필수적이라고 느낀 패키지들을 포함하고 있습니다(Redux Thunk나 Reselect 등).

모듈 번들러나 Node 애플리케이션에서 사용하기 위해 NPM 패키지를 제공합니다:

```bash
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

UMD 빌드 또한 [unpkg의 `dist` 폴더](https://unpkg.com/@reduxjs/toolkit/dist/)에서 사용 가능합니다. UMD 빌드를 통해 Redux Toolkit을 전역변수 `window.RTK`를 통해 사용할 수 있습니다.

## Redux Core

안정 버전을 설치하려면:

```bash
# NPM
npm install redux

# Yarn
yarn add redux
```

이는 여러분이 [npm](https://www.npmjs.com/)을 패키지 매니저로 사용하고 있다고 가정합니다.

만약 아니라면 [이들 파일을 unpkg에서 접근](https://unpkg.com/redux/)해서 다운로드받거나 여러분의 패키지 매니저에 지정해주세요.

대부분의 사람들은 Redux를 [CommonJS](http://webpack.github.io/docs/commonjs.html) 모듈로 사용합니다. 이 모듈은 [Webpack](https://webpack.js.org/)이나 [Browserify](http://browserify.org/) 또는 Node 환경에서 `redux`를 임포트할때 불러와집니다. 여러분이 최첨단을 걷고 있으며 [Rollup](https://rollupjs.org)을 사용한다면 이 역시 지원합니다.

만약 여러분이 모듈 번들러를 사용하고 있지 않더라도 괜찮습니다. `redux` npm 패키지는 미리 컴파일된 프로덕션과 개발용 [UMD](https://github.com/umdjs/umd) 빌드를 [`dist` 폴더](https://unpkg.com/redux/dist/)에 포함하고 있습니다. 이들은 번들러 없이 바로 사용 가능하고 대부분의 자바스크립트 모듈 로더나 환경과 호환됩니다. 예를 들어 UMD 빌드를 페이지 상의 [`<script>` 태그](https://npmcdn.com/redux/dist/redux.js)에서 사용하거나 [Bower가 설치하게 할 수 있습니다](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975). UMD 빌드는 Redux를 `window.Redux` 전역변수로 사용하게 해줍니다.

Redux 소스코드는 ES2015로 작성되었지만 CommonJS와 UMD 빌드 모두를 ES5로 미리 컴파일해두었기 때문에 [모든 모던 브라우저](http://caniuse.com/#feat=es5)에서 작동합니다. [Redux를 시작하기](https://github.com/reactjs/redux/blob/master/examples/counter-vanilla/index.html)위해 Babel이나 모듈 번들러를 사용할 필요는 없습니다.

## 보조 패키지

아마 여러분은 [React 바인딩](https://github.com/reduxjs/react-redux)과 [개발자 도구](https://github.com/reduxjs/redux-devtools)도 필요하실겁니다.

```bash
npm install react-redux
npm install --save-dev redux-devtools
```

Redux 자체와는 달리 Redux 생태계의 많은 패키지들은 UMD 빌드를 제공하지 않으므로, 편안한 개발 경험을 위해 [Webpack](https://webpack.js.org/)이나 [Browserify](http://browserify.org/) 같은 CommonJS 모듈 번들러를 사용하기를 권합니다.

## React Redux 앱 만들기

React와 Redux를 사용하는 새 앱을 만드는 방법으로는 [Create React App](https://github.com/facebook/create-react-app)의 [공식 Redux+JS 템플릿](https://github.com/reduxjs/cra-template-redux)을 사용하는 것을 추천합니다. 이를 통해 [Redux Toolkit](https://redux-toolkit.js.org/)과 React Redux의 React 컴포넌트 통합이 주는 이점을 누릴 수 있습니다.

```sh
npx create-react-app my-app --template redux
```
