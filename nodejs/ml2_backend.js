// const express = require('express');
// const app = express();
// const http = require('http').Server(app);
const fs = require("fs");
// const path = require("path");
// const bodyParser = require("body-parser");

const AppConstant = require("./static/AppConstant.js");
const config = require("./static/config.js");
const $S = require("../static/js/stack.js");
const Logger = require("./static/logger.js");
// const Get = require("./static/apis/getapi.js");
const File = require("./static/apis/file.js");

const Script = require("./ml2/script.js");
const DbConnection = require("./ml2/db_connection.js");


// const hostname = config.hostname;
// const port = config.port;

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json());


// var allowedOrigins = [];

// allowedOrigins.push("http://localhost");       // php
// allowedOrigins.push("http://localhost:8080");  // java WebApp
// allowedOrigins.push("http://localhost:9000");  // reactjs

// function logCrossOriginRequest(req, res) {
//     var logText = "";
//     var origin = req.headers.origin;
//     if (origin === AppConstant.UNDEFINED) {
//         return 1;
//     }
//     if (allowedOrigins.indexOf(origin) >= 0) {
//         logText += "Requester(Allowed): " + origin;
//     } else {
//         logText += "Requester(Not Allowed): " + origin;
//     }
//     logText += req.url;
//     logText += ", " + req.method;
//     Logger.log(logText);
// }

// app.use(function(req, res, next) {
//     Logger.resetLoggerKey();
//     Logger.log("Request: " + req.url + ", " + req.method);
//     var origin = req.headers.origin;
//     logCrossOriginRequest(req, res);
//     if(allowedOrigins.indexOf(origin) > -1){
//        res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// });

// app.get('/get_bit_status', function(req, res, next) {
//     var api = req.query.api;
//     res.statusCode = 200;
//     res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
//     var response = {"STATUS": "SUCCESS"};
//     DbConnection.getResult(function(result) {
//         // console.log(result);
//         response["data"] = result;
//         res.end(JSON.stringify(response));
//     });
// });

// http.listen(port, hostname, function(){
//     Logger.log("Available urls: /get_bit_status");
    
//     Logger.log(`***server running at http://${hostname}:${port}, ${__dirname}***`);
// });

DbConnection.connect(function() {
	Script.start(DbConnection);
});

