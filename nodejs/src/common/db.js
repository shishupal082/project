const $S = require("../libs/stack.js");
const Logger = require("./logger-v2.js");

const mysql = require('mysql');

(function() {
var hostname = "localhost"
var username = "mysqljs";
var password = "mysqljs";
var database = "ftpapp";
var setDbConfig = false;

var DB = function(config) {
    return new DB.fn.init(config);
};
DB.fn = DB.prototype = {
    constructor: DB,
    init: function(config) {
        return this;
    }
};
DB.fn.init.prototype = DB.fn;
$S.extendObject(DB);

DB.extend({
    setDbParameter: function(config) {
        setDbConfig = false;
        if ($S.isObject(config)) {
            if (!$S.isStringV2(config.hostname)) {
                return false;
            }
            if (!$S.isStringV2(config.username)) {
                return false;
            }
            if (!$S.isStringV2(config.password)) {
                return false;
            }
            if (!$S.isStringV2(config.database)) {
                return false;
            }
        }
        setDbConfig = true;
        return true;
    },
    getDbConnection: function(callback) {
        if (setDbConfig) {
            var con = mysql.createConnection({
                host: hostname,
                user: username,
                password: password,
                database: database
            });
            con.connect(function(err) {
                if (err) throw err;
                Logger.log("Mysql connection success!", null, true);
            });
            con.query("use "+ database + ";", function (err, result) {
                if (err) throw err;
                Logger.log("DB selection success!", null, true);
                $S.callMethodV1(callback, con);
            });
        } else {
            Logger.log("DB config is not set properly.", null, true);
            $S.callMethodV1(callback, null);
        }
    },
    closeDbConnection: function(dbObj) {
        if (dbObj === null) {
            Logger.log("Erorr in db connection close.", null, true);
        } else {
            dbObj.end();
            Logger.log("DB connection closed.", null, true);
        }
    }
});

module.exports = DB;
})();
