const $S = require("../../static/js/stack.js");
const FS = require("../static/fsmodule.js");

var dgram = require('dgram');

var VDU = dgram.createSocket('udp4');
var MLK = dgram.createSocket('udp4');

var UDP = require("./udp");


/**
 * Receive data from VDU on port 60001 --> forward to port 60000 MLK
 * now receive data from MLK --> forward to VDU port 
 * */

var VDULocalPort = 59998;
var VDURemotePort = 60005;

var MLKLocalPort = 60000;
var MLKRemotePort = 60000;

var VDUPortLocal = 0;

UDP.onReceive(MLK, function(msg, ip, port, length) {
    if (port === MLKLocalPort) {
        return;
    }
    // console.log("****************************");
    // console.log("Received from MLK: " + ip + ":" + port + ", size: " + length);
    // console.log($S.convertHexToStr(msg));
    // console.log(msg.toString());
    if (VDURemotePort > 0) {
        UDP.sendBufferData(VDU, msg, VDURemotePort, ip, function() {});
    } else {
        console.log("Invalid VDURemotePort: " + VDURemotePort);
    }
});


UDP.onReceive(VDU, function(msg, ip, port, length) {
    if (port === VDULocalPort) {
        return;
    }
    // console.log("----------------------------");
    // console.log("Received from VDU: " + ip + ":" + port + ", size: " + length);
    VDURemotePort = port;
    console.log($S.convertHexToStr(msg));
    // console.log(msg.toString());
    UDP.sendBufferData(MLK, msg, MLKRemotePort, ip, function() {});
});


FS.readJsonFile("config.json", {}, function(jsonData) {
    if ($S.isNumber(jsonData["intercept.VDULocalPort"])) {
        VDULocalPort = jsonData["intercept.VDULocalPort"];
    }
    if ($S.isNumber(jsonData["intercept.VDURemotePort"])) {
        VDURemotePort = jsonData["intercept.VDURemotePort"];
    }
    if ($S.isNumber(jsonData["intercept.MLKLocalPort"])) {
        MLKLocalPort = jsonData["intercept.MLKLocalPort"];
    }
    if ($S.isNumber(jsonData["intercept.MLKRemotePort"])) {
        MLKRemotePort = jsonData["intercept.MLKRemotePort"];
    }
    VDU.bind(VDULocalPort);
    MLK.bind(MLKLocalPort);
    console.log("VDU config: " + VDULocalPort);
    console.log("MLK config: " + MLKLocalPort);
});

