/*
ast = AST = Abstract Syntax Tree
*/

var AST = (function() {
    function AST() {
        this.result = [];
    }
    AST.prototype.getBT = function(data) {
        var self = this;
        var BT = (function(){
            function BT(val) {
                this.data = val;
                this.left = null;
                this.right = null;
            }
            BT.prototype.insertLeft = function(node, data) {
                var newNode = self.getBT(data);
                if (node) {
                    node.left = newNode;
                } else {
                    node = newNode;
                }
            };
            BT.prototype.insertRight = function(node, data) {
                var newNode = self.getBT(data);
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
        return new BT(data);
    };
    AST.prototype.createTree = function(items) {
        this.result = [];
        var stack = $S, currentTree, parent;
        var eTree = this.getBT("");
        stack.push(eTree);
        currentTree = eTree;
        for (var i = 0; i < items.length; i++) {
            if (items[i] == "(") {
                currentTree.insertLeft(currentTree, "");
                stack.push(currentTree);
                currentTree = currentTree.getLeftChild(currentTree);
            } else if(["+","-","*","/","&&","||"].indexOf(items[i]) >=0) {
                currentTree.data = items[i];
                currentTree.insertRight(currentTree, '');
                stack.push(currentTree);
                currentTree = currentTree.getRightChild(currentTree);
            } else if(items[i] == ")") {
                currentTree = stack.pop();
            } else {
                currentTree.data = items[i];
                parent = stack.pop();
                currentTree = parent;
            }
        }
        this.printPostOrder(eTree);
        console.log(this.result);
        return this.result;
    };
    AST.prototype.printPostOrder = function(bt) {
        if (bt != null) {
            this.printPostOrder(bt.left);
            this.printPostOrder(bt.right);
            this.result.push(bt.data);
        }
    };
    return AST;
})();
AST = new AST();
