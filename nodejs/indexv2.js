const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require("fs");
const path = require("path");

const AppConstant = require("./static/AppConstant.js");
const config = require("./static/config.js");
const $S = require("../static/js/stack.js");

const hostname = config.hostname;
const port = config.port;

app.use(express.static(__dirname + "/.."));

function requestLogging(req) {
    $S.log("Request: " + req.url + ", " + req.method);
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
    loadIndexPage(req, res);
});

app.get('/indexData.json', function(req, res){
    requestLogging(req);
    var filePath = "./static/data/indexData.json";
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.APPLICATION_JSON);
    fs.createReadStream(filePath).pipe(res);
});

app.get('*', function(req, res){
    requestLogging(req);
    $S.log("Request: " + req.url + ", 404 not found.");
    $S.undateRequestId();
    res.statusCode = 404;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.TEXT_HTML);
    res.end('<center>Invalid url.</center>');
});

http.listen(port, hostname, function(){
  console.log(`*** server running at http://${hostname}:${port} ***`);
});
