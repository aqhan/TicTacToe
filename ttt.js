var MYAPP = window.MYAPP || {
    timeOuts: [],
    initializeGame: function () {
        MYAPP.display.drawBoard();
    }
};
MYAPP.display = {
    drawBoard: function () {
        MYAPP.timeOuts.push(setTimeout(function () {
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
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
        }, 1500));
    },
    resetSquares: function () {
        $('.boxes').html('');
        for (var i = 1; i <= 9; i++) {
            var box = '<li class="' + i + '"><i class="letter"><span></span></i></li>';
            $(box).appendTo($('.boxes'));
        }
    }
};
MYAPP.game = {
    play: function () {
        MYAPP.turn = 1;
        $('.boxes li').on('click', function () {
            MYAPP.game.playTurn(this);
        });
    },
    playTurn: function (square) {
        var symbol;
        if (MYAPP.turn === 1) {
            symbol = 'X';
        }
        else if (MYAPP.turn === 2) {
            symbol = 'O';
        }
        var box = $(square).children('i').children('span');
        if (box.text() === '') {
            box.text(symbol);
            MYAPP.game.endTurn(symbol);
        }
    },
    endTurn: function () {
        if (MYAPP.turn === 1) {
            MYAPP.turn = 2;
        }
        else if (MYAPP.turn === 2) {
            MYAPP.turn = 1;
        }
    }
};
$(function () {
    MYAPP.initializeGame();
    MYAPP.display.resetSquares();
    MYAPP.game.play();
});
