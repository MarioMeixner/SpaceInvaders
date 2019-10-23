export class Shield {
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

    doDamage() {

    }
}