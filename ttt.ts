interface MyApp {
  turn: number,
  gameInPlay: boolean;
  playerOneScore: number,
  playerTwoScore: number,
  timeOuts: number[],
  winCombos: number[][],
  playerOneSymbol: string,
  playerTwoSymbol: string,
  numFilledIn: number,
  initializeGame: () => void,
  initializeVars: () => void,
  currentBoard: {
    [key: string]: string,
  },
  display: {
    updateScore: (turn: number) => void;
    drawBoard: () => void,
    resetSquares: () => void,
    showDrawMessage: () => void,
    hideDrawMessage: () => void,
    showWinMessage: (turn: number) => void,
    hideWinMessage: () => void,
    showLoseMessage: () => void,
    hideLoseMessage: () => void,
    showGameStarter: () => void,
    hideGameStarter: () => void,
    showScore: () => void,
    showPlayerOnePrompt: () => void,
    showPlayerTwoPrompt: () => void,
    hidePlayerOnePrompt: () => void,
    hidePlayerTwoPrompt: () => void,
    hideScore: () => void,
    showGameReset: () => void,
    hideGameReset: () => void,
  },
  game: {
    whoStarts: () => number,
    firstGame: () => void,
    play: () => void,
    playTurn: (square: HTMLElement) => void,
    updateSquare: (number: string, symbol: string) => void,
    updateScore: (turn: number) => void,
    endTurn: (symbol: string) => void,
    checkWin: (symbol: string) => [boolean, number[]],
    showWinningCombination: (symbol: string, winCombo: number[]) => void,
    reset: () => void,
    resetGame: () => void,
  }
}

var MYAPP: MyApp = (window as any).MYAPP || {
  gameInPlay: false,
  playerOneScore: 0,
  playerTwoScore: 0,
  winCombos: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ],

  timeOuts: [],
  initializeVars: function () {
    this.numFilledIn = 0;
    this.currentBoard = {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
      9: '',
    };
  },
  initializeGame: function (): void {
    MYAPP.initializeVars();
    MYAPP.display.drawBoard();
    $('.game-starter .choose-x, .game-starter .choose-o').
      off().on('click', MYAPP.game.firstGame);
    $('.hard-reset').on('click', MYAPP.game.resetGame);
  }
};



MYAPP.display = {
  showDrawMessage: function () {
    MYAPP.timeOuts.push(
      setTimeout(function () {
        $('.draw-message').fadeIn(500);
      }, 1500));
  },
  hideDrawMessage: function () {
    $('.draw-message').fadeOut(1000);
  },
  showWinMessage: function (turn: number) {
    MYAPP.timeOuts.push(
      setTimeout(function () {
        $('.win-message').fadeIn(500).
          children('p').text("Player " + turn + " win");
      }, 1500));
  },
  hideWinMessage: function () {
    $('.win-message').fadeOut(1000);
  },
  showLoseMessage: function () {
    MYAPP.timeOuts.push(
      setTimeout(function () {
        $('.lose-message').fadeIn(500);
      }, 1500));
  },
  hideLoseMessage: function () {
    $('.lose-message').fadeOut(1000);
  },
  showGameStarter: function () {
    $('.game-starter').fadeIn(500);
  },
  hideGameStarter: function () {
    $('.game-starter').fadeOut();
  },
  showPlayerOnePrompt: function () {
    $('.player-one-turn p').text("Go Player 1");

    $('.player-one-turn').animate({ 'top': '-45px' }, 500);
  },
  showPlayerTwoPrompt: function () {
    $('.player-two-turn p').text("Go Player 2")

    $('.player-two-turn').animate({ 'top': '-45px' }, 500);
  },
  hidePlayerOnePrompt: function () {
    $('.player-one-turn').animate({ 'top': '0' }, 500);
  },
  hidePlayerTwoPrompt: function () {
    $('.player-two-turn').animate({ 'top': '0' }, 500);
  },
  showGameReset: function () {
    $('.hard-reset').fadeIn(500);
  },
  hideGameReset: function () {
    $('.hard-reset').fadeOut(500);
  },
  drawBoard: function (): void {
    MYAPP.timeOuts.push(setTimeout(function () {
      let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
      let ctx = canvas.getContext("2d")!;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#fff";

      // vertical lines
      ctx.beginPath();
      ctx.moveTo(100, 0);
      ctx.lineTo(100, 150);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(200, 0);
      ctx.lineTo(200, 150);
      ctx.closePath();
      ctx.stroke();

      // horizontal lines
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 48.5);
      ctx.lineTo(300, 48.5);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 98.5);
      ctx.lineTo(300, 98.5);
      ctx.closePath();
      ctx.stroke();
    }, 1500))
  },

  resetSquares: function (): void {
    $('.boxes').html('');
    for (let i = 1; i <= 9; i++) {
      // 通过列表触发按键下棋 
      let box = '<li class="' + i + '"><i class="letter"><span></span></i></li>';
      $(box).appendTo($('.boxes'));
    }
  },
  showScore: function () {
    $('.score-1, .score-2').children('.points').text('0');
    $('.score-1, .score-2, .points-divider').fadeIn(500);
  },
  hideScore: function () {
    $('.points-divider, .score-1, .score-2').fadeOut(500);
  },
  updateScore: function (turn) {
    let currentScore = turn === 1 ? MYAPP.playerOneScore : MYAPP.playerTwoScore;
    $('.score-' + turn).children('.points').text(currentScore);
  }
};

