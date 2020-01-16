(function() {
//bst: Binary Search Tree
var Node = (function(){
    function Node(nodeVal) {
        this.data = nodeVal;
        this.left = null;
        this.right = null;
    }
    return Node;
})();
var BinarySearchTree = (function() {
    function BinarySearchTree() {
        this.root = null;
    }
    BinarySearchTree.prototype.insertNode = function(node, newNode) { 
        if(newNode.data < node.data) {
            if(node.left === null) {
                node.left = newNode; 
            } else {
                this.insertNode(node.left, newNode);  
            } 
        } else {
            if(node.right === null) {
                node.right = newNode; 
            } else {
                this.insertNode(node.right, newNode); 
            }
        }
    };
    BinarySearchTree.prototype.printInOrder = function(node) {
        if (node != null) {
            this.printInOrder(node.left);
            console.log(node.data);
            this.printInOrder(node.right);
        }
    };
    BinarySearchTree.prototype.printPostOrder = function(node) {
        if (node != null) {
            this.printInOrder(node.left);
            this.printInOrder(node.right);
            console.log(node.data);
        }
    };
    BinarySearchTree.prototype.printPreOrder = function(node) {
        if (node != null) {
            console.log(node.data);
            this.printInOrder(node.left);
            this.printInOrder(node.right);
        }
    }
    return BinarySearchTree;
})();
var bst = new BinarySearchTree();
var BST = function(selector, context) {
    return new BST.fn.init(selector, context);
};
BST.fn = BST.prototype = {
    constructor: BST,
    init: function(selector, context) {
        return this;
    }
};
BST.fn.init.prototype = BST.fn;
BST.extend = BST.fn.extend = function(options) {
    for (var key in options) {
        this[key] = options[key];
    }
    return this;
};
BST.extend({
    insert: function(data) {
        var newNode = new Node(data);
        if (bst.root == null) {
            bst.root = newNode;
        } else {
            bst.insertNode(bst.root, newNode);
        }
        return data;
    },
    printInOrder: function() {
        bst.printInOrder(bst.root);
        return 0;
    },
    printPreOrder: function() {
        bst.printPreOrder(bst.root);
        return 0;
    },
    printPostOrder: function() {
        bst.printPostOrder(bst.root);
        return 0;
    }
});
window.BST = window.$BST = BST;
})();
