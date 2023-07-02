const ReadConfigData = require("../src/common/ReadConfigData.js");
const ConvertExcelToCsv = require("../src/excel/ConvertExcelToCsv.js");
const CsvDataFormate = require("../src/common/CsvDataFormate.js");
var arg = process.argv;
var workId = "";
if (arg.length >= 3 && arg[2].length > 0) {
    workId = arg[2];
} else {
    console.log("-----Command line argument 'workId' required.-----");
    return;
}

function main() {
  ReadConfigData.readData("./config.json", function() {
    ConvertExcelToCsv.setConfigData(ReadConfigData.getData());
    var request = {"appId": "001", "workId": workId};
    ConvertExcelToCsv.convert(request);
  });
}
main();
