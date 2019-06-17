class Player {

  constructor(x, y, socket) {
    this.x = x;
    this.y = y;
    this.socket = socket;
    this.room = null;
    this.id = this.getRandomInt(1000000);
    this.color = "rgb(" + this.getRandomInt(255) + "," + this.getRandomInt(255) + "," + this.getRandomInt(255) + ")";
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
module.exports = Player;
