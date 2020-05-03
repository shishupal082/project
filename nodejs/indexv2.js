const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require("fs");
const path = require("path");

const AppConstant = require("./static/AppConstant.js");
const config = require("./static/config.js");
const $S = require("../static/js/stack.js");
const Logger = require("./static/logger.js");
const Get = require("./static/apis/getapi.js");
const File = require("./static/apis/file.js");

const hostname = config.hostname;
const port = config.port;

// var filePath = "/nodejs/package.json";
// var file = File.getFile(filePath);
// console.log(file.getAll());

app.use(express.static(AppConstant.PUBLIC_DIR));

var allowedOrigins = [];

allowedOrigins.push("http://localhost");       // php
allowedOrigins.push("http://localhost:8080");  // java WebApp
allowedOrigins.push("http://localhost:9000");  // reactjs

function logCrossOriginRequest(req, res) {
    var logText = "";
    var origin = req.headers.origin;
    if (origin === AppConstant.UNDEFINED) {
        return 1;
    }
    if (allowedOrigins.indexOf(origin) >= 0) {
        logText += "Requester(Allowed): " + origin;
    } else {
        logText += "Requester(Not Allowed): " + origin;
    }
    logText += req.url;
    logText += ", " + req.method;
    Logger.log(logText);
}

app.use(function(req, res, next) {
    Logger.resetLoggerKey();
    Logger.log("Request: " + req.url + ", " + req.method);
    var origin = req.headers.origin;
    logCrossOriginRequest(req, res);
    if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    next();
});



function loadIndexPage(req, res) {
    var filePath = "index.html";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.TEXT_HTML);
    fs.createReadStream(filePath).pipe(res);
}

app.get('/', function(req, res){
    loadIndexPage(req, res);
});

app.get('/index.html', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get('/indexData.json', function(req, res, next){
    var filePath = "./static/data/indexData.json";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    fs.createReadStream(filePath).pipe(res);
});
app.get('/reactIndexData.json', function(req, res, next){
    var filePath = "./static/data/reactIndexData.json";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    fs.createReadStream(filePath).pipe(res);
});
app.get('/json_data', function(req, res){
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    var response = {"status": "SUCCESS"};
    // res.end(JSON.stringify(response));
    res.json(response);
});

app.get('/twitter', function(req, res, next){
    var api = "https://api.twitter.com/1.1/search/tweets.json";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);

    var response = {"status": "SUCCESS"};
    Get.api(api, $S.getUniqueNumber(), function(resp) {
        res.end(JSON.stringify(resp));
    });
});

app.get('/nasa', function(req, res, next){
    var api = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    Get.api(api, $S.getUniqueNumber(), function(resp) {
        res.end(JSON.stringify(resp));
    });
});

app.get('/api', function(req, res, next) {
    var api = req.query.api;
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    var response = {};
    if (api) {
        Get.api(api, $S.getUniqueNumber(), function(resp) {
            response["response"]=resp;
            res.end(JSON.stringify(response));
        });
    } else {
        var response = {"STATUS": "FAILURE"};
        response["REASON"] = "Invalid query parameter (api)";
        res.end(JSON.stringify(response));
    }
});

app.get('/file', function(req, res, next) {
    var filePath = req.query.file;
    res.statusCode = 200;
    var response = {};
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    if (filePath) {
        var file = File.getFile(filePath);
        console.log(file.getAll());
        if (file.isFile()) {
            res.setHeader(AppConstant.CONTENT_TYPE,
                file.getFileMediaType(AppConstant.TEXT_PLAIN));
            fs.createReadStream(file.getPath()).pipe(res);
        } else {
            response = {"STATUS": "FAILURE"};
            response["REASON"] = "Invalid filename";
            console.log(response);
            res.end(JSON.stringify(response));
        }
    } else {
        response = {"STATUS": "FAILURE"};
        response["REASON"] = "Invalid query parameter (file)";
        console.log(response);
        res.end(JSON.stringify(response));
    }
});

app.get('*', function(req, res){
    Logger.log("Request: " + req.url + ", " + req.method + ", 404 not found.");
    res.statusCode = 404;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.TEXT_HTML);
    res.end('<center>Invalid url.</center>');
});

http.listen(port, hostname, function(){
  Logger.log(`***server running at http://${hostname}:${port}***`);
});
