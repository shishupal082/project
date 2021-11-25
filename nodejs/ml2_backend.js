const AppConstant = require("./static/AppConstant.js");
const config = require("./static/config.js");
const $S = require("../static/js/stack.js");
const Logger = require("./static/logger.js");
const File = require("./static/apis/file.js");

const Script = require("./ml2/script.js");
const DbConnection = require("./ml2/db_connection.js");

DbConnection.connect(function() {
    Script.start(DbConnection);
});

