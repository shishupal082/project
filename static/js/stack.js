(function() {
//5 digit random number from 10000 to 99999
var max = 99999, min = 10000;
var key = Math.floor(Math.random() * (max - min + 1)) + min;
var Log = (function(){
    function Logger(){}
    Logger.prototype.updateLoggerKey = function(loggerKey) {
        key = loggerKey;
    };
    Logger.prototype.logInApi = function(log) {
        console.log(key + ":" + log);
    };
    Logger.prototype.log = function(log) {
        // console.log(log);
        console.log(key + ":" + log);
    };
    return Logger;
})();
var Logger = new Log();
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
    var MAXSTACK = 100;
    function St() {
        this.STACK = [];
        this.TOP = -1;
    }
    St.prototype.reset = function() {
        this.STACK = []; this.TOP = -1;
        for (var i = 0; i < MAXSTACK; i++) {
            this.STACK.push(0);
        }
    };
    St.prototype.push = function(item) {
        if (this.TOP >= MAXSTACK - 1) {
            Logger.log("stack over flow");
            return 0;
        } else {
            this.TOP = this.TOP + 1;
            this.STACK[this.TOP] = item;
        }
        return 1;
    };
    St.prototype.pop = function() {
        var item = 0;
        if (this.TOP < 0) {
            Logger.log("stack under flow");
        } else {
            item = this.STACK[this.TOP];
            this.TOP = this.TOP - 1;
        }
        return item;
    };
    St.prototype.print = function() {
        for (var i = 0; i < this.TOP+1; i++) {
            Logger.log(i + "-" + this.STACK[i]);
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
        // Stack.reset();
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
var Stack = function(selector, context) {
    return new Stack.fn.init(selector, context);
};
function isFunction(value) {
    return typeof value == "function" ? true : false;
}
function isObject(value) {
    return (typeof value == "object" && isNaN(value.length)) ? true : false;
}
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
    getStack: function() {
        return new St();
    },
    log: function(log) {
        Logger.log(log);
    },
    updateLoggerKey: function(loggerKey) {
        Logger.updateLoggerKey(loggerKey);
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
        var ch, i;
        var val, result;
        var A, B;
        for (i = 0; i<postfix.length; i++) {
            ch = postfix[i];
            if (!isNaN(ch)) {
                st.push(ch);
            }
            else if (["+","-","*","/"].indexOf(ch) >= 0) {
                A = st.pop()*1;
                B = st.pop()*1;
                switch (ch) {
                    case '*':
                        val = B * A;
                    break;
                    case '/':
                        if (A != 0) {
                            val = B / A;
                        } else {
                            val = 0;
                        }
                    break;
                    case '+':
                        val = B + A;
                    break;
                    case '-':
                        val = B - A;
                    break;
                }
                st.push(val);
            }
        }
        result = st.pop();
        return val;
    },
    calBinary: function(postfix) {
        var st = new St();
        var ch, i;
        var val, result;
        var A, B;
        for (i = 0; i<postfix.length; i++) {
            ch = postfix[i];
            if (!isNaN(ch)) {
                st.push(ch);
            }
            else if (["&&","||"].indexOf(ch) >= 0) {
                A = st.pop();
                B = st.pop();
                switch (ch) {
                    case "&&":
                        val = B && A;
                    break;
                    case "||":
                        val = B || A;
                    break;
                    default:
                    break;
                }
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
