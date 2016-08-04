var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index_v3.html');
});

io.on('connection', function(socket){
  console.log('user connected : socket id : ' + socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected : socket id : ' + socket.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
