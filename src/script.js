/**
 * GAME INITIALIZATION 
 */

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');
let scoreP = document.getElementById('score');

let lives = [];
for (let i = 0; i < 3; i++) {
    var live = document.createElement("img");
    live.src = "../img/live.png";
    live.height = 40;
    live.width = 40;
    lives.push(live);
    document.getElementById('status').appendChild(lives[i]);
}

const background = new Image(800, 600);
background.src = '../img/background.jpg';

const playerImg = new Image(35, 35);
playerImg.src = '../img/player.png';

const enemyImg = new Image(35, 35);
enemyImg.src = '../img/enemy.png';

const alien1 = new Image(35, 35);
alien1.src = '../img/alien1.png';

const alien2 = new Image(35, 35);
alien2.src = '../img/alien2.png';

const alien3 = new Image(35, 35);
alien3.src = '../img/alien3.png';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

/**
 * CLASSES DEFINITION
 */

class Battleship {
    constructor(posX, posY, image) {
        this.width = 35;
        this.height = 35;
        this.image = image;
        this.maxSpeed = 5;
        this.speed = 0;
        this.rocket = null;

        this.position = {
            x: posX,
            y: posY
        };
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    update(deltaTime) {
        if (!deltaTime) return;
        this.position.x += this.speed;

        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > GAME_WIDTH)
            this.position.x = GAME_WIDTH - this.width;
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    launchRocket(battleship) {
        this.rocket = new Rocket(battleship);
    }
}

class Player extends Battleship {
    constructor(gameWidth, gameHeight, image) {
        super(gameWidth, gameHeight, image);
        this.score = 0;
        this.hp = 3;
    }

    addScore() {
        this.score += 100;
    }

    takeDamage() {
        this.hp--;
    }
}

class Enemy extends Battleship {
    constructor(gameWidth, gameHeight, image) {
        super(gameWidth, gameHeight, image);
        this.movDistance = 10;
    }

    moveLeft() {
        this.position.x -= this.movDistance;

    }

    moveRight() {
        this.position.x += this.movDistance;
    }

    moveDown() {
        this.position.y += 35;
    }
}

class Rocket {
    constructor(battleship) {
        this.battleship = battleship;
        if (battleship === player) {
            this.direction = -1;
        } else {
            this.direction = 1;
        }
        this.width = 1.5;
        this.height = 15;
        if (battleship === player) {
            this.position = {
                x: this.battleship.position.x + this.battleship.width / 2 - 2,
                y: this.battleship.position.y - this.height
            };
        } else {
            this.position = {
                x: this.battleship.position.x + this.battleship.width / 2 - 2,
                y: this.battleship.position.y + this.height + 10
            };
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        if (this.battleship === player) {
            this.position.y += this.direction * 10;
        } else {
            this.position.y += this.direction * 4;
        }
    }
}

class Shield {
    constructor(positionX, positionY) {
        this.width = 100;
        this.height = 30;
        this.position = {
            x: positionX,
            y: positionY
        }
        this.parts = this.createParts(3, 10);
        this.hp = 20;
    }

    createParts(numRows, numColumns) {
        let array = new Array(numRows);

        for (let i = 0; i < array.length; i++) {
            array[i] = new Array(numColumns);
        }

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[0].length; j++) {
                array[i][j] = new ShieldPart((j * 10 + this.position.x) + 100, i * 10 + this.position.y);
            }
        }
        return array;
    }

    getHit() {
        let indexI = Math.floor(Math.random() * this.parts.length);
        let indexJ = Math.floor(Math.random() * this.parts[0].length);
        if (this.parts[indexI][indexJ] != null) {
            this.parts[indexI][indexJ] = null;
            this.hp--;
        } else {
            this.getHit();
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.parts.length; i++) {
            for (let j = 0; j < this.parts[0].length; j++) {
                if (this.parts[i][j] != null) {
                    this.parts[i][j].drawParts(ctx);
                }
            }
        }
    }
}

class ShieldPart {
    constructor(positionX, positionY) {
        this.width = 10;
        this.height = 10;
        this.position = {
            x: positionX,
            y: positionY
        }
        this.color = '#E74C3C';
    }

    drawParts(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class InputHandler {
    constructor(player) {
        document.addEventListener("keydown", event => {
            switch (event.keyCode) {
                case 32:
                    if (player.rocket == null) {
                        player.launchRocket(player);
                    }
                    break;
                case 37:
                    player.moveLeft();
                    break;
                case 39:
                    player.moveRight();
                    break;
            }
        });

        document.addEventListener("keyup", event => {
            switch (event.keyCode) {
                case 37:
                    if (player.speed < 0)
                        player.stop();
                    break;
                case 39:
                    if (player.speed > 0)
                        player.stop();
                    break;
            }
        });
    }
}

//--------------------FUNCTIONALITY------------------------

function createArray(numRows, numColumns) {
    let array = new Array(numRows);

    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(numColumns);
    }

    return array;
}


let player = new Player(GAME_WIDTH / 2, GAME_HEIGHT - 50, playerImg);
let enemies = createArray(5, 10);
let shields = [];

/**
 * ENEMIES
 */

for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < enemies[0].length; j++) {
        let enemy = new Enemy(50 * j, 70 * i, alien3);
        enemies[i][j] = enemy;
    }
}

