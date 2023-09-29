const ReadConfigData = require("../src/common/ReadConfigData.js");
const FilepathChecking = require("./script.js");
const CsvDataFormate = require("../src/common/CsvDataFormate.js");
var arg = process.argv;
var workId = "";
if (arg.length >= 3 && arg[2].length > 0) {
    workId = arg[2];
} else {
    console.log("-----Command line argument 'workId' required.-----");
    return;
}
var finalData = [];
var i, j, spreadsheetId, sheetName;
var isAllDataLoaded;

function generateFinalResult() {
  for (i=0; i<finalData.length; i++) {
    if (finalData[i]["status"] === "PENDING") {
      finalData[i]["status"] = "IN_PROGRESS";
      /*
      FilepathChecking.generateResult([finalData[i]["excelConfigSpreadsheets"]], function(status) {
          if (status === "SUCCESS") {
            var result = FilepathChecking.getFinalResult();
            FilepathChecking.clearFinalResult();
            for (j=0; j<finalData.length; j++) {
              if (finalData[j]["status"] === "IN_PROGRESS") {
                finalData[i]["status"] = "SUCCESS";
                finalData[j]["excelData"] = result;
                break;
              }
            }
            isAllDataLoaded = true;
            for (j=0; j<finalData.length; j++) {
              if (finalData[j]["status"] !== "SUCCESS") {
                isAllDataLoaded = false;
              }
            }
            if (isAllDataLoaded){
              console.log("Data load completed.");
              CsvDataFormate.replaceSpecialCharacterEachCell(finalData);
              CsvDataFormate.format(finalData);
              FilepathChecking.saveCSVData(finalData);
            } else {
              generateFinalResult();
            }
          }
      });*/
      break;
    }
  }

}

function main() {
  ReadConfigData.readData("./filepath-checking/config.json", function() {
    var request = {"appId": "005", "workId": workId};
    FilepathChecking.check(request, function(status) {
      if (status === "SUCCESS") {
        var fileMapping = FilepathChecking.getFinalResult();
        FilepathChecking.clearFinalResult();
      }
    });
  });  
}
main();
