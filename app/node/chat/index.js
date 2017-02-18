var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exec = require('child_process').exec;
var IOs = require('../component/common/io.js');

var IO = new IOs.IO(io);

function transmitIpsStatus() {
    console.log("transmitIpsStatus");
    var data = [];
    var ips = [];
    for (var i=2;i<=254;i++) {
        ips.push(i);
    }
    var resultCount = 0;
    function puts(error, stdout, stderr) {
        console.log("stdout : " + stdout);
        console.log("error : " + error);
        data = [];
        var ip = stdout.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
        var ip_address = ip.length ? ip[0] : stdout;
        console.log("--------Ping done for ip address--------- : " + ip_address);
        if(error) {
            data.push({status:"failure", ip : ip_address});
        } else {
            data.push({status:"success", ip : ip_address});
        }
        resultCount++;
        io.emit('ip_check', data);
        if (resultCount == ips.length) {
            transmitIpsStatus();
        }
    }
    for (var i = 0; i < ips.length; i++) {
        exec("ping -c 2 192.168.1." + ips[i], puts);
    }
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/device_count', function(req, res){
    var data = {"count" : IO.getSocketCount(), "device" : IO.getActiveSocketIds(), 
    "ping" : {"success" : [], "failure" : []}};
    var ips = [1,2,3,4,5,6];
    function puts(error, stdout, stderr, x) {
        console.log("stdout : " + stdout);
        console.log("error : " + error);
        console.log("----------------- : " + x);
        var ip = stdout.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
        if(error) {
            data["ping"]["failure"].push(ip.length ? ip[0] : stdout);
        } else {
            data["ping"]["success"].push(ip.length ? ip[0] : stdout);
        }
        if (data.ping.success.length + data.ping.failure.length  == ips.length) {
            res.send(data);
        }
    }
    for (var i = 0; i < ips.length; i++) {
        exec("ping -c 2 192.168.1." + ips[i], puts, ips[i]);
    }
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
    // socket.on('ip_check', function(msg){
        
    // });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
setTimeout(function() {
    transmitIpsStatus();
}, 2000);