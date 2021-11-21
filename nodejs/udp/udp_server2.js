var dgram = require('dgram');

var server = dgram.createSocket('udp4');

var UDP = require("./udp");

UDP.onReceive(server, function(msg, ip, port, length) {
    console.log("udp_server2: " + ip + ":" + port);
    console.log("udp_server2: " + msg);
    console.log(msg);
    UDP.sendData(server, msg, port, ip);
});

server.bind(59999);
