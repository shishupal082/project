Nodejs works on module
Reactjs works on component

Nodejs          Reactjs
--------------------------
module          component
require         imports
exports
__filename
__dirname


Uses:
    const square = require("square.js")

Module in nodejs is same as window in javascript (i.e. global variable)

Download and installation
-------------------------
If node is not installed already then download and install from

https://nodejs.org/en/

This package will install:
    Node.js v12.16.2 to /usr/local/bin/node
    npm v6.14.4 to /usr/local/bin/npm

Make sure that /usr/local/bin is in your $PATH

>> node (It will take you to node REPL)
>> node -v
>> npm -v (npm is a part of node)

node REPL (Read-Eval-Print-Loop)
    For exit press CMD+C twice
    It is same as developer console in chrome

Install dependencies from package.json
>> npm install

Project setup
-------------
>> npm init
It will create package.json

If package.json already exist then type
>> type NUL > index.js
It will create empty index.js file


Running of project
------------------
>> node index     or,
>> node index.js

It will execute program written in index.js


Node.js Modules & its types
----------------------------

1) File-based Modules
2) Core Modules
3) Enternal Node Modules

1) File-based Modules
*******************
module.exports & require

square.js
----
// exports.area = (a) => (a*a);
// exports.perimeter = (a) => (4*a);

var Area = (a) => (a*a);
var Perimeter = (a) => (4*a);

module.exports.area = Area;
module.exports.perimeter = Perimeter;

index.js
---
const square = require("./square.js")

console.log(__dirname); -->
	current nodejs folder path <user>/project/nodejs
console.log(__filename);
	__dirname + server filename "/index.js" = <user>/project/nodejs/index.js

console.log("Hello World!");
console.log(square.area(5));
console.log(square.perimeter(5));


2) Core Modules
*************
Parts of core modules

path, fs, os, util, ...

path
--
const path = require('path');

const filename = path.join(__filename);
const basename = path.basename(filename);
const extname = path.extname(filename);

console.log(filename);
console.log(basename);
console.log(extname);

http
--


3) Enternal Node Modules
**********************
Third party modules
Installed using npm
node_modules folder in your Node application



Now starting of applications
-----------------------------

Add following in package.json

"scripts": {
    "start": "node index"
},

Dependencies
------------
http, path, fs


To start server
---------------
>> npm start

It should start working

