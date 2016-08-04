var IO = (function() {
    function IO(io){
        this.io = io;
    }
    IO.prototype.getSocketCount = function() {
        var clients = this.io.eio.clients;
        var count = 0;
        for (var socket_id in clients) {
            count++;
        }
        return count;
    };
    IO.prototype.getActiveSocketIds = function() {
        var clients = this.io.eio.clients;
        var socketIds = [];
        for (var socketId in clients) {
            socketIds.push(socketId);
        }
        return socketIds;
    };
    return IO;
})();

var CurrentSocket = (function() {
    function Socket(socket){
        this.socket = socket;
    }
    Socket.prototype.getId = function() {
        var socketId = this.socket.id;
        return socketId.replace("/#", "");
    };
    return Socket;
})();

module.exports = {
	IO : IO,
	Socket : CurrentSocket
};