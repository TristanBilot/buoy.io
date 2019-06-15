class Room {
  constructor(name, socketOfOwner) {
    this.name = name;
    this.players = [];
    //this.id = getRandomInt(1000000);
    this.run = true;
    this.addPlayer(socketOfOwner);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayer(socket) {
    player.forEach(function(player) {
      if (socket == player.socket)
        return player;
    });
  }
}
  module.exports = Room;
