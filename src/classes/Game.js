import {Player} from './Player';

/**
 * GAME INITIALIZATION 
 */

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');
let scoreP = document.getElementById('score');

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
        for (let j in shields) {
            if (player.rocket.position.y <= shields[j].position.y + shields[j].height &&
                player.rocket.position.x <= shields[j].position.x + shields[j].width &&
                player.rocket.position.x + player.rocket.width >= shields[j].position.x) {
                shields[j].getHit();
                player.rocket = null;
                break;
            }
        }
    }

    if (enemy.rocket != null) {
        for (let j in shields) {
            if (enemy.rocket.position.y + enemy.rocket.height >= shields[j].position.y &&
                enemy.rocket.position.x <= shields[j].position.x + shields[j].width &&
                enemy.rocket.position.x + enemy.rocket.width >= shields[j].position.x) {
                shields[j].getHit();
                enemy.rocket = null;
                enemy = getEnemyFromArray();
                enemyFire(enemy);
                break;
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
let timer = setInterval(function () {
    switch (direction) {
        case 0:
            moveEnemiesLeft();
            break;
        case 1:
            moveEnemiesDown();
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
}, 300);

function gameOver() {
    ctx = null;
    clearInterval(timer);
    alert('GAME OVER\nYOUR SCORE: ' + player.score);
}

function startGame() {
    new InputHandler(player);
    requestAnimationFrame(gameLoop);
}

startGame();