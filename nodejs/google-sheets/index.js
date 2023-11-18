const ReadConfigData = require("../src/common/ReadConfigData.js");
const ConvertGoogleSheetsToCsv = require("../src/google-sheets/ConvertGoogleSheetsToCsv.js");
const CsvDataFormate = require("../src/common/CsvDataFormate.js");
const $S = require("../src/libs/stack.js");
var arg = process.argv;

var workId = "";
var port = "";
var baseUrl = "";
var finalCallingConfig = {};

if (arg.length >= 3 && arg[2].length > 0) {
    workId = arg[2];
    if (arg.length >= 4 && arg[3].length > 0) {
      port = arg[2];
      workId = arg[3];
    }
} else {
    console.log("-----Command line argument 'workId' required.-----");
    return;
}
var finalData = [];
var isAllDataLoaded;

function generateFinalResult(callback) {
  if (finalData.length < 1) {
    return callback();
  }
  var i,j;
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
              callback();
            } else {
              generateFinalResult(callback);
            }
          }
      });
      break;
    }
  }
}

function readApiData() {
  ReadConfigData.readApiData(baseUrl + "/api/get_excel_data_config?requestId=" + workId, function() {
    var request = {"appId": "004", "workId": workId};
    var excelConfig = ReadConfigData.getApiData();
    CsvDataFormate.updateConfigData(workId, excelConfig);
    ConvertGoogleSheetsToCsv.convert(request, excelConfig, function(status) {
      if (status === "SUCCESS") {
        var fileMapping = ConvertGoogleSheetsToCsv.getFinalResult();
        ConvertGoogleSheetsToCsv.clearFinalResult();
        if (fileMapping) {
          for (var i=0; i<fileMapping.length; i++) {
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
          console.log("--------finalData length------------- " + finalData.length);
          generateFinalResult(function() {
            setTimeout(function(){
              if (finalCallingConfig[workId]) {
                ReadConfigData.callApi(baseUrl + "/api/update_excel_data?requestId=" + finalCallingConfig[workId]);
              } else {
                console.log("finalCallingConfig not defined for: " + workId);
              }
            }, 3000);
          });
        } else {
          console.log("Invalid config parameter generated.");
        }
      }
    });
  });
}

function main() {
    ReadConfigData.readData("./google-sheets/config.json", function() {
        var tempData = ReadConfigData.getData();
        if ($S.isObject(tempData)) {
            if (!$S.isStringV2(port) && $S.isStringV2(tempData["port"])) {
                port = tempData["port"];
            }
            if ($S.isStringV2(tempData["baseUrl"])) {
                baseUrl = tempData["baseUrl"];
                if ($S.isStringV2(port)) {
                    baseUrl += ":" + port;
                }
            }
            if ($S.isObject(tempData["finalCallingConfig"])) {
                finalCallingConfig = tempData["finalCallingConfig"];
            }
        }
        readApiData();
    });
}
main();
