# jjDicTrans
Simple firefox extenstion for English to Korean dictionary &amp; translator

Daum/Naver/Google등의 Backend를 활용한 간단한 영한사전 + 영한번역 Addon 입니다.
영어공부를 할때 불편해서 만들어 봤습니다. 많이 활용하시고 피드백 부탁드립니다.

## 활성화키 설정
<kbd>Shift</kbd> <kbd>Ctrl</kbd> <kbd>Alt</kbd> 와 Function Key와 같은 기타 키를 조합해서 원하는 단축키를 만들어서 사용하면 된다. 또한, 마우스 Double Click 조합이 가능하다 (Double Click 단독으로도 사용가능). 최초 기본값은 <kbd>Shift</kbd> 이다.

## 사전기능 사용하기
검색을 원하는 단어 위에 마우스를 위치시키고 "활성화키"를 누르거나 Drag해서 특정 단어를 선택한 상태에서  "활성화키"를 누르면 된다.

## 번역기능 사용하기
번역하고자 하는 문장을 Drag해서 선택한 후 "활성화키"를 누르거나 선택 후 마우스 오른쪽 버튼을 눌러서 나타나는 컨택스트 메뉴를 클릭하면 된다. 단, 만약 Drag로 선택된 문장이 하나의 단어라면 사전 기능이 활성화 된다.

## 설정변경
버튼 영역의 jjDicTrans 버튼을 클릭하면 설정창이 나타나며 변경된 설정은 바로 적용된다.

## 사전 Backend
  - Daum 미니 사전
  - Naver 미니 사전

## 번역 Backend
  - Google 번역
  - Naver 번역

## Changes
v 0.4.0
  - 선택영역에서 Mouse 오른쪽 버튼의 Context Menu에서 번역하는 Menu 항목 추가.
  - Popup Panel 위치 수정
  - Popup 내용에 집중 할 수 있도록 몇몇 항목 제거

v 0.3.0
  - 키 충돌로 인해 불필요한 창이 뜨는 경우가 있다는 의견이 있어 단축키를 설정가능하도록 변경 했습니다.
  - 설정을 Addon 페이지가 아닌 버튼 영역에서 할 수있도록 변경 했습니다.

## Links
  * https://addons.mozilla.org/ko/firefox/addon/jjdictrans-simple-%EC%98%81%ED%95%9C%EC%82%AC%EC%A0%84%EB%B2%88%EC%97%AD/?src=ss
