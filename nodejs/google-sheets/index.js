const ConvertGoogleSheetToJson = require("../src/google-sheets/ConvertGoogleSheetToJson.js");
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
      ConvertGoogleSheetToJson.generateResult([finalData[i]["excelConfig"]], function(status) {
          if (status === "SUCCESS") {
            var result = ConvertGoogleSheetToJson.getFinalResult();
            ConvertGoogleSheetToJson.clearFinalResult();
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
              ConvertGoogleSheetToJson.saveCSVData(finalData);
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
  ConvertGoogleSheetToJson.readConfigData("./google-sheets/config.json", function() {
    ConvertGoogleSheetToJson.convert({"appId": "001", "workId": workId}, function(status) {
      if (status === "SUCCESS") {
        var fileMapping = ConvertGoogleSheetToJson.getFinalResult();
        console.log(fileMapping);
        ConvertGoogleSheetToJson.clearFinalResult();
        if (fileMapping) {
          for (i=0; i<fileMapping.length; i++) {
            if (fileMapping[i]) {
              for (j=0; j<fileMapping[i].length; j++) {
                if (fileMapping[i][j] && fileMapping[i][j].length >= 4) {
                  finalData.push({
                    "status": "PENDING",
                    "fileMappingData": fileMapping[i][j],
                    "excelConfig": {
                      "spreadsheetId": fileMapping[i][j][2],
                      "sheetName": fileMapping[i][j][3]
                    },
                    "excelData": []
                  });
                } else {
                  console.log("Invalid file-mapping data.");
                }
              }
            }
          }
          generateFinalResult();
        } else {
          console.log("Invalid config parameter generated.");
        }
      }
    });
  });  
}
main();
