const ReadConfigData = require("../../src/common/ReadConfigData.js");
const ConvertExcelToCsv = require("../../src/excel/ConvertExcelToCsv.js");

function _convertExcelToJson(requestData) {
    for (var i=0; i<requestData.length; i++) {
        if (requestData[i]["isVisited"] === "true") {
            continue;
        }
        requestData[i]["isVisited"] = "true";
        console.log("--------------------------------------------------");
        ConvertExcelToCsv.convert({"workId": requestData[i]["workId"]}, function(status) {
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


ReadConfigData.readData("./test_config.json", function() {
    ConvertExcelToCsv.setConfigData(ReadConfigData.getData());
    _convertExcelToJson(request);
});
