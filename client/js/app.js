let playerName;
let playerNameInput = document.getElementById('playerNameInput');
let nickDoubleText = document.querySelector('#startMenu .input-name-double');
let nickErrorText = document.querySelector('#startMenu .input-error');
let socket = io();

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

//let canvas = new fabric.Canvas('canvas');
let stage = new createjs.Stage("cvs");
let content = new createjs.Container();
stage.addChild(content);
let c = document.getElementById('cvs');
c.addEventListener('contextmenu', event => event.preventDefault());
c.width = screenWidth;
c.height = screenHeight;

let global = {
    offsetX: 0,
    offsetY: 0,

    // Keys and other mathematical constants
    KEY_ESC: 27,
    KEY_ENTER: 13,
    KEY_CHAT: 13,
    KEY_SPLIT: 32,
    KEY_LEFT: 65,
    KEY_UP: 87,
    KEY_RIGHT: 68,
    KEY_DOWN: 83,
    borderDraw: false,
    spin: -Math.PI,
    mobile: false
};

let game = new Game(socket);
SetupSocket();


function startGame() {
    playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
    document.getElementById('gameAreaWrapper').style.display = 'block';
    document.getElementById('startMenuWrapper').style.display = 'none';
    animloop();
}

// check if nick is valid alphanumeric characters (and underscores)
function validNick() {
    console.log("valid nick");

    let regex = /^\w*$/;
    return regex.exec(playerNameInput.value) !== null;
}

function checkedNick(value) {
    console.log("check nick " + value);
    if(value)
        startGame();
    else{
        nickDoubleText.style.display = 'inline';
        nickErrorText.style.display = 'none';
    }
}

window.onload = function() {
    'use strict';

    let btn = document.getElementById('startButton');

    btn.onclick = function () {

        // check if the nick is valid
        if (validNick()) {
            game.sendPlayerName(playerNameInput.value);
        } else {
            nickErrorText.style.display = 'inline';
            nickDoubleText.style.display = 'none';
        }
    };

    playerNameInput.addEventListener('keypress', function (e) {
        let key = e.which || e.keyCode;

        if (key === global.KEY_ENTER) {
            if (validNick()) {
                game.sendPlayerName(playerNameInput.value);
            } else {
                nickErrorText.style.display = 'inline';
                nickDoubleText.style.display = 'none';
            }
        }
    });
};

function SetupSocket() {
  game.handleNetwork();
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
  game.handleGraphics();
}

window.addEventListener('resize', function() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    c.width = screenWidth;
    c.height = screenHeight;

    game.drawCards();
    game.drawPlaceCard();
}, true);
