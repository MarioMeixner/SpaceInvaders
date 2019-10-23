export class ShieldPart {
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