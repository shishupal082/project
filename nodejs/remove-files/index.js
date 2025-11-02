const ReadConfigData = require("../src/common/ReadConfigData.js");
const RemoveFilesController = require("../src/remove-files/RemoveFilesController.js");
const $S = require("../src/libs/stack.js");
var arg = process.argv;

/**
arg[0] = "C:/Program Files/nodejs/node.exe";
arg[1] = "D:/workspace/project/nodejs/remove-files/index.js"; // this file
arg[2] = "./config/remove-files/config.json"; // user defined
arg[3] = "remove-files"; // user defined
*/

var workId = "";
var configPath = "";
if (arg.length >= 4) {
    configPath = arg[2];
    workId = arg[3];
}

function main() {
    ReadConfigData.readData(configPath, function() {
        var configData = ReadConfigData.getData();
        RemoveFilesController.setConfigData(configData);
        RemoveFilesController.removeFile(workId, function(status, result) {
            console.log("---"+status+"---");
            console.log(result);
        });
        // console.log(model.getTrashPath());
        // model.isValidTrashPath();
    //     JavaExcelService.handleRequest({"appId": "005", "workId": workId, "msg": workId}, function(status, result) {
    //         if ($S.isArray(result)) {
    //             status = status + "|" + result.length;
    //         }
    //         console.log("---"+status+"---");
    //     });
    });
}
main();
