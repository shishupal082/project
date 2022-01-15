var ConvertExcelToJson = require("../ConvertExcelToJson.js");

ConvertExcelToJson.setConfigPath("test_config.json");
ConvertExcelToJson.readConfigData(function() {
    ConvertExcelToJson.convert({"workId": "001"}, function(status) {
        console.log("--------------------------------------------------");
        ConvertExcelToJson.convert({"workId": "002"}, function(status) {
            console.log("--------------------------------------------------");
            ConvertExcelToJson.convert({"workId": "003"});
        });
    });
});

