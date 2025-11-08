package com.roles_mapping;

import com.roles_mapping.service.BinaryTree;
import com.roles_mapping.service.ExpressionEvaluator;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;

public class TestExpressionEvaluator {
    private final ExpressionEvaluator expressionEvaluator = new ExpressionEvaluator();
    @Test
    public void testEvaluateBinary() {
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("((true&true&true&true)&(~false))"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("(true&((false|true)&(true|false)))"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("(true&(false|true))"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("(true&true&true&true&true)"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("(true&(true&true&true&true))"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("((true&true&true&true)&true)"));
        Assert.assertFalse(expressionEvaluator.evaluateBinaryExpression("(true&(false&true))"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("(true&~false)"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("(true|false)"));
        Assert.assertFalse(expressionEvaluator.evaluateBinaryExpression("(true&false)"));
        Assert.assertFalse(expressionEvaluator.evaluateBinaryExpression("~true"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("true"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("~false"));
        Assert.assertFalse(expressionEvaluator.evaluateBinaryExpression("false"));

        Assert.assertNull(expressionEvaluator.evaluateBinaryExpression(null));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("(~false)"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("((~false))"));
        Assert.assertFalse(expressionEvaluator.evaluateBinaryExpression("(~true)"));
        Assert.assertNull(expressionEvaluator.evaluateBinaryExpression("(true&true1)"));
        Assert.assertNull(expressionEvaluator.evaluateBinaryExpression("(true1&true)"));
        Assert.assertTrue(expressionEvaluator.evaluateBinaryExpression("((~false)&(~false))"));
        Assert.assertNull(expressionEvaluator.evaluateBinaryExpression("(false&~)"));
    }
    @Test
    public void testEvaluateNumeric() {
        Assert.assertNull(expressionEvaluator.evaluateNumericExpression(null));
        Assert.assertNull(expressionEvaluator.evaluateNumericExpression("(2/0)"));
        Assert.assertNull(expressionEvaluator.evaluateNumericExpression("(p/q)"));
        Assert.assertNull(expressionEvaluator.evaluateNumericExpression("((2p+(2*2))/2)"));

        Assert.assertEquals("3.0", expressionEvaluator.evaluateNumericExpression("((2+(2*2))/2)"));
        Assert.assertEquals("6.0", expressionEvaluator.evaluateNumericExpression("(2+4)"));
        Assert.assertEquals("8.0", expressionEvaluator.evaluateNumericExpression("(2*(2+2))"));
        Assert.assertEquals("6.0", expressionEvaluator.evaluateNumericExpression("(2+(2*2))"));
        Assert.assertEquals("1.0", expressionEvaluator.evaluateNumericExpression("((2+(2-2))/2)"));
    }
    @Test
    public void testEvaluateNumericV2() {
        String expression = "2+2";
        ArrayList<String> tokens = expressionEvaluator.tokenizeNumeric(expression);
        ArrayList<String> binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("22+", String.join("",binaryPosix));
        String result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("4.0", result);

        expression = "2+2*2";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("222*+", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("6.0", result);

        expression = "2*2+2";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("222+*", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("8.0", result);

        expression = "2+2*2/2";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("2222/*+", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("4.0", result);
        Assert.assertEquals("4.0", expressionEvaluator.evaluateNumericExpression(expression));
    }
    @Test
    public void testEvaluateNumericV3() {
        //Example 1
        String expression = "2+2*2";
        ArrayList<String> tokens = expressionEvaluator.tokenizeNumeric(expression);
        ArrayList<String> binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("222*+", String.join("",binaryPosix));
        String result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("6.0", result);

        expression = "2+(2*2)";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("222*+", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("6.0", result);

        expression = "(2+2)*2";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("22+2*", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("8.0", result);
        //Example 2
        expression = "3*2+4/2";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("3242/+*", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("12.0", result);

        expression = "3*(2+4)/2";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("324+2/*", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("9.0", result);

        expression = "3*2+(4/2)";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("3242/+*", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("12.0", result);

        expression = "3*(2+(4/2))";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("3242/+*", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("12.0", result);

        expression = "(3*(2+(4/2)))";
        tokens = expressionEvaluator.tokenizeNumeric(expression);
        binaryPosix = BinaryTree.infixToPostfix(tokens);
        Assert.assertEquals("3242/+*", String.join("",binaryPosix));
        result = expressionEvaluator.evaluateNumericPosix(binaryPosix);
        Assert.assertEquals("12.0", result);
    }
    @Test
    public void testEvaluateNumericV5() {
        //Example 1
        String expression = "2+2*2";
        ArrayList<String> infix = expressionEvaluator.tokenizeNumeric(expression);
        ArrayList<String> postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("222*+", String.join("",postFix));
        String result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("6.0", result);

        expression = "2+(2*2)";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("222*+", String.join("",postFix));
        result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("6.0", result);

        expression = "(2+2)*2";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("22+2*", String.join("",postFix));
        result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("8.0", result);
        //Example 2
        expression = "3*2+4/2";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("3242/+*", String.join("",postFix));
        result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("12.0", result);

        expression = "3*(2+4)/2";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("324+2/*", String.join("",postFix));
        result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("9.0", result);

        expression = "3*2+(4/2)";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("3242/+*", String.join("",postFix));
        result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("12.0", result);

        expression = "3*(2+(4/2))";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("3242/+*", String.join("",postFix));
        result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("12.0", result);

        expression = "(3*(2+(4/2)))";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("3242/+*", String.join("",postFix));
        result = expressionEvaluator.evaluateNumericPosix(postFix);
        Assert.assertEquals("12.0", result);

        expression = "2*3*+5";
        infix = expressionEvaluator.tokenizeNumeric(expression);
        BinaryTree binaryTree = BinaryTree.createBinaryTree(infix);
        Assert.assertNull(binaryTree);

        expression = "A&B&~C";
        infix = expressionEvaluator.tokenizeBinary(expression);
        binaryTree = BinaryTree.createBinaryTree(infix);
        postFix = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("ABC~&&", String.join("", postFix));

        expression = "A&B&(~C)";
        infix = expressionEvaluator.tokenizeBinary(expression);
        binaryTree = BinaryTree.createBinaryTree(infix);
        postFix = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("ABC~&&", String.join("", postFix));

        expression = "A&B&(~~C)";
        infix = expressionEvaluator.tokenizeBinary(expression);
        binaryTree = BinaryTree.createBinaryTree(infix);
        postFix = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("ABC~~&&", String.join("", postFix));

        expression = "~~C";
        infix = expressionEvaluator.tokenizeBinary(expression);
        binaryTree = BinaryTree.createBinaryTree(infix);
        postFix = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("C~~", String.join("", postFix));

        expression = "~A";
        infix = expressionEvaluator.tokenizeBinary(expression);
        binaryTree = BinaryTree.createBinaryTree(infix);
        postFix = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("A~", String.join("", postFix));


        expression = "~";
        infix = expressionEvaluator.tokenizeBinary(expression);
        binaryTree = BinaryTree.createBinaryTree(infix);
        Assert.assertNull(binaryTree);
    }
    @Test
    public void testInfixToPostFix() {
        String str;
        ArrayList<String> infix, postFix;

        str = "P&Q";
        infix = expressionEvaluator.tokenizeBinary(str);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("PQ&", String.join("", postFix));

        str = "P&(Q&R)";
        infix = expressionEvaluator.tokenizeBinary(str);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("PQR&&", String.join("", postFix));

        str = "P&(~Q&(R|S|T))";
        infix = expressionEvaluator.tokenizeBinary(str);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("PQ~RST||&&", String.join("", postFix));
        Assert.assertEquals(10, postFix.size());

        str = "(P&(~Q&(R|S|T)))";
        infix = expressionEvaluator.tokenizeBinary(str);
        postFix = BinaryTree.infixToPostfix(infix);
        Assert.assertEquals("PQ~RST||&&", String.join("", postFix));
        Assert.assertEquals(10, postFix.size());
    }
}
