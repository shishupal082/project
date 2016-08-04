var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var IOs = require('../component/common/io.js');

var IO = new IOs.IO(io);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/device_count', function(req, res){
    res.send({"count" : IO.getSocketCount(), "device" : IO.getActiveSocketIds()});
});

io.on('connection', function(socket){
    var currentSocket = new IOs.Socket(socket);
    console.log('user connected : count : ' + IO.getSocketCount() + ', socket_id : ' + currentSocket.getId());
    socket.on('disconnect', function(){
        console.log('user disconnected : socket_id : ' + currentSocket.getId());
    });
    socket.on('chat_message', function(msg){
        console.log('chat_message source : '+ currentSocket.getId()+', message: ' + msg);
        console.log('chat_message destination count : ' + IO.getSocketCount() + ", sockets : " + IO.getActiveSocketIds().join(", "));
        io.emit('chat_message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
