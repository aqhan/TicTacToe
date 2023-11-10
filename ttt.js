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
            ctx.beginPath();
            ctx.moveTo(0, 50);
            ctx.lineTo(300, 50);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 100);
            ctx.lineTo(300, 100);
            ctx.closePath();
            ctx.stroke();
        }, 1500));
    }
};
$(function () {
    MYAPP.initializeGame();
});
