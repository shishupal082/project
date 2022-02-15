var ConvertExcelToJson = require("../../src/excel/ConvertExcelToJson.js");

function _convertExcelToJson(requestData) {
    for (var i=0; i<requestData.length; i++) {
        if (requestData[i]["isVisited"] === "true") {
            continue;
        }
        requestData[i]["isVisited"] = "true";
        console.log("--------------------------------------------------");
        ConvertExcelToJson.convert({"workId": requestData[i]["workId"]}, function(status) {
            _convertExcelToJson(requestData);
        });
        return;
    }
}
var request = [];
request.push({"workId": "000"});
request.push({"workId": "004"});
request.push({"workId": "003"});
request.push({"workId": "002"});
request.push({"workId": "001"});

ConvertExcelToJson.readConfigData("test_config.json", function() {
    _convertExcelToJson(request);
});

