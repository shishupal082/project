const $S = require("../libs/stack.js");
const Logger = require("./logger-v2.js");

const mysql = require('mysql');

(function() {
var HOSTNAME = "localhost"
var USERNAME = "mysqljs";
var PASSWORD = "mysqljs";
var DATABASE = "ftpapp";
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
            HOSTNAME = config.hostname;
            USERNAME = config.username;
            PASSWORD = config.password;
            DATABASE = config.database;
            setDbConfig = true;
        }
        return true;
    },
    getDbConnection: function(callback) {
        if (setDbConfig) {
            var dbConfig = {
                host: HOSTNAME,
                user: USERNAME,
                password: PASSWORD,
                database: DATABASE
            };
            var con = mysql.createConnection(dbConfig);
            try {
                con.connect(function(err) {
                    if (err) {
                        return;
                    }
                    Logger.log("Mysql connection success!", null, true);
                });
                con.query("use "+ DATABASE + ";", function (err, result) {
                    if (err) {
                        Logger.log("Error in db connection!", null, true);
                        $S.callMethodV1(callback, null);
                        return;
                    }
                    Logger.log("DB selection success!", null, true);
                    $S.callMethodV1(callback, con);
                });
            } catch(e) {
                Logger.log("Error in db connection!", null, true);
                $S.callMethodV1(callback, null);
            }
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

var Q = $S.getQue();

DB.extend({
    _executeQuery: function() {
        if (Q.getSize() < 1) {
            return;
        }
        var self = this;
        var temp = Q.Deque();
        var dbObj, query, callback;
        if ($S.isArray(temp) && temp.length === 3) {
            dbObj = temp[0];
            query = temp[1];
            callback = temp[2];
            try {
                dbObj.query(query, function(err, status) {
                    if (err) {
                        self.closeDbConnection(dbObj);
                        $S.callMethodV1(callback, null);
                        return;
                    }
                    $S.callMethodV1(callback, dbObj);
                    self._executeQuery();
                });
            } catch(e) {
                Logger.log("Error in query execute.", function(status) {
                    DB.getDbConnection(function(dbCon) {
                        if (dbCon === null) {
                            return;
                        }
                        Logger.log("New DB connection created.", null, true);
                        self.executeQuery(dbCon, query, callback);
                    });
                }, true);
                return;
            }
        }
    },
    executeQuery: function(dbObj, query, callback) {
        var r = Q.Enque([dbObj, query, callback]);
        if (r === 1) {
            this._executeQuery();
        } else {
            $S.callMethodV1(callback, null);
        }
    }
})

module.exports = DB;
})();
