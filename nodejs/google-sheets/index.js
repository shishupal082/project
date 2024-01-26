const ReadConfigData = require("../src/common/ReadConfigData.js");
const JavaExcelService = require("../src/java-excel-service/JavaExcelService.js");
const $S = require("../src/libs/stack.js");
var arg = process.argv;

var workId = "";
var port = "8082";

if (arg.length >= 3 && arg[2].length > 0) {
    workId = arg[2];
    if (arg.length >= 4 && arg[3].length > 0) {
      port = arg[2];
      workId = arg[3];
    }
}

function main() {
    ReadConfigData.readData("./google-sheets/config.json", function() {
        var tempData = ReadConfigData.getData();
        JavaExcelService.setConfigData(tempData);
        JavaExcelService.handleRequest({"appId": "005", "workId": workId, "msg": workId}, function(status) {
            console.log("---"+status+"---");
        });
    });
}
main();
