[![Node.js CI](https://github.com/seoseungwoo10/actionsdemo/actions/workflows/node.js.yml/badge.svg)](https://github.com/seoseungwoo10/actionsdemo/actions/workflows/node.js.yml)

# Tic Tac Toe 게임

틱택토 게임을 통해 GitHub Actions에 대해 배워봅시다!

 

## 게임 방법

1. 3x3 게임판에서 먼저 가로, 세로, 대각선 중 하나를 먼저 채우는 사람이 이깁니다.
2. 먼저 채운 사람이 이기는 사람이 됩니다.
3. 게임이 끝나면 다시 시작할 수 있습니다.
4. 게임이 끝나면 승자가 나타납니다.
5. 게임이 끝나면 게임판이 초기화됩니다.

## 게임 시작하기

1. 게임을 시작하려면 `Start Game` 버튼을 클릭하세요.
2. 게임이 끝나면 `Restart Game` 버튼을 클릭하세요.
3. 게임이 끝나면 승자가 나타납니다.
4. 게임이 끝나면 게임판이 초기화됩니다.

## 게임판

| 1 | 2 | 3 |
|---|---|---|
| 4 | 5 | 6 |
| 7 | 8 | 9 |

## 게임 상태

- 현재 차례: O
- 승자: 없음
- 게임 종료: false
- 게임 시작: false
- 게임 판: [0, 0, 0, 0, 0, 0, 0, 0, 0]
- 게임 기록: []
- 게임 메시지: 게임을 시작하세요!
- 게임 결과:
- 게임 승자: 없음
- 게임 승자 인덱스: -1
- 게임 승자 라인: []
- 게임 승자 메시지: 승자가 없습니다.
- 게임 승자 표시: false
