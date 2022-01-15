const ConvertExcelToJson = require("./ConvertExcelToJson.js");
ConvertExcelToJson.setConfigPath("config.json");
ConvertExcelToJson.readConfigData(function() {
    ConvertExcelToJson.convert({"appId": "001", "workId": "001"});
});