for (let i = 0; i < enemies[0].length; i++) {
    for (let j = 0; j < 2; j++) {
        enemies[2 + j][i].image = alien2;
    }
}

for (let i = 0; i < enemies[0].length; i++) {
    enemies[4][i].image = alien1;
}

function getEnemyFromArray() {
    let array = [];
    let enemy = null;
    for (let i = 0; i < enemies[0].length; i++) {
        enemy = null;
        for (let j = 0; j < enemies.length; j++) {
            //i rows j columns
            if (enemies[j][i] != null) {
                enemy = enemies[j][i];
            }
        }
        if (enemy != null) {
            array.push(enemy);
        }
    }

    return array[Math.floor(Math.random() * array.length)];
}

function enemyFire(enemy) {
    enemy.launchRocket(enemy);
}

/**
 * SHIELDS
 */

for (let i = 0; i < 3; i++) {
    let shield = new Shield(i * 250, GAME_HEIGHT - 110);
    shields.push(shield);
    shields[i].position.x += 100;
}

/**
 * 
 * @param {*} timestamp 
 * GAME LOOP
 */

let lastTime = 0;

let enemy = getEnemyFromArray();
enemyFire(enemy);

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.drawImage(background, 0, 0);
    player.update(deltaTime);
    player.draw(ctx);

    for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < enemies[i].length; j++) {
            if (enemies[i][j] != null) {
                enemies[i][j].draw(ctx);
            }
        }
    }

    for (let i in shields)
        shields[i].draw(ctx);

    if (player.rocket != null) {
        player.rocket.update();
        player.rocket.draw(ctx);
    }

    if (enemy.rocket != null) {
        enemy.rocket.update();
        enemy.rocket.draw(ctx);
    }

    if (player.rocket != null) {
        if (player.rocket.position.y < 0) {
            player.rocket = null;
        }
    }

    if (enemy.rocket != null) {
        if (enemy.rocket.position.y + enemy.rocket.height > GAME_HEIGHT) {
            enemy.rocket = null;
            enemy = getEnemyFromArray();
            enemyFire(enemy);
        }
    }

   if (player.rocket != null) {
       for (const a in shields) {
            for (let i = 0; i < shields[a].parts.length; i++) {
                for (let j = 0; j < shields[a].parts[0].length; j++) {
                    if (shields[a].parts[i][j] != null && player.rocket != null) {
                        if (player.rocket.position.y <= shields[a].parts[i][j].position.y + shields[a].parts[i][j].height &&
                            player.rocket.position.y >= shields[a].parts[i][j].position.y &&
                            player.rocket.position.x <= shields[a].parts[i][j].position.x + shields[a].parts[i][j].width &&
                            player.rocket.position.x + player.rocket.width >= shields[a].parts[i][j].position.x) {
                            shields[a].parts[i][j] = null;
                            player.rocket = null;
                            break;
                        }
                    }
                }
            }
        }
    }

    if (enemy.rocket != null) {
        for (let a in shields) {
            for (let i = 0; i < shields[a].parts.length; i++) {
                for (let j = 0; j < shields[a].parts[0].length; j++) {
                    if (shields[a].parts[i][j] != null) {
                        if (enemy.rocket.position.y + enemy.rocket.height >= shields[a].parts[i][j].position.y &&
                            enemy.rocket.position.x <= shields[a].parts[i][j].position.x + shields[a].parts[i][j].width &&
                            enemy.rocket.position.x + enemy.rocket.width >= shields[a].parts[i][j].position.x) {
                            shields[a].parts[i][j] = null;
                            enemy.rocket = null;
                            enemy = getEnemyFromArray();
                            enemyFire(enemy);
                            break;
                        }
                    }
                }
            }
        }
    }

    if (player.rocket != null) {
        for (let i = 0; i < enemies.length; i++) {
            for (let j = 0; j < enemies[0].length; j++) {
                if (enemies[i][j] != null && player.rocket != null) {
                    if (enemies[i][j].position.x <= player.rocket.position.x + player.rocket.width &&
                        enemies[i][j].position.x + enemies[i][j].width >= player.rocket.position.x &&
                        enemies[i][j].position.y + enemies[i][j].height >= player.rocket.position.y &&
                        enemies[i][j].position.y <= player.rocket.position.y) {
                        player.addScore();
                        player.rocket = null;
                        enemies[i][j] = null;
                        break;
                    }
                }
            }
        }
    }

    if (enemy.rocket != null) {
        if (player.position.x <= enemy.rocket.position.x + enemy.rocket.width &&
            player.position.x + player.width >= enemy.rocket.position.x &&
            player.position.y <= enemy.rocket.position.y + enemy.rocket.height &&
            player.position.y + player.height >= enemy.rocket.position.y) {
            enemy.rocket = null;
            let l = lives[lives.length - 1];
            lives.pop();
            document.getElementById('status').removeChild(l);
            if (player.hp > 1) {
                player.takeDamage();
                enemy = getEnemyFromArray();
                enemyFire(enemy);
            } else {
                gameOver();
            }
        }
    }

    if (player.rocket != null && enemy.rocket != null) {
        if (player.rocket.position.y <= enemy.rocket.position.y + enemy.rocket.height &&
            player.rocket.position.x - 2 <= enemy.rocket.position.x + enemy.rocket.width + 2 &&
            player.rocket.position.x + player.rocket.width + 2 >= enemy.rocket.position.x - 2) {
            player.rocket = null;
            enemy.rocket = null;
            enemy = getEnemyFromArray();
            enemyFire(enemy);
        }
    }

    for (let i in shields) {
        if (shields[i].hp < 1) {
            shields.splice(i, 1);
        }
    }

    scoreP.innerHTML = player.score;
    requestAnimationFrame(gameLoop);
}


