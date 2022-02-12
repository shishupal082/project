var net = require('net');

var $S = require("../static/js/stack.js");
var UdpHandler = require("./udp/common/UdpHandler");
var Logger = require("./static/logger-v2.js");
var TCP = require("./tcp/tcp.js");

var SERVER = net.createServer();
var localPort = 8086;
var HOST = "127.0.0.1";

var socket = {};
var lineSepratorString = "-----------------------------------------------------------------------------";
var connectionList = [];
var logStr;
function onReceive(sock, msg, ip, port, length) {
    Logger.log(port + ": Request: " + ip + ":" + port + ",length: " + length, function(status) {
        UdpHandler.HandleRequest(msg, ip, port, length, function(responseString) {
            if ($S.isStringV2(responseString)) {
                if (responseString.length < 512) {
                    logStr = responseString;
                } else {
                    logStr = "Length: " + responseString.length;
                }
            } else {
                logStr = responseString;
            }
            Logger.log(port + ": Response: " + logStr, function(status) {
                TCP.sendData(sock, responseString, port, ip);
                Logger.log(port + ": " + lineSepratorString);
                setTimeout(function(socket) {
                    TCP.close(sock, connectionList);
                }, 3000, socket);
            });
        });
    });
}

function onClose(sock, ip, port) {
    connectionList = connectionList.filter(function(el, i, arr) {
        if (ip+":"+port === el) {
            return false;
        }
        return true;
    });
    Logger.log(port + ": Connection closed: " + ip + ":" + port);
}

SERVER.on("connection", function(sock) {
    TCP.register(sock, onReceive, onClose, function(remoteAddress, remotePort) {
        connectionList.push(remoteAddress+":"+remotePort);
        Logger.log(remotePort + ": CONNECTED: " + remoteAddress + ":" + remotePort);
    });
});

Logger("C:/java/server_tcp_port" + localPort + "/").setLogDir().enableLoging(function(status) {
    if (status) {
        console.log("Logging enable.");
    } else {
        console.log("Error in log enabling.");
    }
    SERVER.listen(localPort, HOST, () => {
        Logger.log("TCP Server started on port: " + localPort, function(status) {
            Logger.log(lineSepratorString);
        });
    });
});


