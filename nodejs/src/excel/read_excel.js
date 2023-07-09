const $S = require("../libs/stack.js");
const Logger = require("../common/logger-v2.js");
const CsvDataFormate = require("../common/CsvDataFormate.js");
const reader = require('xlsx');

(function() {
var FirstRowData = [];
var FirstRowIndex = [];
var ReadExcel = function(config) {
    return new ReadExcel.fn.init(config);
};
var i, temp;
ReadExcel.fn = ReadExcel.prototype = {
    constructor: ReadExcel,
    init: function(config) {
        this.config = config;
        return this;
    }
};
ReadExcel.fn.init.prototype = ReadExcel.fn;
$S.extendObject(ReadExcel);
ReadExcel.extend({
   _convertJsonToCsvArray: function(jsonData) {
      var result = [], temp2 = [], columnData;
      var isValid = false;
      var i;
      if ($S.isArray(FirstRowIndex) && $S.isObject(jsonData)) {
         for (i=0; i<FirstRowIndex.length; i++) {
            if ($S.isStringV2(jsonData[FirstRowIndex[i]]) || $S.isNumeric(jsonData[FirstRowIndex[i]])) {
               isValid = true;
               for (var j=0; j<temp2.length; j++) {
                  result.push("");
               }
               result.push(jsonData[FirstRowIndex[i]]);
               temp2 = [];
            } else {
               temp2.push("");
            }
         }
      }
      if (isValid) {
         return result;
      }
      return [];
   },
   _readFirstLineCSVData: function(csvData) {
      var firstLine = "";
      if ($S.isString(csvData)) {
         for (var i=0; i<csvData.length; i++) {
            if (csvData[i] === "\n") {
               if (i > 0 && csvData[i-1] === "\r") {
                  firstLine += csvData[i];
                  continue;
               } else {
                  break;
               }
            }
            firstLine += csvData[i];
         }
      }
      return firstLine;
   },
   _createIndex: function(csvData, excelJsonData) {
      var i;
      var tempKeyIndex = {}, index;
      var temp2 = [], firstLine;
      var isDoubleCortStart;
      if ($S.isString(csvData)) {
         firstLine = this._readFirstLineCSVData(csvData);
         if ($S.isString(firstLine)) {
            isDoubleCortStart = false;
            index = "";
            for (i = 0; i<firstLine.length; i++) {
               if (firstLine[i] === '"') {
                  if (isDoubleCortStart) {
                     isDoubleCortStart = false;
                  } else {
                     isDoubleCortStart = true;
                  }
                  continue;
               }
               if (firstLine[i] === ',') {
                  if (isDoubleCortStart) {
                     index += firstLine[i];
                  } else {
                     temp2.push(index);
                     index = "";
                  }
                  continue;
               }
               index += firstLine[i];
            }
            temp2.push(index);
         }
      }
      for (i=0; i<temp2.length; i++) {
         if (FirstRowIndex.indexOf(temp2[i]) >= 0 || temp2[i] === "") {
            if ($S.isNumber(tempKeyIndex[temp2[i]])) {
               tempKeyIndex[temp2[i]] = tempKeyIndex[temp2[i]] + 1;
               if (temp2[i] === "") {
                  FirstRowIndex.push("__EMPTY" + "_" + tempKeyIndex[temp2[i]]);
                  FirstRowData.push("");
               } else {
                  FirstRowIndex.push(temp2[i] + "_" + tempKeyIndex[temp2[i]]);
                  FirstRowData.push(temp2[i]);
               }
            } else {
               tempKeyIndex[temp2[i]] = 0;
               FirstRowIndex.push("__EMPTY");
               FirstRowData.push("");
            }
         } else {
            tempKeyIndex[temp2[i]] = 0;
            FirstRowIndex.push(temp2[i]);
            FirstRowData.push(temp2[i]);
         }
      }
   },
   _readSheet: function(file, sheetName) {
      var sheetData = [], temp2;
      var csvData = reader.utils.sheet_to_csv(file.Sheets[sheetName]);
      var temp = reader.utils.sheet_to_json(file.Sheets[sheetName]);
      this._createIndex(csvData, temp);
      sheetData.push(FirstRowData);
      temp.forEach((res) => {
         temp2 = this._convertJsonToCsvArray(res);
         if ($S.isArrayV2(temp2)) {
            sheetData.push(temp2);
         }
      });
      CsvDataFormate.replaceSpecialCharacterEachCellV2(sheetData);
      return sheetData;
   },
   readFile: function(filepath, sheetName) {
      var result = [];
      var file;
      try {
         file = reader.readFile(filepath);
      } catch(e) {
         // File not found
         Logger.log("Error in reading excel file: " + filepath);
         return result;
      }
      var sheets = file.SheetNames;
      if ($S.isStringV2(sheetName)) {
         if (sheets.indexOf(sheetName) >= 0) {
            result.push(this._readSheet(file, sheetName));
         } else {
            Logger.log("Invalid sheetName: " + sheetName);
         }
      } else {
         for(i = 0; i < sheets.length; i++) {
            result.push(this._readSheet(file, sheets[i]));
         }
      }
      return result;
   }
});
var Excel = {
   readFile: function(filepath, sheetName) {
      FirstRowData = [];
      FirstRowIndex = [];
      return ReadExcel.readFile(filepath, sheetName);
   }
};
module.exports = Excel;
})();
