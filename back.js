var Player = require('./components/Player.js');
var Room = require('./components/Room.js');
var http = require('http');
var fs = require('fs');
var path = require('path');

var players = {}; // socket => user
var rooms = {}; // socket => room
var roomsById = {}; // id => room

var staticBasePath = './';
// Index.html loading
var server = http.createServer(function (req, res) {
    var resolvedBase = path.resolve(staticBasePath);
    var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    var fileLoc = path.join(resolvedBase, safeSuffix);
    fs.readFile(fileLoc, function (err, data) {
        if (err) {
            res.writeHead(404, 'Not Found');
            res.write('404: File Not Found!');
            return res.end();
        }
        res.statusCode = 200;
        res.write(data);
        return res.end();
    });
});

var io = require('socket.io').listen(server);

// When a client is connected
io.of('/').on('connection', function (socket) {
    var player = new Player(getRandomInt(10), getRandomInt(20), socket);
    players[socket] = player;
    console.log('[+] Un client est connecté !');

    emitRooms(socket, roomsById);

    socket.on('message', function (message) {
        console.log(message);
    });

    socket.on('createRoom', (id) => {
        if (roomsById[id] != null) {
            socket.emit('roomExists', true);
            return;
        }
        room(id);


        setInterval(() => {
            let list = [];
            for (let player of roomsById[id].players) {
                if (player && Number.isInteger(player.id) && !player.lost)
                    list.push(player.toJSON());
            }
            io.of(id).emit('location', list);
        }, 30);

        setInterval(() => {
            io.of(id).emit('wave', {force: randomIntFromInterval(20, 30)})
            //console.log('wave');
        }, 5000);


        var newRoom = new Room(id);
        roomsById[id] = newRoom;
        //players[socket].room = newRoom;
        //socket.emit('createRoomSuccess', 'The room has been created succesfully.');
        socket.broadcast.emit('emptyList', true);
        socket.emit('emptyList', true);
        emitRooms(socket, roomsById);
    });

    socket.on('joinRoom', (id) => {
        if (roomsById[id] && !roomsById[id].players[socket]){
            console.log('room exists');
            socket.join(id);
            joinRoom(id, socket);
        }
    });

    socket.on('disconnect', function () {
        delete players[socket];
        delete rooms[socket];
    });
});
let room = (id) => {
    io.of('/' + id).on('connection', (socket) => { // Connection to the game room
        
        console.log('✅ Connection to the room ' + id + ' successed');
        socket.on('location', (obj) => {
            if (players[socket]){
                players[socket].id = obj.id;
                players[socket].x = obj.x;
                players[socket].y = obj.y;
                players[socket].velocity = obj.velocity;
                players[socket].angle = obj.angle;
                //console.log(players[socket].toJSON());
            }
        });
        socket.on('lost', (obj) => {
            players[socket].lost = true;
            console.log(players[socket].id + ' have lost.');
        });
    });
}



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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
