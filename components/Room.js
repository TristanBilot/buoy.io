class Room {
  constructor(name, socketOfOwner) {
    this.name = name;
    this.players = [];
    this.id = getRandomInt(1000000);
    this.run = true;
    addPlayer(socketOfOwner);
  }

  addPlayer(player) {
    players.push(player);
  }

  getPlayer(socket) {
    for each (player in players) {
      if (player)
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
  module.exports = Room;
