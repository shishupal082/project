var $S = require("../libs/stack.js");
var Logger = require("../common/logger-v2.js");

(function() {
var TCP = function(config) {
    return new TCP.fn.init(config);
};
TCP.fn = TCP.prototype = {
    constructor: TCP,
    init: function(config) {
        this.config = config;
        return this;
    }
};
TCP.fn.init.prototype = TCP.fn;
$S.extendObject(TCP);
TCP.extend({
    register: function(tcpSocket, onReceiveCallback, onCLose, callback) {
        tcpSocket.on("data", function(data, rinfo) {
            if ($S.isFunction(onReceiveCallback)) {
                onReceiveCallback(tcpSocket, data.toString(), tcpSocket.remoteAddress, tcpSocket.remotePort, data.length);
            }
        });
        tcpSocket.on('error', function(error) {
            Logger.log("Error in TCP.");
            Logger.log(error);
        });
        tcpSocket.on("close", function(data) {
            $S.callMethodV3(onCLose, tcpSocket, tcpSocket.remoteAddress, tcpSocket.remotePort);
        });
        $S.callMethodV2(callback, tcpSocket.remoteAddress, tcpSocket.remotePort);
    },
    sendData: function(tcpSocket, text, port, ip, callback) {
        if (!$S.isStringV2(text)) {
            $S.callMethod(callback);
            return;
        }
        try {
            tcpSocket.write(text.trim());
        } catch(e) {
            Logger.log("Error in sending data.");
            Logger.log(e);
        }
    },
    close: function(tcpSocket, connectionList) {
        try {
            var remoteAddress = tcpSocket.remoteAddress;
            var remotePort = tcpSocket.remotePort;
            if ($S.isArray(connectionList)) {
                if (connectionList.indexOf(remoteAddress+":"+remotePort) < 0) {
                    return;
                    // Logger.log("Connection already closed");
                }
            }
            Logger.log("Closing: " + remoteAddress + ":" + remotePort);
            tcpSocket.destroy();
        } catch(e) {
            Logger.log("Error in closing connection.");
            Logger.log(e);
        }
    }
});

module.exports = TCP;

})();





