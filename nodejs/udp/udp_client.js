const dgram = require('dgram');
const udpClient = dgram.createSocket('udp4');
const readline = require("readline");

const $S = require("../../static/js/stack.js");
const UDP = require("./udp");
const FS = require("../static/fsmodule.js");
const Logger = require("../static/logger-v2.js");


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var isEchoServer = true;
var localPort = 60000;
var remotePort = 60002;
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
        text = removeSpace(text);
        $S.callMethodV1(callback, text);
    });
}
function endProcess() {
    process.exit(0);
}

function textReadCallback(text) {
    if (text !== "bye") {
        var t1 = [];
        var t2 = text.split(" ");
        for (var i=0; i<t2.length; i++) {
            t1.push($S.changeBase(t2[i], 16, 10));
        }
        UDP.sendData(udpClient, text, remotePort, serverHost);
        if (isEchoServer === false) {
            readUserInput(textReadCallback);
        }
    } else {
        console.log("BYE BYE!!!");
        endProcess();
    }
}

UDP.onReceive(udpClient, function(msg, ip, port, length) {
    console.log("udpClient");
    // Logger.log(ip+":"+port+":"+$S.convertHexToStr(msg));
    console.log("msg: " + msg.toString());
    if (isEchoServer) {
        readUserInput(textReadCallback);
    }
});

function start() {
    FS.readJsonFile("config.json", {}, function(jsonData) {
        if ($S.isBoolean(jsonData["client.isEchoServer"])) {
            isEchoServer = jsonData["client.isEchoServer"];
        }
        if ($S.isNumber(jsonData["client.localPort"])) {
            localPort = jsonData["client.localPort"];
        }
        if ($S.isNumber(jsonData["client.remotePort"])) {
            remotePort = jsonData["client.remotePort"];
        }
        if ($S.isNumber(jsonData["client.serverHost"])) {
            serverHost = jsonData["client.serverHost"];
        }
        Logger.log("Client started: localPort=" + localPort + ", remotePort=" + remotePort, function() {
            udpClient.bind(localPort);
            readUserInput(textReadCallback);
        });
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