MYAPP.game = {
  whoStarts: function () {
    var random = Math.floor(Math.random() * 2 + 1);
    return random;
  },
  firstGame: function () {
    MYAPP.playerOneSymbol = $(this).text();
    MYAPP.playerTwoSymbol = MYAPP.playerOneSymbol == 'X' ? 'O' : 'X';
    MYAPP.turn = MYAPP.game.whoStarts();
    MYAPP.display.hideGameStarter();
    $('#myCanvas').animate({ 'opacity': '1' }, 1200);
    MYAPP.display.resetSquares();
    MYAPP.display.showGameReset();
    MYAPP.display.showScore();
    MYAPP.game.play();
  },
  play: function () {
    MYAPP.gameInPlay = true;
    $('.boxes li').on('click', function () {
      MYAPP.game.playTurn(this);
    })
    MYAPP.timeOuts.push(
      setTimeout(function () {
        if (MYAPP.turn === 1) {
          MYAPP.display.showPlayerOnePrompt();
        } else if (MYAPP.turn === 2) {
          MYAPP.display.showPlayerTwoPrompt();
        }
      }, 600));
  },

  playTurn: function (square: HTMLElement) {
    const symbol: string = MYAPP.turn === 1 ? MYAPP.playerOneSymbol : MYAPP.playerTwoSymbol;
    const box = $(square).children('i').children('span');
    if (box.text() === '' && MYAPP.gameInPlay) {
      // 填充棋盘
      box.text(symbol);
      // 拿到当前棋子的格子下标
      const number: string = $(square).attr('class')!;
      MYAPP.game.updateSquare(number, symbol);
      MYAPP.game.endTurn(symbol);
    }
  },
  updateSquare: function (number: string, symbol: string) {
    MYAPP.currentBoard[number] = symbol;
  },
  updateScore: function (turn: number) {
    turn === 1 ? MYAPP.playerOneScore += 1 : MYAPP.playerTwoScore += 1;
    MYAPP.display.updateScore(turn);
  },
  endTurn: function (symbol: string) {
    MYAPP.numFilledIn = MYAPP.numFilledIn + 1;
    let checkWin = MYAPP.game.checkWin(symbol)
    if (MYAPP.gameInPlay) {
      // 判断是否胜利，不胜利则继续判断是否平局，不平局则继续
      if (checkWin[0]) {
        MYAPP.game.updateScore(MYAPP.turn);
        MYAPP.gameInPlay = false;
        MYAPP.display.hidePlayerOnePrompt();
        MYAPP.display.hidePlayerTwoPrompt();
        MYAPP.display.showWinMessage(MYAPP.turn);
        MYAPP.game.showWinningCombination(symbol, checkWin[1]);
        MYAPP.game.reset()
      } else if (MYAPP.numFilledIn >= 9) {
        MYAPP.gameInPlay = false;
        MYAPP.display.hidePlayerOnePrompt();
        MYAPP.display.hidePlayerTwoPrompt();
        MYAPP.display.showDrawMessage();
        MYAPP.game.reset()
      } else {
        if (MYAPP.turn === 1) {
          MYAPP.turn = 2
          MYAPP.display.hidePlayerOnePrompt();
          MYAPP.display.showPlayerTwoPrompt();
        } else if (MYAPP.turn === 2) {
          MYAPP.turn = 1
          MYAPP.display.hidePlayerTwoPrompt();
          MYAPP.display.showPlayerOnePrompt();
        }
      }
    }
  },

  checkWin: function (symbol: string): [boolean, number[]] {
    const currentBoard = MYAPP.currentBoard;
    const allWinCombo = MYAPP.winCombos;
    let winningCombo: number[] = [];
    // combination 为 winCombos[i], 0 <= i <= 7
    let isWin = allWinCombo.some(function (combination): boolean {
      let win = true
      for (let i = 0; i < combination.length; i++) {
        if (currentBoard[combination[i]] !== symbol) {
          win = false;
        }
        if (win) {
          winningCombo = combination;
        }
      }
      return win;
    });
    return [isWin, winningCombo]
  },
  showWinningCombination: function (symbol: string, winCombo: number[]) {
    for (let i = 0; i < winCombo.length; i++) {
      let currentBox = '.' + winCombo[i];
      $(currentBox).children('i').addClass('win').children('span').addClass('rotate');
    }
  },
  reset: function () {
    MYAPP.initializeVars();
    MYAPP.turn = MYAPP.game.whoStarts();
    MYAPP.timeOuts.push(
      setTimeout(function () {
        MYAPP.display.hideDrawMessage();
        MYAPP.display.hideLoseMessage();
        MYAPP.display.hideWinMessage();
        $('.boxes li').fadeOut();
      }, 4000),
      setTimeout(function () {
        MYAPP.display.resetSquares();
        $('.boxes li').fadeIn();
        MYAPP.numFilledIn = 0;
      }, 5000),
      setTimeout(function () {
        MYAPP.game.play();
      }, 6000)
    );
  },
  resetGame: function () {
    MYAPP.initializeVars();
    MYAPP.display.resetSquares();
    MYAPP.playerOneScore = 0;
    MYAPP.playerTwoScore = 0;
    MYAPP.gameInPlay = false;
    MYAPP.display.hideGameReset();
    MYAPP.display.hideScore();
    MYAPP.display.showGameStarter();
    MYAPP.timeOuts.forEach(function (timer) {
      clearTimeout(timer);
    });
    $('.draw-message, .win-message, .lose-message').hide();
    MYAPP.display.hidePlayerOnePrompt();
    MYAPP.display.hidePlayerTwoPrompt();

  },

};

$(function () {
  MYAPP.initializeGame();

});