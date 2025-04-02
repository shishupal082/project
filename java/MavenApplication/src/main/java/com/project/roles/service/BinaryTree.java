package com.project.roles.service;

import com.project.roles.BridgeConstant;

import java.util.ArrayList;

public class BinaryTree {
    private String data;
    private BinaryTree left;
    private BinaryTree right;
    public BinaryTree(String data) {
        this.data = data;
        this.right = null;
        this.left = null;
    }
    private BinaryTree getLeftChild(BinaryTree bt) {
        if (bt != null && bt.left != null) {
            return bt.left;
        }
        return bt;
    }
    private BinaryTree getRightChild(BinaryTree bt) {
        if (bt != null && bt.right != null) {
            return bt.right;
        }
        return bt;
    }
    private void insertLeft(BinaryTree bt, String data) {
        BinaryTree newBt = new BinaryTree(data);
        if (bt == null) {
            bt = newBt;
        } else {
            bt.left = newBt;
        }
    }
    private void insertNodeInLeft(BinaryTree bt, BinaryTree leftNode) {
        if (bt == null) {
            bt = leftNode;
        } else {
            bt.left = leftNode;
        }
    }
    private void insertRight(BinaryTree bt, String data) {
        BinaryTree newBt = new BinaryTree(data);
        if (bt == null) {
            bt = newBt;
        } else {
            bt.right = newBt;
        }
    }
    public ArrayList<String> getPostOrder(BinaryTree root) {
        ArrayList<String> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        int i;
        ArrayList<String> temp = this.getPostOrder(root.left);
        for (i=0; i<temp.size(); i++) {
            result.add(temp.get(i));
        }
        temp = this.getPostOrder(root.right);
        for (i=0; i<temp.size(); i++) {
            result.add(temp.get(i));
        }
        result.add(root.data);
        return result;
    }

    public static BinaryTree createBinaryTree(ArrayList<String> strings) {
        Stack stack = new Stack();
        BinaryTree root = new BinaryTree("");
        stack.push(root);
        BinaryTree currentTree = root;
        ArrayList<String> binaryOp = new ArrayList<>();
        binaryOp.add(BridgeConstant.AND);
        binaryOp.add(BridgeConstant.OR);
        binaryOp.add(BridgeConstant.PLUS);
        binaryOp.add(BridgeConstant.MINUS);
        binaryOp.add(BridgeConstant.PROD);
        binaryOp.add(BridgeConstant.DIV);
        ArrayList<String> unaryOp = new ArrayList<>();
        unaryOp.add(BridgeConstant.NOT);
        String temp;
        BinaryTree oldRight, parent;
        for (int i=0; i<strings.size(); i++) {
            temp = strings.get(i);
            if (BridgeConstant.OPEN.equals(temp)) {
                currentTree.insertLeft(currentTree, "");
                stack.push(currentTree);
                currentTree = currentTree.getLeftChild(currentTree);
            } else if (BridgeConstant.CLOSE.equals(temp)) {
                currentTree = (BinaryTree) stack.pop();
            } else if (binaryOp.contains(temp)) {
                if (!BridgeConstant.EMPTY.equals(currentTree.data)) {
                    oldRight = currentTree.right;
                    currentTree.insertRight(currentTree, temp);
                    currentTree = currentTree.getRightChild(currentTree);
                    currentTree.insertNodeInLeft(currentTree, oldRight);
                } else {
                    currentTree.data = temp;
                }
                currentTree.insertRight(currentTree, "");
                stack.push(currentTree);
                currentTree = currentTree.getRightChild(currentTree);
            } else if (unaryOp.contains(temp)) {
                currentTree.data = temp;
                if (i < strings.size()-1) {
                    i++;
                    currentTree.insertLeft(currentTree, strings.get(i));
                }
                parent = (BinaryTree) stack.pop();
                currentTree = parent;
            } else {
                currentTree.data = temp;
                parent = (BinaryTree) stack.pop();
                currentTree = parent;
            }
        }
        return root;
    }
}
