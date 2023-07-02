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
   _createIndex: function(csvData, excelJsonData) {
      var i;
      var tempKeyIndex = {};
      var temp2 = [], csvDataTemp;
      if ($S.isString(csvData)) {
         csvDataTemp = $S.replaceString(csvData, "\r\n", "\n").split("\n");
         if ($S.isArray(csvDataTemp) && csvDataTemp.length > 0) {
            temp2 = csvDataTemp[0].split(",");
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
      return ReadExcel.readFile(filepath, sheetName);
   }
};
module.exports = Excel;
})();
