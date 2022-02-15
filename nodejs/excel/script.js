const ConvertExcelToJson = require("../src/excel/ConvertExcelToJson.js");
ConvertExcelToJson.readConfigData("config.json", function() {
    ConvertExcelToJson.convert({"appId": "001", "workId": "001"});
});

