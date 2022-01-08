const Excel = require("./read_excel.js");

var source = "test_data.xlsx";
var data = Excel.readFile(source);
console.log(data);

data = Excel.readFile("file_not_found.xlsx");
console.log(data);
