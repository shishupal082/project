(function() {
var MAXSTACK = 100, TOP=-1;
var STACK = [];

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
        Stack.reset();
        var currentTree, parent;
        var eTree = new BT("");
        Stack.push(eTree);
        currentTree = eTree;
        for (var i = 0; i < items.length; i++) {
            if (items[i] == "(") {
                currentTree.insertLeft(currentTree, "");
                Stack.push(currentTree);
                currentTree = currentTree.getLeftChild(currentTree);
            } else if(["+","-","*","/","&&","||"].indexOf(items[i]) >=0) {
                currentTree.data = items[i];
                currentTree.insertRight(currentTree, '');
                Stack.push(currentTree);
                currentTree = currentTree.getRightChild(currentTree);
            } else if(items[i] == ")") {
                currentTree = Stack.pop();
            } else {
                currentTree.data = items[i];
                parent = Stack.pop();
                currentTree = parent;
            }
        }
        generateResult(eTree);
        return result;
    };
    return AST;
})();
AST = new AST();

/*
End of direct access of ID
*/

Stack.extend = Stack.fn.extend = function(options) {
    if (isObject(options)) {
        for (var key in options) {
            if (isFunction(options[key])) {
                /*If method already exist then it will be overwritten*/
                if (isFunction(this[key])) {
                    console.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};
Stack.extend({
    reset: function() {
        STACK = []; TOP = -1;
        for (var i = 0; i < MAXSTACK; i++) {
            STACK.push(0);
        }
    },
    push: function(item) {
        if (TOP >= MAXSTACK - 1) {
            console.log("stack over flow");
            return 0;
        } else {
            TOP = TOP + 1;
            STACK[TOP] = item;
        }
        return 1;
    },
    pop: function() {
        var item = 0;
        if (TOP < 0) {
            console.log("stack under flow");
        } else {
            item = STACK[TOP];
            TOP = TOP - 1;
        }
        return item;
    },
    print: function() {
        for (var i = 0; i < TOP+1; i++) {
            console.log(i + "-" + STACK[i]);
        }
        return 0;
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
        Stack.reset();
        var ch, i;
        var val, result;
        var A, B;
        for (i = 0; i<postfix.length; i++) {
            ch = postfix[i];
            if (!isNaN(ch)) {
                Stack.push(ch);
            }
            else if (["+","-","*","/"].indexOf(ch) >= 0) {
                A = Stack.pop()*1;
                B = Stack.pop()*1;
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
                Stack.push(val);
            }
        }
        result = Stack.pop();
        return val;
    },
    calBinary: function(postfix) {
        Stack.reset();
        var ch, i;
        var val, result;
        var A, B;
        for (i = 0; i<postfix.length; i++) {
            ch = postfix[i];
            if (!isNaN(ch)) {
                Stack.push(ch);
            }
            else if (["&&","||"].indexOf(ch) >= 0) {
                A = Stack.pop();
                B = Stack.pop();
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
                Stack.push(val);
            }
        }
        result = Stack.pop();
        return result;
    },
    createPosixTree: function(tokenizedExp) {
        return AST.createPosixTree(tokenizedExp);
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
Stack.reset();
/*End of direct access of methods*/
window.Stack = window.$S = Stack;
})();
