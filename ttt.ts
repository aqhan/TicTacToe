interface MyApp {
  turn: number,
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
    drawBoard: () => void,
    resetSquares: () => void,
    showDrawMessage: () => void,
    hideDrawMessage: () => void,
    showWinMessage: () => void,
    hideWinMessage: () => void,
    showLoseMessage: () => void,
    hideLoseMessage: () => void,
  },
  game: {
    firstGame: () => void,
    play: () => void,
    playTurn: (square: HTMLElement) => void,
    updateSquare: (number: string, symbol: string) => void,
    endTurn: (symbol: string) => void,
    checkWin: (symbol: string) => [boolean, number[]],
    showWinningCombination: () => void,
    reset: () => void,
  }
}

var MYAPP: MyApp = (window as any).MYAPP || {
  gameInPlay: false,
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

  playerOneSymbol: 'X',
  playerTwoSymbol: 'O',
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
    MYAPP.game.firstGame();
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
  showWinMessage: function () {
    MYAPP.timeOuts.push(
      setTimeout(function () {
        $('.win-message').fadeIn(500);
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
  drawBoard: function (): void {
    MYAPP.timeOuts.push(setTimeout(function () {
      let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
      let ctx = canvas.getContext("2d")!;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000";

      // vertical lines
      ctx.beginPath();
      ctx.moveTo(100, 5);
      ctx.lineTo(100, 150);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(200, 5);
      ctx.lineTo(200, 150);
      ctx.closePath();
      ctx.stroke();

      // horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, 53);
      ctx.lineTo(300, 53);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 100);
      ctx.lineTo(300, 100);
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
  }
};

MYAPP.game = {
  firstGame: function () {
    MYAPP.display.resetSquares();
    MYAPP.game.play();
  },
  play: function () {
    MYAPP.turn = 1;
    $('.boxes li').on('click', function () {
      MYAPP.game.playTurn(this);
    })
  },

  playTurn: function (square: HTMLElement) {
    const symbol: string = MYAPP.turn === 1 ? MYAPP.playerOneSymbol : MYAPP.playerTwoSymbol;
    const box = $(square).children('i').children('span');
    if (box.text() === '') {
      // 填充棋盘
      box.text(symbol);
      // 拿到当前棋子的格子下标
      const number: string = $(square).attr('class')!;
      MYAPP.game.updateSquare(number, symbol)
      MYAPP.game.endTurn(symbol);
    }
  },
  updateSquare: function (number: string, symbol: string) {
    MYAPP.currentBoard[number] = symbol;
  },
  endTurn: function (symbol: string) {
    MYAPP.numFilledIn = MYAPP.numFilledIn + 1;

    // 判断是否胜利，不胜利则继续判断是否平局，不平局则继续
    if (MYAPP.game.checkWin(symbol)[0]) {
      MYAPP.game.showWinningCombination();
      MYAPP.game.reset()
    } else if (MYAPP.numFilledIn >= 9) {
      MYAPP.display.showDrawMessage();
    } else {
      if (MYAPP.turn === 1) {
        MYAPP.turn = 2
      } else if (MYAPP.turn === 2) {
        MYAPP.turn = 1
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
  showWinningCombination: function () {
    MYAPP.display.showWinMessage();
    console.log('you win')
  },
  reset: function () {
    MYAPP.initializeVars();

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
  }
};

$(function () {
  MYAPP.initializeGame();

});