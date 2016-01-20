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

* **사용여부**

	> 이 설정이 Check 되어 있을때만 jjDicTrans의 기능이 동작하게 된다.

* **실행모드**

	> 특정기능만 사용하고 싶을때 설정 할 수 있도록 해주는 옵션이다.

	```
	- 사전 + 번역
	- 사전 only
	- 번역 only
	```

* **활설화 키 조합**

	> 사전을 활성화 시켜줄 Key를 설정한다.

	> 만약 마우스 더블클릭이 선택되지 않았다면 4개의 키 중에서 최소한 하나는 선택되어야 한다.

* **마우스 더블클릭**

	> 활성화 키와 함께 마우스 더블클릭을 조할 할 수 있다. 활성화 키 없이 마우스 더블 클릭 만으로도 설정 가능 하다.

* **사전 Backend**

	```
	- Daum 미니 사전
	- Naver 미니 사전
	```
* **번역 Backend**

	```
	- Google 번역
	- Naver 번역
	```

* **Popup 위치**

	> 사전/번역 정보 Popup이 출력 되는 위치에 대한 설정이다. 팜업창이 컨텐츠를 가려서 불편하다면 설정을 변경해 보자.

	```
	- 우측상단
	- 커서위치
	```


## ChangeLog
```
v0.5.3
	- backgrun-color --> background-color

v0.5.2
	- adjust popup size

v0.5.1
	- Popup창 위치 변경 후 원복 되지 않던 문제 수정

v0.5.0
	- Popup창 위치를 설정할 수 있는 옵션 추가.
	- Mode 설정 옵션 추가
		- 사전 + 번역 모드
		- 사전 Only 모드
		- 번역 Only 모드
v0.4.2
	- 번역과사전 창을 임의로 띄울수 있는 링크 추가
v0.4.1
  - Popup Context Menu에 여러 항목이 중복으로 나열되는 문제 처리
v0.4.0
  - 선택영역에서 Mouse 오른쪽 버튼의 Context Menu에서 번역하는 Menu 항목 추가.
  - Popup Panel 위치 수정
  - Popup 내용에 집중 할 수 있도록 몇몇 항목 제거
v0.3.0
  - 키 충돌로 인해 불필요한 창이 뜨는 경우가 있다는 의견이 있어 단축키를 설정가능하도록 변경 했습니다.
  - 설정을 Addon 페이지가 아닌 버튼 영역에서 할 수있도록 변경 했습니다.
```

## Links
  * https://addons.mozilla.org/ko/firefox/addon/jjdictrans-simple-%EC%98%81%ED%95%9C%EC%82%AC%EC%A0%84%EB%B2%88%EC%97%AD/?src=ss
