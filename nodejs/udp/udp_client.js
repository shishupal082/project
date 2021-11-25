const dgram = require('dgram');
const udpClient = dgram.createSocket('udp4');
const readline = require("readline");

const $S = require("../../static/js/stack.js");
const UDP = require("./udp");
const FS = require("../static/fsmodule.js");


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var isEchoServer = true;
var localPort = 59996;
var remotePort = 60002;
var serverHost = "127.0.0.1";

function readUserInput(callback) {
    console.log("----------------------------------------");
    rl.question("Enter text: ", function(text) {
        $S.callMethodV1(callback, text);
    });
}

function textReadCallback(text) {
    if (text !== "bye") {
        UDP.sendData(udpClient, text, remotePort, serverHost);
        if (isEchoServer === false) {
            readUserInput(textReadCallback);
        }
    } else {
        console.log("BYE BYE!!!");
        process.exit(0);
    }
}

UDP.onReceive(udpClient, function(msg, ip, port, length) {
    console.log("udpClient");
    console.log("msg: " + msg.toString());
    if (isEchoServer) {
        readUserInput(textReadCallback);
    }
});


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
    udpClient.bind(localPort);
    console.log("Client started: localPort=" + localPort + ", remotePort=" + remotePort);
    readUserInput(textReadCallback);
});



