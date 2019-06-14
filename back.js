var Player = require('./components/Player.js');
var Room = require('./components/Room.js');
var http = require('http');
var fs = require('fs');

var players = {}; // socket => user
var rooms = {}; // socket => room
var roomsById = {}; // id => room

// Index.html loading
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var io = require('socket.io').listen(server);

// When a client is connected
io.sockets.on('connection', function (socket) {
    var player = new Player(getRandomInt(10), getRandomInt(20), socket);
    players[socket] = player;
    console.log(players[socket].x);
    console.log('Un client est connecté !');
    socket.emit('message', 'Nouveau message');

    socket.on('message', function(message) {
      console.log(message);
    })

    socket.on('createRoom', (data) => { // data used to pass name and players
      var newRoom = new Room(data['name'], socket);
      var id = newRoom.id;
      rooms[socket] = newRoom;
      roomsById[id] = newRoom;
      players[socket].room = newRoom;
      socket.emit('room', '/' + id); // return the route to the room
      // joinRoom(id, socket);
    })

    socket.on('joinRoom', function(id) {
      joinRoom(id, socket);
      const route = io.of('/' + id);
      route.on('connection', function(socket){
        console.log('someone connected');
      });
      nsp.emit('hi', 'everyone!');
    })

    socket.on('disconnect', function() {
      delete players[socket];
      delete rooms[socket];
    });
});

server.listen(9000);

// ---------------------------------------

joinRoom(id, socket) {
  var room = roomsById[id];
  room.addPlayer(players[socket]);
  rooms[socket] = room;
  players[socket].room = room;
}

getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
