class Player {

    constructor(x, y, socket) {
        this.x = null;
        this.y = null;
        this.velocity = null;
        this.angle = null;
        this.socket = socket;
        this.room = null;
        this.id = null;
        this.color = "rgb(" + this.getRandomInt(255) + "," + this.getRandomInt(255) + "," + this.getRandomInt(255) + ")";
    }
    toJSON(){
        return {x: this.x, y: this.y, velocity: this.velocity, angle: this.angle, id: this.id, color: this.color};
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

module.exports = Player;
