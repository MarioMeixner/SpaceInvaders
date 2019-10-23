export class Battleship {
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