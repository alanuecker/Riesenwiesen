let playerName;
let playerNameInput = document.getElementById('playerNameInput');
let socket;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

//let canvas = new fabric.Canvas('canvas');
let c = document.getElementById('cvs');
let canvas = c.getContext('2d');
c.width = screenWidth;
c.height = screenHeight;

let KEY_ENTER = 13;

let global = {
    // Keys and other mathematical constants
    KEY_ESC: 27,
    KEY_ENTER: 13,
    KEY_CHAT: 13,
    KEY_SPLIT: 32,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    borderDraw: false,
    spin: -Math.PI,
    mobile: false,

    // Canvas
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    gameWidth: 0,
    gameHeight: 0,
    xoffset: -0,
    yoffset: -0,
    gameStart: false,
    disconnected: false,
    continuity: false,
    backgroundColor: '#f2fbff',
    lineColor: '#000000',
};

let game = new Game(canvas, global);

function startGame() {
    playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
    document.getElementById('gameAreaWrapper').style.display = 'block';
    document.getElementById('startMenuWrapper').style.display = 'none';
    socket = io();
    SetupSocket(socket);
    animloop();
}

// check if nick is valid alphanumeric characters (and underscores)
function validNick() {
    let regex = /^\w*$/;
    return regex.exec(playerNameInput.value) !== null;
}

window.onload = function() {
    'use strict';

    let btn = document.getElementById('startButton'),
        nickErrorText = document.querySelector('#startMenu .input-error');

    btn.onclick = function () {

        // check if the nick is valid
        if (validNick()) {
            startGame();
        } else {
            nickErrorText.style.display = 'inline';
        }
    };

    playerNameInput.addEventListener('keypress', function (e) {
        let key = e.which || e.keyCode;

        if (key === KEY_ENTER) {
            if (validNick()) {
                startGame();
            } else {
                nickErrorText.style.display = 'inline';
            }
        }
    });
};

function SetupSocket(socket) {
  game.handleNetwork(socket);
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
})();

function animloop(){
    requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
  game.handleLogic();
  game.handleGraphics(canvas);
}

window.addEventListener('resize', function() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    c.width = screenWidth;
    c.height = screenHeight;

    game.drawCards();
}, true);
