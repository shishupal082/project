const $S = require("../../static/js/stack.js");


(function() {
var UDP = function(config) {
    return new UDP.fn.init(config);
};
UDP.fn = UDP.prototype = {
    constructor: UDP,
    init: function(config) {
        this.config = config;
        return this;
    }
};
UDP.fn.init.prototype = UDP.fn;
$S.extendObject(UDP);
UDP.extend({
    onReceive: function(udpObj, onReceiveCallback) {
        udpObj.on('message', function(msg, rinfo) {
            if ($S.isFunction(onReceiveCallback)) {
                onReceiveCallback(msg, rinfo.address, rinfo.port, rinfo.size, rinfo);
            }
        });
    },
    sendData: function(udpObj, text, port, ip, callback) {
        udpObj.send(Buffer.from(text), port, ip, function(err, bytes) {
            if (err) {
                console.log(err);
            }
            if ($S.isFunction(callback)) {
                callback(err, bytes);
            }
        });
    },
    sendBufferData: function(udpObj, bufferData, port, ip, callback) {
        udpObj.send(bufferData, port, ip, function(err, bytes) {
            if (err) {
                console.log(err);
            }
            if ($S.isFunction(callback)) {
                callback(err, bytes);
            }
        });
    }
});

module.exports = UDP;

})();





