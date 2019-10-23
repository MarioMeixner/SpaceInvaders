export class Enemy extends Battleship {
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
        this.position.y += 50;
    }
}