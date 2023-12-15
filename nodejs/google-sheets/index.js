const ReadConfigData = require("../src/common/ReadConfigData.js");
const ConvertGoogleSheetsToCsv = require("../src/google-sheets/ConvertGoogleSheetsToCsv.js");
const CsvDataFormate = require("../src/common/CsvDataFormate.js");
const $S = require("../src/libs/stack.js");
var arg = process.argv;

var nodejsWorkIdIndex = 7;
var nodejsWorkId = [];
var workId = "";
var port = "8082";
var baseUrl = "http://localhost";
var finalCallingConfig = {};
var isInvalidWorkId = false;

if (arg.length >= 3 && arg[2].length > 0) {
    workId = arg[2];
    if (arg.length >= 4 && arg[3].length > 0) {
      port = arg[2];
      workId = arg[3];
    }
} else {
    isInvalidWorkId = true;
    workId = "gs-csv-file-data-nodejs";
    console.log("-----Command line argument 'workId' required.-----");
}
workId = "nodejs-"+workId;
var finalData = [];
var isAllDataLoaded;

function generateNodejsWorkId(_result) {
    if ($S.isArray(_result) && nodejsWorkIdIndex >= 0) {
        for (var i=0; i<_result.length; i++) {
            if ($S.isArray(_result[i])) {
                for(var j=0; j<_result[i].length; j++) {
                    if ($S.isArray(_result[i][j]) && _result[i][j].length > nodejsWorkIdIndex) {
                        nodejsWorkId.push(_result[i][j][nodejsWorkIdIndex]);
                    }
                }
            }
        }
    }
    console.log(nodejsWorkId.sort());
}
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
            if (isInvalidWorkId) {
                generateNodejsWorkId(result);
                return;
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
function getNextWorkId(fileMapping) {
    if (finalCallingConfig[workId]) {
        return finalCallingConfig[workId];
    }
    var fileMappingEntry;
    var requiredColIndex;
    var csvRequestIdIndex, callNext;
    if ($S.isArray(fileMapping) && fileMapping.length >= 0 && $S.isObject(fileMapping[0])) {
        fileMappingEntry = fileMapping[0];
        requiredColIndex = fileMappingEntry["requiredColIndex"];
        if ($S.isArray(requiredColIndex) && requiredColIndex.length >= 7) {
            csvRequestIdIndex = requiredColIndex[5];
            callNext = requiredColIndex[6];
            if ($S.isNumeric(csvRequestIdIndex) && $S.isNumeric(callNext)) {
                csvRequestIdIndex = csvRequestIdIndex*1;
                callNext = callNext * 1;
                if (csvRequestIdIndex >= 0 && callNext >= 0 && $S.isArray(fileMappingEntry["data"])) {
                    if (fileMappingEntry["data"].length > csvRequestIdIndex) {
                        if (fileMappingEntry["data"].length > callNext) {                            if (fileMappingEntry["data"][callNext] === "TRUE") {
                                if (fileMappingEntry["data"][csvRequestIdIndex]) {
                                    return fileMappingEntry["data"][csvRequestIdIndex];
                                } else {
                                    // console.log("next work id not defined for: " + workId);
                                    // console.log("Invalid config for next work id.");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }

    }
    return "";
}
function sendNextRequest(fileMapping) {
    var nextWorkId = getNextWorkId(fileMapping);
    if ($S.isStringV2(nextWorkId)) {
        setTimeout(function(){
            ReadConfigData.callApi(baseUrl + "/api/update_excel_data?requestId=" + nextWorkId);
        }, 3000);
    }
}
function readApiData() {
  ReadConfigData.readApiData(baseUrl + "/api/get_excel_data_config?requestId=" + workId, function() {
    var request = {"appId": "004", "workId": workId};
    var excelConfig = ReadConfigData.getApiData();
    var requiredColIndex, spreadsheetIdIndex, sheetNameIndex;
    CsvDataFormate.updateConfigData(workId, excelConfig);
    ConvertGoogleSheetsToCsv.convert(request, excelConfig, function(status) {
      if (status === "SUCCESS") {
        var fileMapping = ConvertGoogleSheetsToCsv.getFinalResult();
        ConvertGoogleSheetsToCsv.clearFinalResult();
        if (fileMapping) {
          for (var i=0; i<fileMapping.length; i++) {
            if ($S.isObject(fileMapping[i]) && $S.isArray(fileMapping[i]["data"])) {
              requiredColIndex = fileMapping[i]["requiredColIndex"];
              if (requiredColIndex.length >= 3) {
                 spreadsheetIdIndex = requiredColIndex[1];
                 sheetNameIndex = requiredColIndex[2];
              }
              if (fileMapping[i]["data"].length > spreadsheetIdIndex && fileMapping[i]["data"].length > sheetNameIndex) {
                finalData.push({
                  "status": "PENDING",
                  "fileMappingData": fileMapping[i]["data"],
                  "excelConfigSpreadsheets": {
                    "spreadsheetId": fileMapping[i]["data"][spreadsheetIdIndex],
                    "sheetName": fileMapping[i]["data"][sheetNameIndex]
                  },
                  "requiredColIndex": requiredColIndex,
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
          // console.log(fileMapping);
          // console.log(finalData);
          // console.log(finalData[0]["excelConfig"]);
            generateFinalResult(function() {
                sendNextRequest(fileMapping);
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
            } else {
                baseUrl += ":" + port;
            }
            if ($S.isObject(tempData["finalCallingConfig"])) {
                finalCallingConfig = tempData["finalCallingConfig"];
            }
            if ($S.isNumeric(tempData["nodejsWorkIdIndex"])) {
                nodejsWorkIdIndex = tempData["nodejsWorkIdIndex"]*1;
            }
        }
        readApiData();
    });
}
main();
