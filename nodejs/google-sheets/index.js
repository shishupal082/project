const ReadConfigData = require("../src/common/ReadConfigData.js");
const ConvertGoogleSheetsToCsv = require("../src/google-sheets/ConvertGoogleSheetsToCsv.js");
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
      ConvertGoogleSheetsToCsv.generateResult([finalData[i]["excelConfigSpreadsheets"]], function(status) {
          if (status === "SUCCESS") {
            var result = ConvertGoogleSheetsToCsv.getFinalResult();
            ConvertGoogleSheetsToCsv.clearFinalResult();
            for (j=0; j<finalData.length; j++) {
              if (finalData[j]["status"] === "IN_PROGRESS") {
                finalData[i]["status"] = "SUCCESS";
                finalData[j]["excelData"] = result;
                console.log(result);
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
              // CsvDataFormate.format(finalData);
              ConvertGoogleSheetsToCsv.saveCSVData(finalData);
            } else {
              generateFinalResult();
            }
          }
      });
      break;
    }
  }
}

function main() {
  ReadConfigData.readApiData("http://localhost:8080/api/get_excel_data_config?requestId=" + workId, function() {
    var request = {"appId": "004", "workId": workId};
    var excelConfig = ReadConfigData.getData();
    CsvDataFormate.updateConfigData(workId, excelConfig);
    ConvertGoogleSheetsToCsv.convert(request, excelConfig, function(status) {
      if (status === "SUCCESS") {
        var fileMapping = ConvertGoogleSheetsToCsv.getFinalResult();
        ConvertGoogleSheetsToCsv.clearFinalResult();
        if (fileMapping) {
          for (i=0; i<fileMapping.length; i++) {
            if (fileMapping[i]) {
              if (fileMapping[i] && fileMapping[i].length >= 6) {
                finalData.push({
                  "status": "PENDING",
                  "fileMappingData": fileMapping[i],
                  "excelConfigSpreadsheets": {
                    "spreadsheetId": fileMapping[i][2],
                    "sheetName": fileMapping[i][3]
                  },
                  "excelConfig": excelConfig,
                  "excelData": []
                });
              } else {
                console.log("Invalid file-mapping data: 1");
                console.log(fileMapping[i]);
              }
            } else {
              console.log("Invalid file-mapping data: 2");
            }
          }
          // console.log(finalData);
          // console.log("--------finalData end-------------");
          generateFinalResult();
        } else {
          console.log("Invalid config parameter generated.");
        }
      }
    });
  });  
}
main();
