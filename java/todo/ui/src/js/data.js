//var Cortex = require('cortexjs');
var Freezer = require('freezer-js');

var rawData = {};

console.log("rawData", rawData);

var store = new Freezer(rawData);

module.exports = store;
