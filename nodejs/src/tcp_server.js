var net = require('net');

var $S = require("./libs/stack.js");
var TcpHandler = require("./tcp/TcpHandler");
var Logger = require("./common/logger-v2.js");
var FS = require("./common/fsmodule.js");
var TCP = require("./tcp/tcp.js");

var args = FS.readArgs();
var configFilePath = "";

if (args.length > 0 && $S.isStringV2(args[0])) {
    configFilePath = args[0];
}
var SERVER = net.createServer();
var localPort = 8086;
var HOST = "127.0.0.1";

var socket = {};
var lineSepratorString = "-----------------------------------------------------------------------------";
var connectionList = [];
var logStr;
function onReceive(sock, msg, ip, port, length) {
    Logger.log(port + ": Request: " + ip + ":" + port + ",length: " + length);
    TcpHandler.HandleRequest(msg, ip, port, length, function(responseString) {
        if ($S.isStringV2(responseString)) {
            if (responseString.length < 512) {
                logStr = responseString;
            } else {
                logStr = "Length: " + responseString.length;
            }
        } else {
            logStr = responseString;
        }
        Logger.log(port + ": Response: " + logStr);
        TCP.sendData(sock, responseString, port, ip);
        Logger.log(lineSepratorString);
        setTimeout(function(socket) {
            TCP.close(sock, connectionList);
        }, 3000, socket);
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

function start(jsonData) {
    var log_filepath = "";
    if ($S.isStringV2(jsonData["log_filepath"])) {
        log_filepath = jsonData["log_filepath"];
    }
    Logger(log_filepath).setLogDir().enableLoging(function(status) {
        if (status) {
            Logger.log("Logging enable.");
        } else {
            Logger.log("Error in log enabling.");
        }
        if ($S.isNumber(jsonData["localPort"]) && jsonData["localPort"] > 1000 && jsonData["localPort"] < 10000) {
            localPort = jsonData["localPort"];
        }
        SERVER.listen(localPort, HOST, () => {
            Logger.log("TCP Server started on port: " + localPort);
            Logger.log(lineSepratorString, true);
        });
    });
}

FS.readJsonFile(configFilePath, null, function(jsonData) {
    if ($S.isObjectV2(jsonData)) {
        Logger.log("tcp_server: Config data read success.");
        TcpHandler.handleConfigData(jsonData);
        start(jsonData);
    } else {
        Logger.log("Invalid config data: " + configFilePath);
    }
});

