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

const hostname = config.hostname;
const port = config.port;

app.use(express.static(__dirname + "/.."));

var allowedCrossOrigin = [];

allowedCrossOrigin.push("http://localhost");

app.use(function(req, res, next) {
    Logger.resetLoggerKey();
    for (var i = 0; i < allowedCrossOrigin.length; i++) {
        res.header("Access-Control-Allow-Origin", allowedCrossOrigin[i]);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function requestLogging(req) {
    Logger.log("Request: " + req.url + ", " + req.method);
}

function loadIndexPage(req, res) {
    var filePath = "index.html";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.TEXT_HTML);
    fs.createReadStream(filePath).pipe(res);
}

app.get('/', function(req, res){
    requestLogging(req);
    loadIndexPage(req, res);
});

app.get('/index.html', function(req, res){
    requestLogging(req);
    res.sendFile(__dirname + "/index.html");
});

app.get('/indexData.json', function(req, res){
    requestLogging(req);
    var filePath = "./static/data/indexData.json";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    fs.createReadStream(filePath).pipe(res);
});

app.get('/json_data', function(req, res){
    requestLogging(req);
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    var response = {"status": "SUCCESS"};
    // res.end(JSON.stringify(response));
    res.json(response);
});

app.get('/twitter', function(req, res, next){
    requestLogging(req);
    var api = "https://api.twitter.com/1.1/search/tweets.json";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);

    var response = {"status": "SUCCESS"};
    Get.api(api, $S.getUniqueNumber(), function(resp) {
        res.end(JSON.stringify(resp));
    });
});

app.get('/nasa', function(req, res, next){
    requestLogging(req);
    var api = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);

    var response = {"status": "SUCCESS"};
    Get.api(api, $S.getUniqueNumber(), function(resp) {
        res.end(JSON.stringify(resp));
    });
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
