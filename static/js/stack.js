(function() {
//5 digit random number from 10000 to 99999
var max = 99999, min = 10000;
var key = Math.floor(Math.random() * (max - min + 1)) + min;
//DateTimeObject
var DT = (function() {
    var yyyy, mm, dd, hour, min, sec, ms, meridian;
    function DateTime() {}
    DateTime.prototype.getDateTime = function(format, splitter, joiner) {
        var dt = new Date(), result = [];
        yyyy = dt.getFullYear();
        mm = dt.getMonth() + 1;
        dd = dt.getDate();
        hour = dt.getHours();
        min = dt.getMinutes();
        sec = dt.getSeconds();
        ms = dt.getMilliseconds();
        meridian = hour > 11 ? "PM" : "AM";
        var formats = format ? format.split(splitter) : [];
        for (var i = 0; i < formats.length; i++) {
            switch(formats[i]) {
                case "YYYY":
                    result.push(yyyy);
                break;
                case "MM":
                    result.push(mm <10 ? "0"+mm : mm+"");
                break;
                case "DD":
                    result.push(dd < 10 ? "0"+dd : dd+"");
                break;
                case "HH":
                    result.push(hour < 10 ? "0"+hour : hour +"");
                break;
                case "mm":
                    result.push(min < 10 ? "0"+min : min+"");
                break;
                case "ss":
                    result.push(sec < 10 ? "0"+sec : sec+"");
                break;
                case "ms":
                    result.push(ms < 10 ? "0"+ms : ms+"");
                break;
                case "mr":
                    result.push(meridian);
                break;
                default:
                    result.push(formats[i]);
                break;
            }
        }
        return result.join(joiner);
    }
    return DateTime;
})();

var Log = (function(){
    var dateTimeEnable = false,format,splitter,joiner;
    function Logger(){}
    Logger.prototype.updateLoggerKey = function(loggerKey) {
        key = loggerKey;
    };
    Logger.prototype.setDateTimeState = function(state,v1,v2,v3) {
        format=v1;
        splitter=v2;
        joiner=v3;
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
            preLog += dt.getDateTime(format,splitter,joiner)+":";
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
    return BT;
})();
var St = (function(){
    var MAXSTACK = 500, STACK = [];
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
    };
    St.prototype.push = function(item) {
        if (this._TOP >= MAXSTACK - 1) {
            Logger.log("stack over flow");
            return 0;
        } else {
            this._TOP = this._TOP + 1;
            this._STACK[this._TOP] = item;
        }
        return 1;
    };
    St.prototype.pop = function() {
        var item = 0;
        if (this._TOP < 0) {
            Logger.log("stack under flow");
        } else {
            item = this._STACK[this._TOP];
            this._TOP = this._TOP - 1;
        }
        return item;
    };
    St.prototype.getTop = function() {
        return this._TOP;
    };
    St.prototype.print = function() {
        for (var i = 0; i < this._TOP+1; i++) {
            Logger.log(i + "-" + this._STACK[i]);
        }
        return 0;
    }
    return St;
})();
//AST = Abstract Syntax Tree
var AST = (function() {
    var result = [];
    function generateResult(bt) {
        if (bt != null) {
            generateResult(bt.left);
            generateResult(bt.right);
            result.push(bt.data);
        }
        return result;
    }
    function AST() {}
    AST.prototype.createPosixTree = function(items) {
        result = [];
        var st = new St();
        var currentTree, parent;
        var eTree = new BT("");
        st.push(eTree);
        currentTree = eTree;
        for (var i = 0; i < items.length; i++) {
            if (items[i] == "(") {
                currentTree.insertLeft(currentTree, "");
                st.push(currentTree);
                currentTree = currentTree.getLeftChild(currentTree);
            } else if(["+","-","*","/","&&","||"].indexOf(items[i]) >=0) {
                currentTree.data = items[i];
                currentTree.insertRight(currentTree, '');
                st.push(currentTree);
                currentTree = currentTree.getRightChild(currentTree);
            } else if(items[i] == ")") {
                currentTree = st.pop();
            } else {
                currentTree.data = items[i];
                parent = st.pop();
                currentTree = parent;
            }
        }
        generateResult(eTree);
        return result;
    };
    return AST;
})();
var Table = (function() {
var rows=0, cols=0, content = [];
function Table(tableItems) {
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
}
Table.prototype.generateTdHtml = function(tdContent) {
    var tdHtml = "";
    if (typeof tdContent == "string") {
        return tdContent;
    } else if(isObject(tdContent)) {
        var attr = tdContent.attr ? tdContent.attr : "";
        var preTag = tdContent.tag ? '<'+tdContent.tag+' '+attr+'>' : "";
        var postTag = tdContent.tag ? '</'+tdContent.tag+'>' : "";
        tdHtml += preTag;
        tdHtml += this.generateTdHtml(tdContent.text);
        tdHtml += postTag;
    } else if (isArray(tdContent)) {
        for (var i = 0; i < tdContent.length; i++) {
            tdHtml += this.generateTdHtml(tdContent[i]);
        }
    }
    return tdHtml;
};
Table.prototype.getHtml = function(attr) {
    var tableAttr = attr ? attr : "";
    var html = '<table '+tableAttr+'>',
        displayContent = "",
        attr = "";
    for (var i = 0; i < rows; i++) {
        html += '<tr>';
        for (var j = 0; j < cols; j++) {
            attr = (content[i][j] && content[i][j].parentAttr) ? content[i][j].parentAttr : "";
            displayContent = this.generateTdHtml(content[i][j]);
            html += '<td '+attr+'>' + displayContent + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
};
Table.prototype.getContent = function() {
    return content;
};
return Table;
})();
var Stack = function(selector, context) {
    return new Stack.fn.init(selector, context);
};
function calculateValue(op1, operator, op2) {
    var val = null;
    switch (operator) {
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
        case '+':
            val = op1 + op2;
        break;
        case '-':
            val = op1 - op2;
        break;
        case "&&":
            val = op1 && op2;
        break;
        case "||":
            val = op1 || op2;
        break;
        default:
        break;
    }
    return val;
};
Stack.fn = Stack.prototype = {
    constructor: Stack,
    init: function(selector, context) {
        return this;
    }
};
Stack.fn.init.prototype = Stack.fn;

/*
End of direct access of ID
*/

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
Stack.extend({
    getStack: function(shareStorage) {
        return new St(shareStorage);
    },
    getDT: function() {
        return new DT();
    },
    getTable: function(tableContent) {
        return new Table(tableContent);
    },
    log: function(log) {
        Logger.log(log);
    },
    updateLoggerKey: function(loggerKey) {
        Logger.updateLoggerKey(loggerKey);
    },
    setLoggerDateTimeState: function(state,formats,splitter,joiner) {
        Logger.setDateTimeState(state,formats,splitter,joiner);
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
    }
});
Stack.extend({
    //3*4*5*6 = ["(","3","*",4,"*",5,"*",6,")"] = [3,4,5,6,"*","*","*"] = 3456*** = 360
    //(((3*4)*5)*6) = ["(","(","(",3,"*",4,")","*",5,")","*",6,")"] = [3,4,"*",5,"*",6,"*"] = 34*5*6* = 360
    //(4+(5*6)) = ["(",4,"+","(",5,"*",6,")",")"] = [4,5,6,"*","+"] = 456*+ = 34
    //(4*5) = ["(", 4, "*", 5, ")"] = [4,5,"*"] = 20
    //(3+(4*5)) = ["(", 3, "+", "(", 4, "*", 5, ")",")"] = [3,4,5,"*","+"] = 23
    //(3*(5+5)) = ["(","3","*","(","5","+","5",")",")"] = [3,5,5,"+","*"] = 355+* = 30
    //(3*(((5+5)*5)+5)) = ["(",3,"*","(","(","(",5,"+",5,")","*",5,")","+",5,")",")"] = [3,5,5,"+",5,"*",5,"+","*"] = 355+5*5+* = 165


    //3*((4+5)*7+8*9) = [3,4,5,"+",7,"*",8,9,"*","+","*"] = 345+7*89*+* = 405
    //3*((4+5)*7+8*9)*2 = [3,4,5,"+",7,"*",8,9,"*","+","*",2,"*"] = 345+7*89*+*2* = 810
    //3*((4+5)*7+2*2) = [3,4,5,"+",7,"*",2,2,"*","+","*"] = 345+7*22*+* = 201
    //3*(9*7+4) = [3,9,7,"*",4,"+","*"] = 397*4+* = 201
    //3*(9*7+4)*2 = [3,9,7,"*",4,"+","*",2,"*"] = 397*4+*2* = 402
    //3*((4+5)*7+2*2)*2 = [3,4,5,"+",7,"*",2,2,"*","+","*",2,"*"] = 397*22*+2* = 402
    calNumerical: function(postfix) {
        var st = new St();
        var A, op, B;
        var val, result;
        for (var i = 0; i<postfix.length; i++) {
            op = postfix[i]; //operator
            if (!isNaN(postfix[i])) {
                st.push(postfix[i]*1);
            }
            else if (["+","-","*","/"].indexOf(op) >= 0) {
                A = st.pop()*1;
                B = st.pop()*1;
                val = calculateValue(B, op, A);
                st.push(val);
            }
        }
        result = st.pop();
        return val;
    },
    calBinary: function(postfix) {
        var st = new St();
        var A, op, B;
        var  val, result;
        for (var i = 0; i<postfix.length; i++) {
            op = postfix[i]; //operator
            if (typeof postfix[i] == "boolean") {
                st.push(postfix[i]);
            } else if (["&&","||"].indexOf(op) >= 0) {
                A = st.pop();
                B = st.pop();
                val = calculateValue(B, op, A);
                st.push(val);
            }
        }
        result = st.pop();
        return result;
    },
    createPosixTree: function(tokenizedExp) {
        var ast = new AST();//Abstract syntax tree
        return ast.createPosixTree(tokenizedExp);
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
        var tokens = Stack.tokenize(expression, ["(",")","&&","||"]);
        var posix = Stack.createPosixTree(tokens);
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

/*End of direct access of methods*/
window.Stack = window.$S = Stack;
})();
