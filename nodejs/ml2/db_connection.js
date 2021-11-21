const $S = require("../../static/js/stack.js");
const Logger = require("../static/logger.js");
const File = require("../static/apis/file.js");
// const FS = require("../fsmodule.js");
// const AppConstant = require("../AppConstant.js");

const fs = require("fs");
const mysql = require('mysql');

(function() {
var hostname = "localhost"
var username = "mysqljs";
var password = "mysqljs";
var database = "ftpapp";

var con = mysql.createConnection({
    host: hostname,
    user: username,
    password: password,
    database: database
});

var DbConnection = function(config) {
    return new DbConnection.fn.init(config);
};
DbConnection.fn = DbConnection.prototype = {
    constructor: DbConnection,
    init: function(config) {
        return this;
    }
};
DbConnection.fn.init.prototype = DbConnection.fn;
$S.extendObject(DbConnection);

DbConnection.extend({
    connect: function(callback) {
        con.connect(function(err) {
            if (err) throw err;
            Logger.log("Mysql connection success!");
        });
        con.query("use ftpapp;", function (err, result) {
            if (err) throw err;
            Logger.log("Db selection success!");
            $S.callMethod(callback);
        });
    }
});


DbConnection.extend({
    getResult: function(callback) {
        var sql = "select * from ei_bit_status where ei_id='MURI_S05' and deleted = false;";
        var finalResult = [];
        // Logger.log("Executing query: " + sql);
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            var temp;
            if ($S.isArray(result) && result.length > 0) {
                for(var i=0; i<result.length; i++) {
                    if ($S.isObject(result[i])) {
                        temp = {};
                        for (var key in result[i]) {
                            temp[key] = result[i][key];
                        }
                        temp["1Count"] = (temp["bit_status"].match(/1/g) || []).length;
                        finalResult.push(temp);
                    }
                }
            }
            $S.callMethodV1(callback, finalResult);
        });
        return finalResult;
    },
    updateResult: function(callback, binaryStr) {
        var sql = "UPDATE ei_bit_status SET bit_status='" + binaryStr + "' where ei_id='MURI_S05';";
        // Logger.log("Executing query...");
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            $S.callMethod(callback);
        });
    }
});

module.exports = DbConnection;
})();
