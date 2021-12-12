var $S = require("../../static/js/stack.js");
var UDP = require("./udp");
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
const FS = require("../static/fsmodule.js");



var localPort = 60002;

UDP.onReceive(server, function(msg, ip, port, length, rinfo) {
    console.log(rinfo);
    console.log(msg);
    console.log($S.convertHexToStr(msg));
    console.log(msg.toString());

    var str = '';
    var binStr = $S.convertHexToBin(msg);
    for (var i = 0; i < binStr.length; i++) {
        console.log(i + ") " + binStr[i]);
    }
    UDP.sendBufferData(server, msg, port, ip);
});


FS.readJsonFile("config.json", {}, function(jsonData) {
    if ($S.isNumber(jsonData["server.localPort"])) {
        localPort = jsonData["server.localPort"];
    }
    server.bind(localPort);
    console.log("Server started on port: " + localPort);
});


