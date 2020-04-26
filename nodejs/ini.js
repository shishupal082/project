const ini = require("ini");
const fs = require('fs');


var config = ini.parse(fs.readFileSync('./static/data/config.ini', 'utf-8'));
console.log(config);
