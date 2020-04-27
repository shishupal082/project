const http = require("http");
const fs = require("fs");
const path = require("path");
const AppConstant = require("./static/AppConstant.js");
const config = require("./static/config.js");
const $S = require("../static/js/stack.js");

const hostname = config.hostname;
const port = config.port;


function loadFavicon(req, res) {
    res.statusCode = 200;
    res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.IMAGE_X_ICON);
    var filePath = path.resolve("./../favicon.ico");
    fs.createReadStream(filePath).pipe(res);
}

var availableResources = {
    "/": {
        responseType: AppConstant.TEXT_HTML,
        filePath: "index.html"
    },
    "/index.html": {
        responseType: AppConstant.TEXT_HTML,
        filePath: "index.html"
    },
    "/index.html/": {
        responseType: AppConstant.TEXT_HTML,
        filePath: "index.html"
    },
    "/indexData.json": {
        responseType: AppConstant.APPLICATION_JSON,
        filePath: "./static/data/indexData.json"
    },
    "/app/yard1": {
        responseType: AppConstant.TEXT_HTML,
        filePath: "../app/yard1/index.html"
    },
    "/app/yard1/": {
        responseType: AppConstant.TEXT_HTML,
        filePath: "../app/yard1/index.html"
    },
    "/app/yard1/index.html": {
        responseType: AppConstant.TEXT_HTML,
        filePath: "../app/yard1/index.html"
    }
};

var cssPaths = [];
cssPaths.push("/static/libs/bootstrap-v3.1.1.css");
cssPaths.push("/app/yard1/static/css/style.css");

var jsPaths = [];
jsPaths.push("/static/js/stack.js");
jsPaths.push("/static/js/model.js");
jsPaths.push("/static/js/yard/yardApiModel.js");
jsPaths.push("/static/libs/jquery-2.1.3.js");
jsPaths.push("/app/yard1/static/js/yard1ComponentModel.js");
jsPaths.push("/app/yard1/static/js/yard1PointModel.js");
jsPaths.push("/app/yard1/static/js/yard1Controller.js");
jsPaths.push("/app/yard1/static/js/yard1Script.js");

var jsonPaths = [];
jsonPaths.push("/app/yard1/static/json/yard.json");

var requestMapper = {};
Object.assign(requestMapper, availableResources);

for (var i = 0; i < cssPaths.length; i++) {
    requestMapper[cssPaths[i]] = {
        responseType: AppConstant.TEXT_CSS,
        filePath: "../" + cssPaths[i]
    };
}
for (var i = 0; i < jsPaths.length; i++) {
    requestMapper[jsPaths[i]] = {
        responseType: AppConstant.TEXT_JS,
        filePath: "../" + jsPaths[i]
    };
}
for (var i = 0; i < jsonPaths.length; i++) {
    requestMapper[jsonPaths[i]] = {
        responseType: AppConstant.APPLICATION_JSON,
        filePath: "../" + jsonPaths[i]
    };
}

const server = http.createServer((req, res) => {
    // console.log(req.headers);
    if (req.url == "/favicon.ico") {
        loadFavicon(req, res);
    } else {
        $S.log("Request: " + req.url + ", " + req.method);
        var hrefPath = $S.getUrlAttribute(req.url, "hrefPath");
        if (requestMapper[hrefPath]) {
            $S.log("Precessing request.");
            var mappedData = requestMapper[hrefPath];
            res.statusCode = 200;
            res.setHeader(AppConstant.CONTENT_TYPE, mappedData.responseType);
            fs.createReadStream(mappedData.filePath).pipe(res);
        } else {
            res.statusCode = 200;
            res.setHeader(AppConstant.CONTENT_TYPE, AppConstant.TEXT_HTML);
            res.end('<center>Invalid url.</center>');
        }
        $S.log("Request end.");
    }
});

server.listen(port, hostname, () => {
    console.log(`*** server running at http://${hostname}:${port} ***`);
});

