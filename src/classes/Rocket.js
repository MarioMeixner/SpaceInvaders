export class Rocket {
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