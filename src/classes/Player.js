export default class Player extends Battleship {
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