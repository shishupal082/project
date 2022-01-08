const $S = require("../../static/js/stack.js");
const reader = require('xlsx');

(function() {
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
   _readSheet: function(file, index) {
      var sheetData = [];
      temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[index]]);
      temp.forEach((res) => {
         sheetData.push(res);
      });
      return sheetData;
   },
   readFile: function(filepath, sheet_index) {
      var result = [];
      var file;
      try {
         file = reader.readFile(filepath);
      } catch(e) {
         // File not found
         console.log("Error in reading excel file: " + filepath);
         return result;
      }
      var sheets = file.SheetNames;
      if ($S.isNumber(sheet_index) && sheet_index >= 0) {
         if (sheet_index < sheets.length) {
            result.push(this._readSheet(file, sheet_index));
         }
      } else {
         for(i = 0; i < sheets.length; i++) {
            result.push(this._readSheet(file, i));
         }
      }
      return result;
   }
});


var Excel = {
   readFile: function(filepath, sheet_index) {
      return ReadExcel.readFile(filepath, sheet_index);
   }
};

module.exports = Excel;

})();
