---
id: splitting-reducer-logic
title: 리듀서 로직 분리하기
description: '리듀서 구조 잡기 > 리듀서 로직 분리하기: Terms for different reducer use cases'
---

# 리듀서 로직 분리하기

의미를 가지는 애플리케이션의 경우, _모든_ 업데이트 로직을 하나의 리듀서 함수에 넣으면 곧 유지보수가 힘들어집니다. 함수의 길이에 대한 규칙이 없긴 하지만 함수는 상대적으로는 짧아야 하며 이상적으로는 한 가지만 수행해야합니다. 이러한 이유로 매우 길거나 여러일을 하는 코드를 잘게 쪼개는 것은 좋은 프로그래밍 습관입니다.

리덕스 리듀서는 _그저_ 함수이기 때문에 동일한 개념을 적용할 수 있습니다. 당신은 리듀서를 다른 함수로 나누고 부모 함수로 부터 새로운 함수를 호출할 수 있습니다.

이 새로운 함수는 보통 세가지 카테고리로 나뉩니다.

1. 다양한 곳에서 필요한 로직의, 재사용 가능한 작은 유틸리티 함수 (비지니스 로직과 관련이 있을 수도 있고 없을 수도 있습니다)
2. 일반적으로 `(state, action)`이외의 매개변수를 필요로 하는, 업데이트를 위한 함수
3. 주어진 상태에 대한 _모든_ 업데이트를 처리하기 위한 함수. 보통 `(state, action)`형태의 매개변수를 갖습니다.

명확성을 위해 아래의 용어들을 구별해서 사용합니다.

- **_리듀서_**: `(state, action) -> newState`의 형태를 가지는 함수 (즉, `Array.reduce`의 인자로 사용될 수 있는 함수)
- **_루트 리듀서_**: 실제로 `createStore`의 첫 번째 인자로 전달되는 함수. _유일하게_ `(state, action) -> newState` 형태의 로직을 가져야 합니다.
- **_슬라이스 리듀서_**: 상태트리의 특정 부분을 업데이트하는 리듀서. 일반적으로 `combineReducers`로 결합하여 전달됩니다.
- **_케이스 함수_**: 특정 액션에 대한 업데이트 로직을 관리하는 함수. 실제 리듀서기능이거나 적절한 동작을 위해 또 다른 매개변수를 필요로 할 수 있습니다.
- **_고차 리듀서_**: 인자로 리듀서를 받는 함수. 혹은 새로운 리듀서 함수를 반환하는 리듀서 (`combineReducers`, 혹은 `redux-undo`)

*서브 리듀서*는 용어가 매우 정확하진 않지만 루트 리듀서가 아닌 다른 함수라는 의미로 다양하게 언급됩니다. 혹자는 "_비지니스 로직_" (애플리케이션의 구체적인 동작에 관련된 함수) 이나 "_유틸리티 함수_" (애플리케이션과 직접적인 관련이 없는 일반적인 함수) 또한 언급합니다.

복잡한 프로세스를 더 작고 이해하기 쉽게 나누는 것은 **_[기능적 분해](http://stackoverflow.com/questions/947874/what-is-functional-decomposition)_**라는 용어로 설명할 수 있습니다. 이 용어와 개념은 일반적으로 어떠한 코드에도 적용될 수 있습니다. 하지만 리덕스에서는 #3과 같은 접근을 사용해서 리듀서 로직을 구성하는 것은 _매우_ 일반적입니다. 이때 상태의 조각을 기반으로해서 다른 함수에 업데이트 로직이 위임됩니다. 리덕스에서는 이런 컨셉을 **_리듀서 구성_** 이라고 하고 리듀서의 로직을 구성하는데 가장 널리 사용됩니다. 사실 리덕스에서 [`combineReducers()`](../../api/combineReducers.md)라는 유틸리티 함수를 포함하는 것은 매우 일반적이고 이는 상태의 조각에 기반한 리듀서 함수에 위임하는 작업프로세스를 구체적으로 추상화합니다. 하지만 이것이 _유일한_ 패턴이 아니라는 것에 주의해야합니다. 실제로 로직을 함수로 나누기 위한 세가지 방법을 모두 적용할 수 있고, 일반적으로 좋은 아이디어 입니다. [리듀서 리팩토링하기](./RefactoringReducersExample.md) 섹션에서는 실제로 작동하는 몇가지 예제를 보여줍니다.
