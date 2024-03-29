const $S = require("../../static/js/stack.js");
const FS = require("../static/fsmodule.js");
const Logger = require("../static/logger-v2.js");

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

var VDURxCount = 0;
var MLKRxCount = 0;
var DT = $S.getDT();
var dateTime = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss", "/");

function getLogStr(str) {
    var finalStr = "";
    if ($S.isStringV2(str)) {
        for (var i=0; i<str.length; i++) {
            if (i>29 && str[i] !== ' ') {
                finalStr += str[i];
            }
        }
    }
    return finalStr;
}
function removeSpace(str) {
    var finalStr = "";
    if ($S.isStringV2(str)) {
        for (var i=0; i<str.length; i++) {
            if (str[i] !== ' ') {
                finalStr += str[i];
            }
        }
    }
    finalStr = $S.changeBaseV2(finalStr, 16, 2, 4);
    return finalStr;
}
UDP.onReceive(MLK, function(msg, ip, port, length) {
    if (port === MLKLocalPort) {
        return;
    }
    MLKRxCount++;
    if (VDURemotePort > 0) {
        var logStr = "MLK--" + MLKRxCount + "--" + ip + "--" + $S.convertHexToStr(msg);
        logStr = removeSpace($S.convertHexToStr(msg));
        Logger.log(logStr, function(status) {
            UDP.sendBufferData(VDU, msg, VDURemotePort, ip, function() {});
        });
    } else {
        console.log("Invalid VDURemotePort: " + VDURemotePort);
    }
});


UDP.onReceive(VDU, function(msg, ip, port, length) {
    if (port === VDULocalPort) {
        return;
    }
    VDURxCount++;
    VDURemotePort = port;
    console.log(msg);
    Logger.log("VDU--" + VDURxCount + "--" + ip + "--" + $S.convertHexToStr(msg), function(status) {
        UDP.sendBufferData(MLK, msg, MLKRemotePort, ip, function() {})
    });
    // console.log("Received from VDU: " + ip + ":" + port + ", size: " + length);
});

function start() {
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
        Logger.log(dateTime + "\nVDULocalPort: " + VDULocalPort, function(status) {
            Logger.log("MLKLocalPort: " + MLKLocalPort);
            VDU.bind(VDULocalPort);
            MLK.bind(MLKLocalPort);
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

