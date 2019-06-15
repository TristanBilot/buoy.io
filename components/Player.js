class Player {

  constructor(x, y, socket) {
    this.x = x;
    this.y = y;
    this.socket = socket;
    this.room = null;
  }

  set setXY(x, y) {
    this.x = x;
    this.y = y;
  }
}
module.exports = Player;
