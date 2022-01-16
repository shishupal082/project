var dgram = require('dgram');
var SERVER = dgram.createSocket('udp4');

var $S = require("../static/js/stack.js");
var UDP = require("./udp/udp");
var UdpHandler = require("./udp/common/UdpHandler");
var Logger = require("./static/logger-v2.js");

var localPort = 64000;
UDP.onReceive(SERVER, function(msg, ip, port, length) {
    Logger.log("-----------------------------------------------------------------------------", function(status) {
        Logger.log("Request: " + ip + ":" + port, function(status) {
            UdpHandler.HandleRequest(msg, ip, port, length, function(responseString) {
                Logger.log("Response: " + responseString);
                UDP.sendData(SERVER, responseString, port, ip);
            });
        });
    });
});
Logger("C:/java/server_udp_port" + localPort + "/").setLogDir().enableLoging(function(status) {
    if (status) {
        console.log("Logging enable.");
    } else {
        console.log("Error in log enabling.");
    }
    SERVER.bind(localPort);
    Logger.log("Server started on port: " + localPort);
});

