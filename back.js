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
io.of('/').on('connection', function (socket) {
    var player = new Player(getRandomInt(10), getRandomInt(20), socket);
    players[socket] = player;
    console.log('[+] Un client est connecté !');

    emitRooms(socket, roomsById);

    socket.on('message', function(message) {
      console.log(message);
    })

    socket.on('createRoom', (id) => {
      if (roomsById[id] != null) {
        socket.emit('roomExists', true);
        return;
      }
      var newRoom = new Room(id, socket);
      rooms[socket] = newRoom;
      roomsById[id] = newRoom;
      players[socket].room = newRoom;
      //socket.emit('createRoomSuccess', 'The room has been created succesfully.');
      socket.broadcast.emit('emptyList', true);
      socket.emit('emptyList', true);
      emitRooms(socket, roomsById);
    })

    socket.on('joinRoom', function(id) {
      if (roomsById[id] != null && roomsById[id].players[socket] == null) {
        console.log("OK");

        const route = io.of('/' + id);
        route.on('connection', function(socket){ // Connection to the game room
          socket.join(id);
          joinRoom(id, socket);
          socket.broadcast.emit('joinRoomSuccess', 'Connection to the room ' + id + ' successed');
          socket.emit('joinRoomSuccess', 'Connection to the room ' + id + ' successed');
        });

        route.on('play', () => {

        })

        route.on('stop', () => {

        })

        route.on('movePlayer', (socketPlayer, x, y) => {
          players[socketPlayer].setXY(x, y);
          socket.broadcast.emit('movePlayer', socketPlayer, x, y);
        })
      }
      else
        socket.emit('joinRoomFail', 'Ce jeu n\'existe pas encore');
    })

    socket.on('disconnect', function() {
      delete players[socket];
      delete rooms[socket];
    });
});

server.listen(9000);

// ---------------------------------------

function emitRooms(socket, rooms) { // O(n) so moderate
  for (const [key, value] of Object.entries(rooms)) {
    socket.broadcast.emit('roomsList', value.name);
    socket.emit('roomsList', value.name);
  }
}

function joinRoom(id, socket) {
  var room = roomsById[id];
  room.addPlayer(players[socket]);
  rooms[socket] = room;
  players[socket].room = room;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
