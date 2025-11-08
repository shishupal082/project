package com.roles_mapping.service;

import com.roles_mapping.config.BridgeConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

public class BinaryTree {
    final static Logger logger = LoggerFactory.getLogger(BinaryTree.class);
    private String data;
    private BinaryTree left;
    private BinaryTree right;
    public BinaryTree(String data) {
        this.data = data;
        this.right = null;
        this.left = null;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public BinaryTree getLeft() {
        return left;
    }

    public void setLeft(BinaryTree left) {
        this.left = left;
    }

    public BinaryTree getRight() {
        return right;
    }

    public void setRight(BinaryTree right) {
        this.right = right;
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
    public static ArrayList<String> infixToPostfix(ArrayList<String> infix) {
        ArrayList<String> postFix = new ArrayList<>();
        String temp2, topElement;
        Stack stack = new Stack();
        ArrayList<String> binaryOp = new ArrayList<>();
        binaryOp.add(BridgeConstant.AND);
        binaryOp.add(BridgeConstant.OR);
        binaryOp.add(BridgeConstant.PLUS);
        binaryOp.add(BridgeConstant.MINUS);
        binaryOp.add(BridgeConstant.PROD);
        binaryOp.add(BridgeConstant.DIV);
        ArrayList<String> unaryOp = new ArrayList<>();
        unaryOp.add(BridgeConstant.NOT);
        for (String temp : infix) {
            if (temp == null || temp.isEmpty()) {
                continue;
            }
            if (BridgeConstant.OPEN.equals(temp)) {
                stack.push(temp);
            } else if (BridgeConstant.CLOSE.equals(temp)) {
                temp2 = (String) stack.pop();
                while (!BridgeConstant.OPEN.equals(temp2)) {
                    postFix.add(temp2);
                    temp2 = (String) stack.pop();
                }
            } else if (binaryOp.contains(temp)) {
                stack.push(temp);
            } else if (unaryOp.contains(temp)) {
                stack.push(temp);
            } else {
                postFix.add(temp);
                topElement = (String) stack.getTopElement();
                if (unaryOp.contains(topElement)) {
                    stack.pop();
                    postFix.add(topElement);
                }
            }
        }
        while (stack.getTop() >= 0) {
            temp2 = (String) stack.pop();
            if (BridgeConstant.OPEN.equals(temp2)) {
                logger.info("Invalid infix expression: {}, contains: ( in result", infix);
                return null;
            }
            postFix.add(temp2);
        }
        return postFix;
    }
    public static BinaryTree createBinaryTreeUsingPosix(ArrayList<String> posix) {
        if (posix == null) {
            logger.info("Invalid posix expression: null");
            return null;
        }
        Stack stack = new Stack();
        ArrayList<String> binaryOp = new ArrayList<>();
        binaryOp.add(BridgeConstant.AND);
        binaryOp.add(BridgeConstant.OR);
        binaryOp.add(BridgeConstant.PLUS);
        binaryOp.add(BridgeConstant.MINUS);
        binaryOp.add(BridgeConstant.PROD);
        binaryOp.add(BridgeConstant.DIV);
        ArrayList<String> unaryOp = new ArrayList<>();
        unaryOp.add(BridgeConstant.NOT);
        BinaryTree newNode;
        for (String temp : posix) {
            if (temp == null) {
                continue;
            }
            newNode = new BinaryTree(temp);
            if (binaryOp.contains(temp)) {
                if (stack.getTop() < 1) {
                    logger.info("Stack underflow for binary operator");
                    return null;
                }
                newNode.setRight((BinaryTree) stack.pop());
                newNode.setLeft((BinaryTree) stack.pop());
            } else if (unaryOp.contains(temp)) {
                if (stack.getTop() < 0) {
                    logger.info("Stack underflow for unary operator");
                    return null;
                }
                newNode.setLeft((BinaryTree) stack.pop());
            }
            stack.push(newNode);
        }
        if (stack.getTop() == 0) {
            return (BinaryTree) stack.pop();
        }
        logger.info("Invalid posix expression for binary tree: {}", posix);
        return null;
    }
    public static BinaryTree createBinaryTree(ArrayList<String> infix) {
        ArrayList<String> postFix = BinaryTree.infixToPostfix(infix);
        return createBinaryTreeUsingPosix(postFix);
    }
}
