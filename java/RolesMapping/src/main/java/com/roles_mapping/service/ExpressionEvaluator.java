package com.roles_mapping.service;

import com.roles_mapping.config.BridgeConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

public class ExpressionEvaluator {
    final static Logger logger = LoggerFactory.getLogger(ExpressionEvaluator.class);
    private final ArrayList<String> binaryVal = new ArrayList<>();
    private final ArrayList<String> binaryOp = new ArrayList<>();
    private final ArrayList<String> unaryOp = new ArrayList<>();
    private final ArrayList<String> arithmeticOperator = new ArrayList<>();
    public ExpressionEvaluator() {
        binaryVal.add(BridgeConstant.TRUE);
        binaryVal.add(BridgeConstant.FALSE);
        binaryOp.add(BridgeConstant.AND);
        binaryOp.add(BridgeConstant.OR);
        unaryOp.add(BridgeConstant.NOT);

        arithmeticOperator.add(BridgeConstant.PLUS);
        arithmeticOperator.add(BridgeConstant.MINUS);
        arithmeticOperator.add(BridgeConstant.PROD);
        arithmeticOperator.add(BridgeConstant.DIV);
    }

    public ArrayList<String> tokenizeBinary(String expression) {
        ArrayList<String> tokens = new ArrayList<>();
        ArrayList<String> validTokens = new ArrayList<>();
        validTokens.add(BridgeConstant.OPENExp);
        validTokens.add(BridgeConstant.CLOSEExp);
        validTokens.add(BridgeConstant.ORExp);
        validTokens.add(BridgeConstant.AND);
        validTokens.add(BridgeConstant.NOT);
        if (expression == null) {
            return tokens;
        }
        String[] temp;
        int i;
        String t;
        for (i=0; i<validTokens.size(); i++) {
            t = validTokens.get(i);
            if (t == null) {
                continue;
            }
            t = t.trim();
            temp = BridgeStaticService.splitStringOnLimit(expression, t, -1);
            if (i == 0) {
                t = BridgeConstant.OPEN;
            } else if (i == 1) {
                t = BridgeConstant.CLOSE;
            } else if (i == 2) {
                t = BridgeConstant.OR;
            }
            expression = String.join(","+t+",", temp);
        }
        temp = expression.split(",");
        for (i=0; i<temp.length; i++) {
            if (!BridgeStaticService.isInValidString(temp[i])) {
                tokens.add(temp[i]);
            }
        }
        return tokens;
    }
    public ArrayList<String> tokenizeNumeric(String expression) {
        ArrayList<String> tokens = new ArrayList<>();
        ArrayList<String> validTokens = new ArrayList<>();
        validTokens.add(BridgeConstant.OPENExp);
        validTokens.add(BridgeConstant.CLOSEExp);
        validTokens.add(BridgeConstant.PLUSExp);
        validTokens.add(BridgeConstant.PRODExp);
        validTokens.add(BridgeConstant.MINUS);
        validTokens.add(BridgeConstant.DIV);
        if (expression == null) {
            return tokens;
        }
        String[] temp;
        int i;
        String t;
        for (i=0; i<validTokens.size(); i++) {
            t = validTokens.get(i);
            if (t == null) {
                continue;
            }
            t = t.trim();
            temp = BridgeStaticService.splitStringOnLimit(expression, t, -1);
            if (i == 0) {
                t = BridgeConstant.OPEN;
            } else if (i == 1) {
                t = BridgeConstant.CLOSE;
            } else if (i == 2) {
                t = BridgeConstant.PLUS;
            } else if (i == 3) {
                t = BridgeConstant.PROD;
            }
            expression = String.join(","+t+",", temp);
        }
        temp = expression.split(",");
        for (i=0; i<temp.length; i++) {
            if (!BridgeStaticService.isInValidString(temp[i])) {
                tokens.add(temp[i]);
            }
        }
        return tokens;
    }
    public Boolean evaluateBinaryExpression(String expression) {
        ArrayList<String> tokens = this.tokenizeBinary(expression);
        ArrayList<String> binaryPosix = BinaryTree.infixToPostfix(tokens);
        String result = this.evaluateBinaryPosix(binaryPosix);
        if (BridgeConstant.TRUE.equals(result) || BridgeConstant.FALSE.equals(result)) {
            return BridgeConstant.TRUE.equals(result);
        }
        return null;
    }
    public String evaluateNumericExpression(String expression) {
        ArrayList<String> tokens = this.tokenizeNumeric(expression);
        ArrayList<String> binaryPosix = BinaryTree.infixToPostfix(tokens);
        return this.evaluateNumericPosix(binaryPosix);
    }
    private String evaluate(String a, String op, String b) {
        boolean aV, bV;
        String value = null;
        if (binaryVal.contains(a)) {
            aV = BridgeConstant.TRUE.equals(a);
        } else {
            logger.info("Invalid boolean string: a={}", a);
            return null;
        }
        if (binaryVal.contains(b)) {
            bV = BridgeConstant.TRUE.equals(b);
        } else {
            logger.info("Invalid boolean string: b={}", b);
            return null;
        }
        switch (op) {
            case BridgeConstant.AND:
                value = Boolean.toString(aV && bV);
                break;
            case BridgeConstant.OR:
                value = Boolean.toString(aV || bV);
                break;
            case BridgeConstant.NOT:
                value = Boolean.toString(!aV);
                break;
            default:
                break;
        }
        return value;
    }
    private String evaluateNum(String a, String op, String b) {
        Double value = null;
        Double aV = null, bV = null;
        try {
            aV = Double.parseDouble(a);
            bV = Double.parseDouble(b);
        } catch (Exception e) {
            logger.info("String to double parsing error: {}, {}", a, b);
        }
        if (aV == null || bV == null) {
            return null;
        }
        switch (op) {
            case BridgeConstant.PLUS:
                value = aV + bV;
                break;
            case BridgeConstant.MINUS:
                value = aV - bV;
                break;
            case BridgeConstant.PROD:
                value = aV * bV;
                break;
            case BridgeConstant.DIV:
                if (bV != 0) {
                    value = aV / bV;
                } else {
                    logger.info("Divide by 0 found: {}, {}", aV, bV);
                }
                break;
            default:
                break;
        }
        if (value != null) {
            return Double.toString(value);
        }
        return null;
    }
    private String evaluateBinaryPosix(ArrayList<String> posix) {
        Stack st = new Stack();
        String a, b, op, temp;
        for (int i=0; i<posix.size(); i++) {
            op = posix.get(i);
            if (binaryOp.contains(op)) {
                a = (String) st.pop();
                b = (String) st.pop();
                temp = this.evaluate(a, op, b);
                st.push(temp);
            } else if (unaryOp.contains(op)) {
                a = (String) st.pop();
                temp = this.evaluate(a, op, "false");
                st.push(temp);
            } else {
                st.push(op);
            }
        }
        return (String) st.pop();
    }
    public String evaluateNumericPosix(ArrayList<String> posix) {
        Stack st = new Stack();
        String result;
        String a, b, op, temp;
        for (int i=0; i<posix.size(); i++) {
            op = posix.get(i);
            if (arithmeticOperator.contains(op)) {
                a = (String) st.pop();
                b = (String) st.pop();
                temp = this.evaluateNum(b, op, a);
                st.push(temp);
            } else {
                st.push(op);
            }
        }
        result = (String) st.pop();
        if (BridgeStaticService.isInValidString(result)) {
            return null;
        }
        return result;
    }
}