let direction = 2;
let counter = 300;
let timer = function() {
    switch (direction) {
        case 0:
            moveEnemiesLeft();
            break;
        case 1:
            moveEnemiesDown();
            //increase speed 20%
            if (counter >= 50) {
                counter *= 0.85;
            }
            break;
        case 2:
            moveEnemiesRight();
            break;
    }
    
    function moveEnemiesLeft() {
        let bool;
        for (let i = 0; i < enemies.length; i++) {
            for (let j = 0; j < enemies[0].length; j++) {
                if (enemies[i][j] != null) {
                    if (enemies[i][j].position.x > 10) {
                        bool = true;
                    } else {
                        bool = false;
                        break;
                    }
                }
            }
            break;
        }
    
        if (bool) {
            for (let i = 0; i < enemies.length; i++) {
                for (let j = 0; j < enemies[0].length; j++) {
                    if (enemies[i][j] != null) {
                        enemies[i][j].moveLeft();
                    }
                }
            }
        } else {
            direction = 1;
        }
    }
    
    function moveEnemiesRight() {
        let bool;
        for (let i = 0; i < enemies[0].length; i++) {
            for (let j = 0; j < enemies.length; j++) {
                if (enemies[j][i] != null) {
                    if (enemies[j][i].position.x + enemies[j][i].width + 10 < GAME_WIDTH) {
                        bool = true;
                    } else {
                        bool = false;
                        break;
                    }
                }
            }
        }
        if (bool) {
            for (let i = 0; i < enemies[0].length; i++) {
                for (let j = 0; j < enemies.length; j++) {
                    if (enemies[j][i] != null) {
                        enemies[j][i].moveRight();
                    }
                }
            }
        } else {
            direction = 1;
        }
    }
    
    function moveEnemiesDown() {
        let bool;
        for (let i = 0; i < enemies.length; i++) {
            for (let j = 0; j < enemies[0].length; j++) {
                if (enemies[i][j] != null) {
                    if (enemies[i][j].position.y + enemies[i][j].height >= GAME_HEIGHT - 150) {
                        bool = false;
                        break;
                    } else {
                        bool = true;
                    }
                }
            }
        }
        if (bool) {
            for (let i = 0; i < enemies.length; i++) {
                for (let j = 0; j < enemies[0].length; j++) {
                    if (enemies[i][j] != null) {
                        enemies[i][j].moveDown();
                        if (enemies[i][j].position.x <= 10) {
                            direction = 2;
                        } else if (enemies[i][j].position.x + enemies[i][j].width + 10 >= GAME_WIDTH) {
                            direction = 0;
                        }
                    }
                }
            }
        } else {
            gameOver();
        }
    }
    setTimeout(timer, counter);
}

setTimeout(timer, counter);

let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap';
document.getElementsByTagName('head')[0].appendChild(link);

let gameOverImage = new Image();
gameOverImage.src = link.href;

function gameOver() {
    ctx.font = '50px "Press Start 2P"';
    ctx.textBaseline = 'top';
    let anouncement, shift;
    if (player.score === 5000) {
        anouncement = 'YOU WIN';
        shift = 170;
    } else {
        anouncement = 'GAME OVER';
        shift = 220;
    }
    ctx.fillText(anouncement, GAME_WIDTH / 2 - shift, GAME_HEIGHT / 2 - 50);
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText('Your score: ' + player.score, GAME_WIDTH / 2 - 140, GAME_HEIGHT / 2 + 20);
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('Press Enter to play again', GAME_WIDTH / 2 - 140, GAME_HEIGHT / 2 + 50);
    document.addEventListener("keydown", event => {
        if (event.keyCode === 13) {
            location.reload(true);
        }
    });
    ctx = null;
    clearInterval(timer);
}

function startGame() {
    new InputHandler(player);
    requestAnimationFrame(gameLoop);
}

startGame();