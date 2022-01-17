var net = require('net');
var readline = require("readline");

var $S = require("../../static/js/stack.js");
var TCP = require("./tcp");
var FS = require("../static/fsmodule.js");
var Logger = require("../static/logger-v2.js");

// var TCP = TCPService.getService();

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var localPort = 8086;
var remotePort = 8087;
var serverHost = "127.0.0.1";

function removeSpace(text) {
    var t = "";
    for (var i=0; i<text.length;i++) {
        if (text.charAt(i) === ' ') {
            continue;
        } else {
            t += text.charAt(i);
        }
    }
    return t;
}

function readUserInput(callback) {
    console.log("----------------------------------------");
    rl.question("Enter text: ", function(text) {
        // text = removeSpace(text);
        $S.callMethodV1(callback, text);
    });
}
function endProcess() {
    process.exit(0);
}
function sendData(data) {
    if (!$S.isStringV2(data)) {
        readUserInput(textReadCallback);
        return;
    }
    var tcpClient = new net.Socket();
    tcpClient.connect(localPort, serverHost, function() {
        TCP.register(tcpClient, onReceive, onClose, function(remoteAddress, remotePort) {
            console.log("remoteAddress:"+remoteAddress+", remotePort:"+remotePort);
            TCP.sendData(tcpClient, data, remotePort, serverHost);
            setTimeout(function() {
                TCP.close(tcpClient);
            }, 200);
        });
    });
}
function textReadCallback(text) {
    if (text !== "bye") {
        sendData(text);
    } else {
        console.log("BYE BYE!!!");
        endProcess();
    }
}

function onReceive(sock, msg, ip, port, length) {
    console.log("tcpClient");
    console.log("msg: " + msg);
}

function onClose(sock, remoteAddress, remotePort) {
    console.log("Connection close: " + remoteAddress + ":" + remotePort);
    readUserInput(textReadCallback);
}
function start() {
    FS.readJsonFile("config.json", {}, function(jsonData) {
        if ($S.isNumber(jsonData["client.localPort"])) {
            localPort = jsonData["client.localPort"];
        }
        if ($S.isNumber(jsonData["client.remotePort"])) {
            remotePort = jsonData["client.remotePort"];
        }
        if ($S.isNumber(jsonData["client.serverHost"])) {
            serverHost = jsonData["client.serverHost"];
        }
        readUserInput(textReadCallback);
    });
}

Logger("log/").setLogDir().enableLoging(function(status) {
    if (status) {
        console.log("Logging enable.");
    } else {
        console.log("Error in log enabling.");
    }
    start();
});
