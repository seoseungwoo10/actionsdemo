const Game = require('../src/game').default
const fs = require('fs')

// CI 환경에서 스냅샷 테스트를 실행하지 않으려면 다음과 같이 설정
const isCI = process.env.CI === 'true'

/**
 * 주석 처리된 코드는
 * fs.readFile 함수가 비동기적으로 파일을 읽는 동안 Jest가 테스트를 너무 일찍 종료하려고 시도하기 때문입니다.
 * Jest는 기본적으로 각 테스트에 대해 5초의 타임아웃을 설정합니다.
 * done 콜백을 사용하면 비동기 작업이 완료될 때까지 Jest에게 기다리라고 지시할 수 있지만,
 * 파일 읽기 작업이 5초 이상 걸리면 타임아웃 오류가 발생
 */
describe('App', () => {
  it('Contains the compiled JavaScript', async () => {
  /*
      fs.readFile('./public/main.js', 'utf8', (err, data) => {
        expect(err).toBeNull()
        expect(data).toMatchSnapshot()
        done()
      })
  */
    const data = await fs.promises.readFile('./public/main.js', 'utf8') // async/await 사용
    if (isCI) {
      expect(data).toBeDefined()
    } else {
      //expect(data).toMatchSnapshot()
    }
  })
})

describe('Game', () => {
  let game, p1, p2
  beforeEach(() => {
    p1 = 'Salem'
    p2 = 'Nate'
    game = new Game(p1, p2)
  })

  describe('Game', () => {
    it('Initializes with two players', async () => {
      expect(game.p1).toBe('Salem')
      expect(game.p2).toBe('Nate')
    })

    it('Initializes with an empty board', async () => {
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board[r].lenght; c++) {
          expect(game.board[r][c]).toBeUndefined()
        }
      }
    })

    it('Starts the game with a random player', async () => {
      Math.random = () => 0.4
      expect(new Game(p1, p2).player).toBe('Salem')

      Math.random = () => 0.6
      expect(new Game(p1, p2).player).toBe('Nate')
    })
  })

  describe('turn', () => {
    it("Inserts an 'X' into the top center", async () => {
      game.turn(0, 1)
      expect(game.board[0][1]).toBe('X')
    })

    it("Inserts an 'X' into the top left", async () => {
      game.turn(0)
      expect(game.board[0][0]).toBe('X')
    })
  })

  describe('nextPlayer', () => {
    it('Sets the current player to be whoever it is not', async () => {
      Math.random = () => 0.4
      const game = new Game(p1, p2)
      expect(game.player).toBe('Salem')
      game.nextPlayer()
      expect(game.player).toBe('Nate')
    })
  })

  describe('hasWinner', () => {
    it('Wins if any row is filled', async () => {
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board[r].length; c++) {
          game.board[r][c] = 'X'
        }
        expect(game.hasWinner()).toBe(true)

        for (let c = 0; c < game.board[r].length; c++) {
          game.board[r][c] = null
        }
      }
    })

    it('Wins if any column is filled', async () => {
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board[r].length; c++) {
          game.board[c][r] = 'X'
        }
        expect(game.hasWinner()).toBe(true)

        for (let c = 0; c < game.board[r].length; c++) {
          game.board[c][r] = null
        }
      }
    })

    it('Wins if down-left diagonal is filled', async () => {
      for (let r = 0; r < game.board.length; r++) {
        game.board[r][r] = 'X'
      }
      expect(game.hasWinner()).toBe(true)
    })

    it('Wins if up-right diagonal is filled', async () => {
      for (let r = 0; r < game.board.length; r++) {
        game.board[2 - r][r] = 'X'
      }
      expect(game.hasWinner()).toBe(true)
    })
  })
})
