"use strict";
var MYAPP = window.MYAPP || {
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
    initializeGame: function () {
        MYAPP.initializeVars();
        MYAPP.display.drawBoard();
        $('.game-choice button').on('click', function () {
            MYAPP.secondPlayer = MYAPP.game.gameSelection(this);
            MYAPP.display.hideGameChoice();
            MYAPP.display.showGameStarter(MYAPP.secondPlayer);
            $('.game-starter .choose-x, .game-starter .choose-o').
                off().on('click', MYAPP.game.firstGame);
            $('.back-button').on('click', function () {
                MYAPP.display.hideGameStarter();
                MYAPP.display.showGameChoice();
            });
        });
        $('.hard-reset').on('click', MYAPP.game.resetGame);
    }
};
MYAPP.display = {
    showDrawMessage: function () {
        MYAPP.timeOuts.push(setTimeout(function () {
            $('.draw-message').fadeIn(500);
        }, 1500));
    },
    hideDrawMessage: function () {
        $('.draw-message').fadeOut(1000);
    },
    showWinMessage: function (turn) {
        MYAPP.timeOuts.push(setTimeout(function () {
            $('.win-message').fadeIn(500).
                children('p').text("Player " + turn + " win");
        }, 1500));
    },
    hideWinMessage: function () {
        $('.win-message').fadeOut(1000);
    },
    showLoseMessage: function () {
        MYAPP.timeOuts.push(setTimeout(function () {
            $('.lose-message').fadeIn(500);
        }, 1500));
    },
    hideLoseMessage: function () {
        $('.lose-message').fadeOut(1000);
    },
    showGameStarter: function (isTwoPlayer) {
        let message;
        if (isTwoPlayer) {
            message = "Player 1: Would you like X or O?";
        }
        else {
            message = " Would you like X or O?";
        }
        MYAPP.timeOuts.push(setTimeout(function () {
            $('.game-starter').fadeIn(500).children('p').text(message);
        }, 700));
    },
    hideGameStarter: function () {
        $('.game-starter').fadeOut();
    },
    showPlayerOnePrompt: function () {
        if (MYAPP.secondPlayer) {
            $('.player-one-turn p').text("Go Player 1");
        }
        else {
            $('.player-one-turn p').text("Your turn");
        }
        $('.player-one-turn').animate({ 'top': '-45px' }, 500);
    },
    showPlayerTwoPrompt: function () {
        if (MYAPP.secondPlayer) {
            $('.player-two-turn p').text("Go Player 2");
        }
        else {
            $('.player-two-turn p').text("computer's turn");
        }
        $('.player-two-turn').animate({ 'top': '-45px' }, 500);
    },
    hidePlayerOnePrompt: function () {
        $('.player-one-turn').animate({ 'top': '0' }, 500);
    },
    hidePlayerTwoPrompt: function () {
        $('.player-two-turn').animate({ 'top': '0' }, 500);
    },
    showGameReset: function () {
        $('.hard-reset').fadeIn(600);
    },
    hideGameReset: function () {
        $('.hard-reset').fadeOut(600);
    },
    showGameChoice: function () {
        $('.game-choice').fadeIn(600);
    },
    hideGameChoice: function () {
        $('.game-choice').fadeOut(600);
    },
    drawBoard: function () {
        MYAPP.timeOuts.push(setTimeout(function () {
            let canvas = document.getElementById("myCanvas");
            let ctx = canvas.getContext("2d");
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
        }, 1500));
    },
    resetSquares: function () {
        $('.boxes').html('');
        for (let i = 1; i <= 9; i++) {
            // 通过列表触发按键下棋 
            let box = '<li class="' + i + '"><i class="letter"><span></span></i></li>';
            $(box).appendTo($('.boxes'));
        }
    },
    showScore: function () {
        if (MYAPP.secondPlayer) {
            $('.score-1').children('.name').text('player 1');
            $('.score-2').children('.name').text('player 2');
        }
        else {
            $('.score-1').children('.name').text('player 1');
            $('.score-2').children('.name').text('computer');
        }
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
    gameSelection: function (item) {
        if ($(item).text() === 'One Player') {
            return false;
        }
        return true;
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
        });
        MYAPP.timeOuts.push(setTimeout(function () {
            if (MYAPP.turn === 1) {
                MYAPP.display.showPlayerOnePrompt();
            }
            else if (MYAPP.turn === 2) {
                MYAPP.display.showPlayerTwoPrompt();
            }
        }, 1500), setTimeout(function () {
            if (MYAPP.turn === 2 && !MYAPP.secondPlayer) {
                MYAPP.game.computerPlay();
            }
        }, 3000));
    },
    playTurn: function (square) {
        const symbol = MYAPP.turn === 1 ? MYAPP.playerOneSymbol : MYAPP.playerTwoSymbol;
        const box = $(square).children('i').children('span');
        // (MYAPP.turn === 2 && MYAPP.secondPlayer) 为防止在电脑回合时，玩家点到棋盘也下棋。
        if (box.text() === '' && MYAPP.gameInPlay && (MYAPP.turn === 1
            || (MYAPP.turn === 2 && MYAPP.secondPlayer))) {
            // 填充棋盘
            box.text(symbol);
            // 拿到当前棋子的格子下标
            const number = $(square).attr('class');
            MYAPP.game.updateSquare(number, symbol);
            MYAPP.game.endTurn(symbol);
        }
    },
    computerPlay: function () {
        let boxNumber;
        if (MYAPP.computer.computerWhichMove() && MYAPP.turn === 2) {
            boxNumber = MYAPP.computer.computerWhichMove();
            let currentBox = $('.' + boxNumber).children('i');
            let symbol = MYAPP.playerTwoSymbol;
            MYAPP.timeOuts.push(setTimeout(function () {
                currentBox.children('span').text(symbol);
                MYAPP.game.updateSquare((boxNumber).toString(), symbol);
                MYAPP.game.endTurn(symbol);
            }), 1000);
        }
    },
    updateSquare: function (number, symbol) {
        MYAPP.currentBoard[number] = symbol;
    },
    updateScore: function (turn) {
        turn === 1 ? MYAPP.playerOneScore += 1 : MYAPP.playerTwoScore += 1;
        MYAPP.display.updateScore(turn);
    },
    endTurn: function (symbol) {
        MYAPP.numFilledIn = MYAPP.numFilledIn + 1;
        let checkWin = MYAPP.game.checkWin(symbol);
        if (MYAPP.gameInPlay) {
            // 判断是否胜利，不胜利则继续判断是否平局，不平局则继续
            if (checkWin[0]) {
                MYAPP.game.updateScore(MYAPP.turn);
                if (MYAPP.secondPlayer) {
                    MYAPP.display.showWinMessage(MYAPP.turn);
                }
                else {
                    MYAPP.turn === 1 ? MYAPP.display.showWinMessage(MYAPP.turn) :
                        MYAPP.display.showLoseMessage();
                }
                MYAPP.gameInPlay = false;
                MYAPP.display.hidePlayerOnePrompt();
                MYAPP.display.hidePlayerTwoPrompt();
                MYAPP.game.showWinningCombination(symbol, checkWin[1]);
                MYAPP.game.reset();
            }
            else if (MYAPP.numFilledIn >= 9) {
                MYAPP.gameInPlay = false;
                MYAPP.display.hidePlayerOnePrompt();
                MYAPP.display.hidePlayerTwoPrompt();
                MYAPP.display.showDrawMessage();
                MYAPP.game.reset();
            }
            else {
                if (MYAPP.turn === 1) {
                    MYAPP.display.hidePlayerOnePrompt();
                    MYAPP.display.showPlayerTwoPrompt();
                    MYAPP.turn = 2;
                    // 如果选择 one player 模式，则调用电脑
                    if (!MYAPP.secondPlayer) {
                        // 增加一些延迟，对局更平滑
                        MYAPP.timeOuts.push(setTimeout(function () {
                            MYAPP.game.computerPlay();
                        }, 1000));
                    }
                }
                else if (MYAPP.turn === 2) {
                    MYAPP.display.hidePlayerTwoPrompt();
                    MYAPP.display.showPlayerOnePrompt();
                    MYAPP.turn = 1;
                }
            }
        }
    },
    checkWin: function (symbol) {
        const currentBoard = MYAPP.currentBoard;
        const allWinCombo = MYAPP.winCombos;
        let winningCombo = [];
        // combination 为 winCombos[i], 0 <= i <= 7
        let isWin = allWinCombo.some(function (combination) {
            let win = true;
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
        return [isWin, winningCombo];
    },
    showWinningCombination: function (symbol, winCombo) {
        for (let i = 0; i < winCombo.length; i++) {
            let currentBox = '.' + winCombo[i];
            $(currentBox).children('i').addClass('win').children('span').addClass('rotate');
        }
    },
    reset: function () {
        MYAPP.initializeVars();
        MYAPP.timeOuts.push(setTimeout(function () {
            MYAPP.display.hideDrawMessage();
            MYAPP.display.hideLoseMessage();
            MYAPP.display.hideWinMessage();
            $('.boxes li').fadeOut();
        }, 5000), setTimeout(function () {
            MYAPP.display.resetSquares();
            $('.boxes li').fadeIn();
            MYAPP.numFilledIn = 0;
        }, 6000), setTimeout(function () {
            MYAPP.game.play();
        }, 6000));
    },
    resetGame: function () {
        MYAPP.initializeVars();
        MYAPP.display.resetSquares();
        MYAPP.playerOneScore = 0;
        MYAPP.playerTwoScore = 0;
        MYAPP.gameInPlay = false;
        $('#myCanvas').animate({ 'opacity': '0' }, 100);
        MYAPP.display.hideGameReset();
        MYAPP.display.hideScore();
        MYAPP.timeOuts.forEach(function (timer) {
            clearTimeout(timer);
        });
        $('.draw-message, .win-message, .lose-message').hide();
        MYAPP.display.hidePlayerOnePrompt();
        MYAPP.display.hidePlayerTwoPrompt();
        MYAPP.display.showGameChoice();
    },
};
MYAPP.computer = {
    computerWhichMove: function () {
        // win 代表电脑计算自身能赢的下法
        // block 代表电脑计算阻止对方赢的下法
        // 若电脑能赢，优先考虑能赢的下法
        let move = this.winOrBlockChoice('win')[0];
        if (!move) {
            move = this.winOrBlockChoice('block')[0];
        }
        if (!move) {
            move = this.doubleThreatChoice('win');
        }
        if (!move) {
            move = this.doubleThreatChoice('block');
        }
        if (!move) {
            move = this.firstPlay();
        }
        if (!move) {
            move = this.playCenter();
        }
        if (!move) {
            move = this.emptyCorner();
        }
        if (!move) {
            move = this.emptySide();
        }
        if (typeof move === 'number' && MYAPP.currentBoard[move] === '') {
            return move;
        }
        return false;
    },
    winOrBlockChoice: function (choiceType, board) {
        let localBoard = board || MYAPP.currentBoard;
        let currentSymbol;
        let opponentSymbol;
        // 电脑固定为玩家二，因此能赢时，当前符号为玩家二，此时棋子的落法为让自身赢
        // 若不能赢时，当前符号为玩家一，即站在对方角度思考能赢的下法，然后下这一步阻止对方赢。
        if (choiceType === 'win') {
            currentSymbol = MYAPP.playerTwoSymbol;
            opponentSymbol = MYAPP.playerOneSymbol;
        }
        else if (choiceType === 'block') {
            currentSymbol = MYAPP.playerOneSymbol;
            opponentSymbol = MYAPP.playerTwoSymbol;
        }
        // move 代表下了之后将胜利的所有下法的集合
        let moves = [];
        MYAPP.winCombos.forEach(function (combo) {
            let winCombo = [];
            // isJoin 若为 true，则将 combo 加入当前符号的胜利组合，
            // 为 false， 则不加入。
            let isJoin = true;
            for (let i = 0; i < combo.length; i++) {
                if (localBoard[combo[i]] !== currentSymbol) {
                    // 若在当前胜利组合中有对手棋子，则这个胜利组合不会加入自身
                    if (localBoard[combo[i]] === opponentSymbol) {
                        isJoin = false;
                    }
                    else {
                        winCombo.push(combo[i]);
                    }
                }
            }
            // 若自身离胜利组合只差一步棋子，则加入待下的步骤
            if (winCombo.length === 1 && isJoin) {
                let move = winCombo[0];
                moves.push(move);
            }
        });
        return moves;
    },
    doubleThreatChoice: function (choiceType) {
        let board = MYAPP.currentBoard;
        let move;
        let currentSymbol;
        let opponentSymbol;
        if (choiceType === 'win') {
            currentSymbol = MYAPP.playerTwoSymbol;
            opponentSymbol = MYAPP.playerOneSymbol;
        }
        else if (choiceType === 'block') {
            currentSymbol = MYAPP.playerOneSymbol;
            opponentSymbol = MYAPP.playerTwoSymbol;
        }
        // 防止对角线胜利组合，例如 139
        // 解决办法需要在中心有棋子，然后下在边路破解，否则在 19或 37 之时已经无解
        if (board[5] === currentSymbol && MYAPP.numFilledIn === 3) {
            if ((board[1] === opponentSymbol && board[9] === opponentSymbol)
                || (board[3] === opponentSymbol && board[7] === opponentSymbol)) {
                move = this.emptySide();
            }
        }
        // 尝试进行进行对角线攻击
        if (!move && board[5] === opponentSymbol && MYAPP.numFilledIn === 2) {
            move = this.diagonalSecondAttack();
        }
        // 提前思考一步，查找双重攻击（如 139，256）的可能性
        if (!move) {
            for (let i = 1; i <= 9; i++) {
                // 复制当前棋盘
                let testBoard = $.extend({}, board);
                if (testBoard[i] === '') {
                    testBoard[i] = currentSymbol;
                    if (this.winOrBlockChoice(choiceType, testBoard).length >= 2) {
                        // 代表下这一步可以进入双重攻击的局面
                        move = i;
                    }
                }
            }
        }
        return move || false;
    },
    diagonalSecondAttack: function () {
        let com = MYAPP.playerTwoSymbol;
        let corners = [1, 3, 7, 9];
        for (let i = 0; i < corners.length; i++) {
            if (MYAPP.currentBoard[corners[i]] === com) {
                return 10 - corners[i];
            }
        }
        return false;
    },
    firstPlay: function () {
        let corners = [1, 3, 7, 9];
        if (MYAPP.numFilledIn === 1) {
            // 玩家第一步下在中心
            if (MYAPP.currentBoard[5] === MYAPP.playerOneSymbol) {
                // 电脑随机下在四个角，为之后的对角进攻做准备
                let random = Math.floor(Math.random() * 4);
                return corners[random];
            }
        }
        // 电脑先下，随机选择四个角或中心(false返回后到 playCenter 中去)
        if (MYAPP.numFilledIn === 0) {
            let random = Math.floor(Math.random() * 5);
            if (random !== 4) {
                return corners[random];
            }
        }
        return false;
    },
    playCenter: function () {
        if (MYAPP.currentBoard[5] === '') {
            return 5;
        }
        return false;
    },
    emptyCorner: function () {
        let corners = [1, 3, 7, 9];
        for (let i = 0; i < corners.length; i++) {
            if (MYAPP.currentBoard[corners[i]] === '') {
                return corners[i];
            }
        }
        return false;
    },
    emptySide: function () {
        let sides = [2, 4, 6, 8];
        for (let i = 0; i < sides.length; i++) {
            if (MYAPP.currentBoard[sides[i]] === '') {
                return sides[i];
            }
        }
        return false;
    }
},
    $(function () {
        MYAPP.initializeGame();
    });
