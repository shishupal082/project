function ExtendObject(Object) {
    Object.fn.init.prototype = Object.fn;
    Object.extend = Object.fn.extend = function(options) {
        if (typeof options == "object" && isNaN(options.length)) {
            for (var key in options) {
                if (typeof options[key] == "function") {
                    /*If method already exist then it will be overwritten*/
                    if (typeof Object[key]  == "function") {
                        console.log('Method "' + Object.name + "." + key + '" is overwritten.');
                    }
                    Object[key] = options[key];
                }
            }
        }
        return Object;
    };
}
(function() {
//5 digit random number from 10000 to 99999
var max = 99999, min = 10000;
var key = Math.floor(Math.random() * (max - min + 1)) + min;
var skipValuesInResult = [];
//DateTimeObject
var DT = (function() {
    var yyyy, mm, dd, hour, min, sec, ms, meridian;
    function DateTime() {}
    function getFormatedDateTime(formatedValue, format, seprator) {
        var response = "";
        var formatKeys = format.split(seprator);
        if (formatedValue) {
            for (var i=0; i<formatKeys.length; i++) {
                if (formatedValue[formatKeys[i]]) {
                    response+=formatedValue[formatKeys[i]];
                } else {
                    response+=formatKeys[i];
                }
            }
        }
        return response;
    };
    DateTime.prototype.getDateTime = function(format, seprator) {
        // "D/YYYY/-/MM/-/DD/T/hh/:/mm/:/ss/:/ms","/" --> "D2020-01-26T22:34:24:071"
        var currentDateTime = new Date();
        var fullYear = currentDateTime.getFullYear();
        var month = currentDateTime.getMonth()+1;
        var date = currentDateTime.getDate();
        var horus = currentDateTime.getHours();
        var minutes = currentDateTime.getMinutes();
        var seconds = currentDateTime.getSeconds();
        var miliSeconds = currentDateTime.getMilliseconds();
        var formatedValue = {};
        formatedValue["YYYY"] = fullYear;
        formatedValue["MM"] = month <= 9 ? "0"+month : month;
        formatedValue["DD"] = date <= 9 ? "0"+date : date;
        formatedValue["hh"] = horus <= 9 ? "0"+horus : horus;
        formatedValue["mm"] = minutes <= 9 ? "0"+minutes : minutes;
        formatedValue["ss"] = seconds <= 9 ? "0" + seconds : seconds;
        if (miliSeconds <= 9) {
            miliSeconds = "00" + miliSeconds;
        } else if (miliSeconds <= 99) {
            miliSeconds = "0" + miliSeconds;
        }
        formatedValue["ms"] = miliSeconds;
        return getFormatedDateTime(formatedValue, format, seprator);
    };
    DateTime.prototype.getDayNumberTimeFromSeconds = function(seconds, format, seprator) {
        var response = "";
        var formatKeys = format.split(seprator);
        var formatedValue = {};
        var dayNum = "000" + Math.ceil(seconds/(24*60*60));//058, day number
        var hours = "00" + Math.floor((seconds/(60*60))%24);
        var minutes = "00" + Math.floor((seconds/60)%60);
        var second = "00" + Math.floor(seconds%60);
        formatedValue["ddd"] = dayNum.substring(dayNum.length - 3); 
        formatedValue["hh"] = hours.substring(hours.length - 2);
        formatedValue["mm"] = minutes.substring(minutes.length - 2);
        formatedValue["ss"] = second.substring(second.length - 2);
        if (formatedValue) {
            for (var i=0; i<formatKeys.length; i++) {
                if (formatedValue[formatKeys[i]]) {
                    response+=formatedValue[formatKeys[i]];
                } else {
                    response+=formatKeys[i];
                }
            }
        }
        return response;
    };
    return DateTime;
})();
var LocalStorage = (function(){
    function LocalStorage () {
        var _localStorage = localStorage;
        var validKeys = ["item1"];
        var bypassKeys = ["local_storage_support_test","length","key","getItem","setItem","removeItem","clear"];
        function isValidKey (key) {
            if (bypassKeys.indexOf(key) >= 0 || validKeys.indexOf(key) < 0) {
                return false;
            }
            return true;
        };
        function get(key) {
            var response = {"status": false, "value": null};
            if (_localStorage && key && isValidKey(key)) {
                var value = _localStorage.getItem(key);
                if (value) {
                    response["status"] = true;
                    response["value"] = value;
                }
            }
            return response;
        };
        function getAll() {
            var response = {"status": true, count:0, "value": {}};
            for (var key in _localStorage) {
                if (isValidKey(key)) {
                    var temp = get(key);
                    if (temp.status) {
                        response.value[key] = temp.value;
                        response.count++;
                    }
                }
            }
            return response;
        };
        function set(key, value) {
            var response = {"status": false};
            if (_localStorage && key && isValidKey(key)) {
                _localStorage.setItem(key, value);
                response["status"] = true;
            }
            return response;
        };
        function remove(key) {
            var response = {"status": false};
            if (_localStorage && key && isValidKey(key)) {
                _localStorage.removeItem(key);
                response["status"] = true;
            }
            return response;
        };
        function clear() {
            var response = {"status": false};
            if (_localStorage) {
                for (var i=0; i< validKeys.length; i++) {
                    _localStorage.removeItem(validKeys[i]);
                }
                response["status"] = true;
            }
            return response;
        };
        return {
            getAll: getAll,
            get: get,
            set: set,
            remove: remove,
            clear: clear
        };
    }
    return LocalStorage;
})();
var UrlParserObj = (function(){
    var href = "", data = {};
    function UrlParser(href) {
        var hrefObj = href.split("?");
        if (hrefObj.length > 1) {
            var params = hrefObj[1];
            var paramsObj = params.split("&");
            if (paramsObj.length > 0) {
                for (var i=0; i< paramsObj.length; i++) {
                    var keyVal = paramsObj[i];
                    var keyValObj = keyVal.split("=");
                    if (keyValObj.length > 1) {
                        data[keyValObj[0]] = keyValObj[1];
                    }
                }
            }
        }
    }
    UrlParser.prototype.getData = function (key, defaultValue) {
        if (data[key]) {
            return data[key];
        }
        return defaultValue;
    };
    return UrlParser;
})();
var Log = (function(){
    var dateTimeEnable = false,format,splitter,joiner;
    function Logger(){}
    Logger.prototype.updateLoggerKey = function(loggerKey) {
        key = loggerKey;
    };
    Logger.prototype.setDateTimeState = function(state,v1,v2) {
        format=v1;
        splitter=v2;
        if (state == true) {
            dateTimeEnable = true;
        } else {
            dateTimeEnable = false;
        }
    };
    Logger.prototype.logInApi = function(log) {
        console.log(key + ":" + log);
    };
    Logger.prototype.log = function(log) {
        var preLog = key + ":" ;
        if (dateTimeEnable) {
            var dt = new DT();
            preLog += dt.getDateTime(format,splitter)+":";
        }
        console.log(preLog+ log);
    };
    return Logger;
})();
var Logger = new Log();
function isFunction(value) {
    if (typeof value == "undefined") {
        return false;
    }
    return typeof value == "function" ? true : false;
}
function isArray(value) {
    if (typeof value == "undefined") {
        return false;
    }
    return (typeof value == "object" && !isNaN(value.length)) ? true : false;
}
function isObject(value) {
    if (typeof value == "undefined") {
        return false;
    }
    return (typeof value == "object" && isNaN(value.length)) ? true : false;
}
function isNumber(data) {
    if (typeof data == "number" && !isNaN(data)) {
        return true;
    }
    return false;
}
function isBoolean(value) {
    if (typeof value == "boolean") {
        return true;
    }
    return false;
}
function calculateNumericalValue(op1, operator, op2) {
    var val = null;
    switch (operator) {
        case '+':
            val = op1 + op2;
        break;
        case '-':
            val = op1 - op2;
        break;
        case '*':
            val = op1 * op2;
        break;
        case '/':
            if (op2 != 0) {
                val = op1 / op2;
            } else {
                val = 0;
            }
        break;
        default:
        break;
    }
    return val;
}
function calculateValue(op1, operator, op2) {
    var val = null;
    switch (operator) {
        case '*':
        case "&&":
        case "&":
            val = op1 && op2;
        break;
        case "||":
        case "|":
        case "#":
        case '+':
            val = op1 || op2;
        break;
        case '~':
            val = !op1;
        break;
        default:
        break;
    }
    return val;
}
var St = (function(){
    var MAXSTACK = 500000, STACK = [];
    function St(shareStorage) {
        if (typeof shareStorage == "boolean" && shareStorage) {
            this._STACK = STACK;
        } else {
            this._STACK = [];
        }
        this._TOP = -1;
    }
    St.prototype.reset = function() {
        this._STACK = []; this._TOP = -1;
        for (var i = 0; i < MAXSTACK; i++) {
            this._STACK.push(0);
        }
        return true;
    };
    St.prototype.push = function(item) {
        if (this._TOP >= MAXSTACK - 1) {
            var logText = "stack over flow";
            Logger.log(logText);
            throw logText;
        } else {
            this._TOP = this._TOP + 1;
            this._STACK[this._TOP] = item;
        }
        return 1;
    };
    St.prototype.pop = function() {
        var item = 0;
        if (this._TOP < 0) {
            var logText = "stack under flow";
            Logger.log(logText);
            throw logText;
        } else {
            item = this._STACK[this._TOP];
            this._TOP = this._TOP - 1;
        }
        return item;
    };
    St.prototype.getTop = function() {
        return this._TOP;
    };
    St.prototype.getAll = function() {
        var res = [];
        for (var i = 0; i <= this._TOP; i++) {
            res.push(this._STACK[i]);
        }
        return res;
    };
    St.prototype.print = function() {
        for (var i = 0; i <= this._TOP; i++) {
            Logger.log(i + "-" + this._STACK[i]);
        }
        return 0;
    }
    return St;
})();
// After insertion data into BST it will return that particular node
// That node can be modified as per requirement
var BST = (function() {
    function BST(rootData) {
        this.data = rootData;
        this.right = null;
        this.left = null;
    }
    BST.prototype.insertData = function(root, data) { 
        if (isNumber(data) == false) {
            return root;
        }
        if (isNumber(root.data) == false) {
            root.data = data;
            return root;
        }
        if(data < root.data) {
            if(root.left === null) {
                root.left = new BST(data);
                return root.left;
            } else {
                return this.insertData(root.left, data);  
            } 
        } else {
            if(root.right === null) {
                root.right = new BST(data);
                return root.right;
            } else {
                return this.insertData(root.right, data); 
            }
        }
        return root;
    };
    BST.prototype.getInOrder = function(node, result) {
        if (node != null) {
            this.getInOrder(node.left, result);
            result.push(node);
            this.getInOrder(node.right, result);
        }
        return result;
    };
    BST.prototype.getPostOrder = function(node, result) {
        if (node != null) {
            this.getInOrder(node.left, result);
            this.getInOrder(node.right, result);
            result.push(node);
        }
        return result;
    };
    BST.prototype.getPreOrder = function(node, result) {
        if (node != null) {
            result.push(node);
            this.getInOrder(node.left, result);
            this.getInOrder(node.right, result);
        }
        return result;
    }
    return BST;
})();
var BT = (function(){
    function BT(val) {
        this.data = val;
        this.left = null;
        this.right = null;
    }
    BT.prototype.insertLeft = function(node, data) {
        var newNode = new BT(data);
        if (node) {
            node.left = newNode;
        } else {
            node = newNode;
        }
    };
    BT.prototype.insertNodeInLeft = function(parent, leftNode) {
        if (parent) {
            parent.left = leftNode;
        } else {
            parent = leftNode;
        }
    };
    BT.prototype.insertRight = function(node, data) {
        var newNode = new BT(data);
        if (node) {
            node.right = newNode;
        } else {
            node = newNode;
        }
    };
    BT.prototype.getLeftChild = function(node) {
        if (node && node.left) {
            return node.left;
        }
        return node;
    };
    BT.prototype.getRightChild = function(node) {
        if (node && node.right) {
            return node.right;
        }
        return node;
    };
    BT.prototype.getPostOrder = function(root) {
        var postOrderResult = [];
        if (root == null) {
            return postOrderResult;
        }
        postOrderResult = postOrderResult.concat(this.getPostOrder(root.left));
        postOrderResult = postOrderResult.concat(this.getPostOrder(root.right));
        postOrderResult.push(root.data);
        return postOrderResult;
    };
    BT.prototype.getInOrder = function(root) {
        var inOrderResult = [];
        if (root == null) {
            return inOrderResult;
        }
        inOrderResult = inOrderResult.concat(this.getInOrder(root.left));
        inOrderResult.push(root.data);
        inOrderResult = inOrderResult.concat(this.getInOrder(root.right));
        return inOrderResult;
    };
    BT.prototype.getPreOrder = function(root) {
        var preOrderResult = [];
        if (root == null) {
            return preOrderResult;
        }
        preOrderResult.push(root.data);
        preOrderResult = preOrderResult.concat(this.getPreOrder(root.left));
        preOrderResult = preOrderResult.concat(this.getPreOrder(root.right));
        return preOrderResult;
    };
    BT.prototype.createBinaryTree = function(items) {
        var st = new St();
        var currentTree, parent;
        var eTree = new BT("");
        st.push(eTree);
        currentTree = eTree;
        for (var i = 0; i < items.length; i++) {
            if (items[i] == "(") {
                this.insertLeft(currentTree, "");
                st.push(currentTree);
                currentTree = this.getLeftChild(currentTree);
            } else if(items[i] == ")") {
                currentTree = st.pop();
            } else if(["+","-","*","/","&&","&","||","|","#"].indexOf(items[i]) >=0) {
                var newData = items[i];
                if (currentTree.data != "") {
                    var oldRight = currentTree.right;
                    this.insertRight(currentTree, newData);
                    currentTree = this.getRightChild(currentTree);
                    this.insertNodeInLeft(currentTree, oldRight);
                } else {
                    currentTree.data = newData;
                }
                this.insertRight(currentTree, "");
                st.push(currentTree);
                currentTree = this.getRightChild(currentTree);
            } else if(["~"].indexOf(items[i]) >=0) {
                currentTree.data = items[i];
                if (i < items.length-1) {
                    i++;
                    this.insertLeft(currentTree, items[i]);
                }
                parent = st.pop();
                currentTree = parent;
            } else {
                currentTree.data = items[i];
                parent = st.pop();
                currentTree = parent;
            }
        }
        return eTree;
    };
    return BT;
})();

var Stack = function(selector, context) {
    return new Stack.fn.init(selector, context);
};
Stack.fn = Stack.prototype = {
    constructor: Stack,
    init: function(selector, context) {
        return this;
    }
};
Stack.fn.init.prototype = Stack.fn;

Stack.extend = Stack.fn.extend = function(options) {
    if (isObject(options)) {
        for (var key in options) {
            if (isFunction(options[key])) {
                /*If method already exist then it will be overwritten*/
                if (isFunction(this[key])) {
                    Logger.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};

var Table = (function() {
var rows=0, cols=0, content = [], tId="", processedTids = [];
function getUniqueTid(tId) {
    var verifiedTid = "";
    if (typeof tId == "string") {
        verifiedTid = tId;
    }
    if (processedTids.indexOf(verifiedTid) >= 0) {
        var max = 9, min = 1;
        var key = Math.floor(Math.random() * (max - min + 1)) + min;
        verifiedTid += "--"+key;
        if (processedTids.indexOf(verifiedTid) >= 0) {
            return getUniqueTid(verifiedTid);
        } else {
            processedTids.push(verifiedTid);
        }
    } else {
        processedTids.push(verifiedTid);
    }
    return verifiedTid;
}
function getTableId() {
    if (typeof tId != "string") {
        var max = 9999, min = 1000;
        var key = Math.floor(Math.random() * (max - min + 1)) + min;
        tId = key.toString();
    }
    return getUniqueTid(tId);
}
function generateTdHtml(tdContent, rIndex, cIndex) {
    var tdHtml = "";
    if (["string", "number"].indexOf(typeof tdContent) >= 0) {
        return tdContent;
    } else if(isObject(tdContent)) {
        var attr = tdContent.attr ? tdContent.attr : "";
        var preTag = tdContent.tag ? '<'+tdContent.tag+' '+attr+'>' : "";
        var postTag = tdContent.tag ? '</'+tdContent.tag+'>' : "";
        tdHtml += preTag;
        tdHtml += generateTdHtml(tdContent.text, rIndex, cIndex);
        tdHtml += postTag;
    } else if (isArray(tdContent)) {
        for (var i = 0; i < tdContent.length; i++) {
            tdHtml += generateTdHtml(tdContent[i], rIndex, cIndex);
        }
    }
    return tdHtml;
};
function Table(tableItems, tableId) {
    content = [];
    rows = 0; cols = 0;
    if (tableItems && tableItems.length) {
        rows = tableItems.length;
        for (var i = 0; i < tableItems.length; i++) {
            content.push([]);
            if (tableItems[i] && tableItems[i].length > cols) {
                cols = tableItems[i].length;
            }
        }
        for (var i = 0; i < tableItems.length; i++) {
            for (var j = 0; j < cols; j++) {
                if (j >= tableItems[i].length) {
                    content[i].push("");
                } else {
                    content[i].push(tableItems[i][j]);
                }
            }
        }
    }
    tId = tableId;
}
/* For better functioning: addRowIndex should be called after addColIndex  */
Table.prototype.addRowIndex = function(currentIndex) {
    if (!isNumber(currentIndex)) {
        currentIndex = 1;
    }
    currentIndex = currentIndex*1;
    for (var i = 0; i < rows; i++) {
        //Insert first item in each row as index
        content[i].splice(0, 0, currentIndex++);
    }
    cols++;
    return currentIndex;
};
/* For better functioning: addColIndex should be called before addRowIndex */
Table.prototype.addColIndex = function(currentIndex) {
    //Insert first row as empty array
    content.splice(0, 0, []);
    rows++;
    if (!isNumber(currentIndex)) {
        currentIndex = 1;
    }
    currentIndex = currentIndex*1;
    for (var i = 0; i < cols; i++) {
        content[0].push(currentIndex++);
    }
    return currentIndex;
};
Table.prototype.updateTableContent = function(rowIndex, colIndex, item) {
    if (isNumber(rowIndex) && isNumber(colIndex)) {
        if (rowIndex < rows && colIndex < cols) {
            content[rowIndex][colIndex] = item;
        }
    }
    return true;
}
Table.prototype.getHtml = function() {
    var tableId = getTableId();
    var html = '<table id="'+tableId+'">',
        displayContent = "",
        attr = "";
    for (var i = 0; i < rows; i++) {
        var rId = [tableId,i].join("-");
        var rClass = i%2 ? "odd" : "even";
        html += '<tr id="'+rId+'" class="'+rClass+'">';
        for (var j = 0; j < cols; j++) {
            var cId = [tableId,i,j].join("-");
            attr = (content[i][j] && content[i][j].parentAttr) ? content[i][j].parentAttr : "";
            displayContent = generateTdHtml(content[i][j], i, j);
            // If id will be in attr then that will be ignored
            html += '<td id="'+cId+'" '+attr+'>' + displayContent + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
};
Table.prototype.getContent = function() {
    return Stack.clone(content);
};
Table.prototype.getProcessedTids = function() {
    var response = [];
    for (var i = 0; i < processedTids.length; i++) {
        response.push(processedTids[i]);
    }
    return response;
};
Table.prototype.setProcessedTids = function(pIds) {
    if (!isArray(pIds)) {
        return false;
    }
    processedTids = [];
    for (var i = 0; i < pIds.length; i++) {
        if (typeof pIds[i] == "string") {
            processedTids.push(pIds[i]);
        }
    }
    return true;
};
Table.prototype.clearProcessedTids = function() {
    return this.setProcessedTids([]);
};
return Table;
})();

Stack.extend({
    getStack: function(shareStorage) {
        return new St(shareStorage);
    },
    getLocalStorage: function() {
        return new LocalStorage();
    },
    getDT: function() {
        return new DT();
    },
    getBT: function(data) {
        return new BT(data);
    },
    getBST: function(rootData) {
        return new BST(rootData);
    },
    getTable: function(tableContent, tableId) {
        return new Table(tableContent, tableId);
    },
    log: function(log) {
        Logger.log(log);
    },
    updateLoggerKey: function(loggerKey) {
        Logger.updateLoggerKey(loggerKey);
    },
    setLoggerDateTimeState: function(state,formats,splitter) {
        Logger.setDateTimeState(state,formats,splitter);
    },
    isArray: function(value) {
        return isArray(value);
    },
    isObject: function(value) {
        return isObject(value);
    },
    isFunction: function(value) {
        return isFunction(value);
    },
    isMethodDefined: function(name) {
        return this.isFunction(this[name]);
    },
    isNumber: function(value) {
        return isNumber(value);
    },
    isBoolean: function(value) {
        return isBoolean(value);
    },
    isBooleanTrue: function(value) {
        return isBoolean(value) && value == true;
    },
    getUrlAttribute: function(url, name, defaultValue) {
        var UrlParser = new UrlParserObj(url);
        return UrlParser.getData(name, defaultValue);
    }
});
Stack.extend({
    clone: function(obj) {
        var res = obj;
        if (isArray(obj)) {
            res = [].concat(obj)
        } else if (isObject(obj)) {
            res = {};
            for (var key in obj) {
                res[key] = Stack.clone(obj[key]);
            }
        }
        return res;
    },
    getRandomNumber: function(minVal, maxVal) {
        var random = key;
        if (isNumber(minVal) && isNumber(maxVal)) {
            random = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        }
        return random;
    }
});
Stack.extend({
    /** It follows right hand associativity **/
    //(3*4*5*6) = 360
    //(((3*4)*5)*6) = 360
    //(4+(5*6)) = 34
    //(4*5) = 20
    //(3+(4*5)) = 23
    //(3*(5+5)) = 30
    //(3*(((5+5)*5)+5)) = 165
    // (2*2*2) = 8
    // (2+2*2) = (2+4) = 6
    // (2*2+2) = (2*4) = 8
    // (2*3+4*7) = (2*3+28) = (2*31) = 62
    // (2+3*4*7) = (2+3*28) = (2+84) = 86
    // ((2+3)*(4*7)) = (5*28) = 140
    // (2*3*4+7) = (2*3*11) = (2*33) = 66
    // (3+4*(7+2)) = (3+4*9) = (3+36) = 39
    // (3+4*7+2) = (3*4*9) = (3*36) = 39
    // (3*4*(7+2)) = (3*4*9) = (3*36) = 108
    // ((3*4)*7+2) = (12*7+2) = (12*9) = 108
    // (2*3*(5*5*2*2+2)) = (2*3*(5*5*2*4)) = (2*3*200) = 1200
    // (2*3+5+5*4+2) = (2*3+5+5*6) = (2*3+5+30) = (2*3+35) = (2*78) = 76
    // (3*(9*7+4)) = (3*99) = 297
    // (3*((4+5)*7+2*2)) = (3*9*7+2*2) = (3*9*7+4) = (3*9*11) = (3*99) = 297 
    // (3*((4+5)*7+2*2)*2) = (3*(9*7+2*2)*2) = (3*99*2) = (3*198) = 594
    // (3*(9*7+4)*2) = (3*99*2) = 594
    // (3*((4+5)*7+8*9)) = (3*(9*7+8*9)) = (3*(9*7+72)) = (3*(9*79)) = (3*711) = 2133
    // (3*((4+5)*7+8*9)*2) = (3*(9*7+8*9)*2) = (3*(9*7+72)*2) = (3*(9*79)*2) = (3*711*2) = 4266
    /*
        It it not following BODMAS strictly, but it follws partially
        BODMAS: Bracket, Of, Division, Multiplication, Addition, Subtraction
        BODMAS is also known as PEDMAS: Parentheses, Exponent, ...
        Exponent can be intiger or fraction 1/2, 1/3
        Preferences => 1st it will evaluate Bracket, then it will follow right associativity (i.e. Right to Left)
        It does not support Exponent
        It support other things, Bracket, Division, Multiplication, Addition and Subtraction
    */
    calNumerical: function(postfix) {
        var st = new St();
        var A, op, B;
        var val, result;
        for (var i = 0; i<postfix.length; i++) {
            op = postfix[i]; //operator
            if (!isNaN(postfix[i])) {
                st.push(postfix[i]*1);
            } else if (["+","-","*","/"].indexOf(op) >= 0) {
                A = st.pop()*1;
                B = st.pop()*1;
                val = calculateNumericalValue(B, op, A);
                st.push(val);
            } else {
                var logText = "Invalid operator or value for numerical calculation: " + op;
                logText += ", in postfix:" + postfix.toString();
                Logger.log(logText);
                throw logText;
            }
        }
        result = st.pop();
        return result;
    },
    calBinary: function(postfix) {
        var st = new St();
        var A, op, B;
        var  val, result;
        for (var i = 0; i<postfix.length; i++) {
            op = postfix[i]; //operator
            if (typeof postfix[i] == "boolean") {
                st.push(postfix[i]);
            } else if (["&&","&","*","||","|","#","+"].indexOf(op) >= 0) {
                A = st.pop();
                B = st.pop();
                val = calculateValue(B, op, A);
                st.push(val);
            } else if (["~"].indexOf(op) >= 0) {
                A = st.pop();
                val = calculateValue(A, op);
                st.push(val);
            } else {
                var logText = "Invalid operator or value for binary calculation: " + op;
                logText += ", in postfix: " + postfix.toString();
                Logger.log(logText);
                throw logText;
            }
        }
        result = st.pop();
        return result;
    },
    createPreOrderTree: function(tokenizedExp) {
        var bt = new BT("");
        var btRoot = bt.createBinaryTree(tokenizedExp);
        var preOrderTreeValue = bt.getPreOrder(btRoot);
        return preOrderTreeValue;
    },
    createInOrderTree: function(tokenizedExp) {
        var bt = new BT("");
        var btRoot = bt.createBinaryTree(tokenizedExp);
        var inOrderTreeValue = bt.getInOrder(btRoot);
        return inOrderTreeValue;
    },
    createPostOrderTree: function(tokenizedExp) {
        var bt = new BT("");
        var btRoot = bt.createBinaryTree(tokenizedExp);
        var postOrderTreeValue = bt.getPostOrder(btRoot);
        return postOrderTreeValue;
    },
    generateExpression: function (items) {
        var st = new St();
        var pre, post;
        var op, values;
        if (isObject(items)) {
            op = items["op"]; //operator
            values = items["val"];
            for (var i = 0; i < values.length; i++) {
                st.push(values[i]);
            }
            while(st.getTop() > 0) {
                pre = st.pop();
                if (pre.val) {
                    Stack.generateExpression(pre);
                    pre = pre.exp;
                }
                post = st.pop();
                if (post.val) {
                    Stack.generateExpression(post);
                    post = post.exp;
                }
                st.push("("+post+op+pre+")");
            }
            items["exp"] = st.pop();
        }
        return items;
    },
    evaluateNumerical: function(expression) {
        var tokens = Stack.tokenize(expression, ["(",")","+","-","*","/"]);
        var posix = Stack.createPosixTree(tokens);
        return Stack.calNumerical(posix);
    },
    evaluateBinary: function(expression) {
        var tokens = Stack.tokenize(expression, ["(",")","&&","*","||","#","+","~"]);
        var posix = Stack.createPosixTree(tokens);
        for (var i = 0; i < posix.length; i++) {
            if (posix[i] == "true") {
                posix[i] = true;
            } else if (posix[i] == "false") {
                posix[i] = false;
            } else {
                continue;
            }
        }
        return Stack.calBinary(posix);
    },
    evaluateBinaryV2: function(expression) {
        var tokens = Stack.tokenize(expression, ["(",")","&","*","|","#","+","~"]);
        var posix = Stack.createPosixTree(tokens);
        for (var i = 0; i < posix.length; i++) {
            if (posix[i] == "true") {
                posix[i] = true;
            } else if (posix[i] == "false") {
                posix[i] = false;
            } else {
                continue;
            }
        }
        return Stack.calBinary(posix);
    },
    tokenize: function(expression, tokenItems) {
        var tokens = [];
        if (tokenItems && tokenItems.length) {
            for (var i = 0; i < tokenItems.length; i++) {
                expression = expression.split(tokenItems[i]).join(","+tokenItems[i]+",");
            }
        }
        var temp = expression.split(","), tempToken;
        //Remove empty values and trim all token
        for (var i = 0; i < temp.length; i++) {
            tempToken = temp[i].trim();
            if (tempToken == "") {
                continue;
            } else {
                tokens.push(tempToken);
            }
        }
        return tokens;
    },
});
Stack.extend({
    setSkipValuesFromPosixResult: function(skipValues) {
        if (isArray(skipValues)) {
            skipValuesInResult = [];
            for (var i = 0; i < skipValues.length; i++) {
                if (["string", "number"].indexOf(typeof skipValues[i]) >= 0) {
                    skipValuesInResult.push(skipValues[i]);
                }
            }
        }
        return true;
    },
    createPosixTree: function(tokenizedExp) {
        var response = [];
        var posixTreeValue = Stack.createPostOrderTree(tokenizedExp);
        // Fix for single item expression, like
        // exp = "(true)" => tokenizedExp = ["(", "true", ")"]
        // exp = "((true))" or "(((true)))"
        // BT => root.data = "", root.left.data = "true"
        // Therefore response should be ["true"] instead of ["true", ""]
        for (var i = 0; i < posixTreeValue.length; i++) {
            if (skipValuesInResult.indexOf(posixTreeValue[i]) >= 0) {
                continue;
            }
            response.push(posixTreeValue[i]);
        }
        return response;
    },
});
/*End of direct access of methods*/
window.Stack = window.$S = Stack;
})();
