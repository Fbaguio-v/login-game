const canvas = document.querySelector("#canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const userInput = document.querySelector("#for_username");
const passInput = document.querySelector("#for_password");

let username = "";
let password = "";

let stringAlpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@_#";
let arrayAlpha = [];
let letters = [];
let player;
let playerX = ( canvas.width / 2 ) - 80;
let playerY = 800;
let tileSize = 32;
let tileNumber = 5;
let randomNumLength = 5;

//create letter class
class Circle {
    constructor(x, y, radius, text) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.text = text;

        this.speed = 3;
    }

    update() {
        this.y += this.speed;
    }
}

//create player class
class Rect {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;

        this.direction = "R";
        this.velocityX = 0;
    }

    update(direction) {
        this.direction = direction;
        this.updateVelocity();
    }

    updateVelocity() {
        if(this.direction === "R") {
            this.velocityX = tileSize/4;
        } else if(this.direction === "L") {
            this.velocityX = -tileSize/4;
        }
    }
}

//check if letter and player collide
let checkPlayerAndLetterCollision = (a, b) => {
    let closestX = Math.max(a.x, Math.min(b.x, a.x + a.w));
    let closestY = Math.max(a.y, Math.min(b.y, a.y + a.h));
    
    let distanceX = b.x - closestX;
    let distanceY = b.y - closestY;
    
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (b.radius * b.radius);
};

//check if player is less than 0 agains the wall and greater than the whole width of the canvas
let checkCollision = (a, b) => {
    return a.x < 0 || a.x + (tileSize * 5) > b.width;
};

//loop the string and push it into the empty array
let loopAlpha = () => {
    for(let i = 0; i < stringAlpha.length; i++) {
        arrayAlpha.push(stringAlpha[i]);
    }
};

//create circle object and assign a letter
let assignLetter = () => {
    for(let i = 0; i < randomNumLength; i++) {
        let x = Math.round(Math.random() * canvas.width);
        let y = 50;
        let radius = 10;
        let randomNum = Math.round(Math.random() * arrayAlpha.length);
        let letter = new Circle(x, y, radius, arrayAlpha[randomNum]);
        letters.push(letter);
    }
};

//create player object
let createPlayer = () => {
    player = new Rect(playerX, playerY, tileSize * tileNumber, tileSize, "green");
}

// draw objects
let draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.w, player.h);

    letters.forEach(letter => {
        context.beginPath();
        context.fillStyle = "black";
        let x = Math.round(Math.random() * canvas.width);
        context.arc(letter.x + x , letter.y, letter.radius, 0, Math.PI * 2, false);
        context.fillText(letter.text, letter.x, letter.y);
        context.font = "25px Helvetica";
        context.closePath();
    });
};

let movePlayer = (e) => {
    e.preventDefault();
    let keyPressed = e.key;

    if(keyPressed === "ArrowRight" || keyPressed === "d" || keyPressed === "D") {
        player.update("R");
    } else if(keyPressed === "ArrowLeft" || keyPressed === "a" || keyPressed === "A") {
        player.update("L");
    }
};

let move = () => {
    player.x += player.velocityX;

    if(checkCollision(player, canvas)) {
        player.x -= player.velocityX;
    }
    
    letters.forEach((letter, index) => {
        if(checkPlayerAndLetterCollision(player, letter)) {
            letters.splice(index, 1);
            userInput.value = username += letter.text;
        }
    });
};

setInterval(assignLetter, 3000);

let update = () => {
    move();
    draw();

    letters.forEach(letter => {
        letter.update();
    });

    if(letters.length < 5) {
        assignLetter();
    }

    requestAnimationFrame(update);
};

document.addEventListener("DOMContentLoaded", () => {
    loopAlpha();
    assignLetter();
    createPlayer();
    update();
    document.addEventListener("keyup", movePlayer);
});