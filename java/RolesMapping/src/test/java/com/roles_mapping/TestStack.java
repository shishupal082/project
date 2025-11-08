package com.roles_mapping;

import com.roles_mapping.service.BinaryTree;
import com.roles_mapping.service.ExpressionEvaluator;
import com.roles_mapping.service.Stack;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;

public class TestStack {
    @Test
    public void testStack() {
        Stack stack = new Stack();
        Assert.assertEquals(-1, stack.getTop());
        stack.push("Str");
        Assert.assertEquals(0, stack.getTop());
        String str = (String) stack.pop();
        Assert.assertEquals("Str", str);
        Assert.assertEquals(-1, stack.getTop());
    }

    @Test
    public void testBinaryTree() {
        ExpressionEvaluator expressionEvaluator = new ExpressionEvaluator();

        String str = "(one&two)";
        ArrayList<String> strings = expressionEvaluator.tokenizeBinary(str);
        BinaryTree binaryTree = BinaryTree.createBinaryTree(strings);
        ArrayList<String> post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(3, post.size());

        str = "(~one)";
        strings = expressionEvaluator.tokenizeBinary(str);
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(2, post.size());


        str = "~one";
        strings = expressionEvaluator.tokenizeBinary(str);
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(2, post.size());

        str = "(~one&two)";
        strings = expressionEvaluator.tokenizeBinary(str);
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(4, post.size());


        str = "((~one&two)";
        strings = expressionEvaluator.tokenizeBinary(str);
        binaryTree = BinaryTree.createBinaryTree(strings);
        Assert.assertNull(binaryTree);

        str = "((~one)&two)";
        strings = expressionEvaluator.tokenizeBinary(str);
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(4, post.size());

        str = "(~Q&(R|S|T))";
        strings = expressionEvaluator.tokenizeBinary(str);
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("Q~RST||&", String.join("", post));
        Assert.assertEquals(8, post.size());

        str = "(P&(~Q&(R|S|T)))";
        strings = expressionEvaluator.tokenizeBinary(str);
        Assert.assertEquals(16, strings.size());
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("PQ~RST||&&", String.join("", post));
        Assert.assertEquals(10, post.size());

        str = "P&(~Q&(R|S|T))";
        strings = expressionEvaluator.tokenizeBinary(str);
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals("PQ~RST||&&", String.join("", post));

        str = "(A&(B&(C&(D&(E&(~E&(F&(G&((H&(J&(K&(L&(M&(N&(P&(~Q&(R|S|T))))))))))))))))))";
        strings = expressionEvaluator.tokenizeBinary(str);
        Assert.assertEquals(75, strings.size());
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(39, post.size());
        Assert.assertEquals("ABCDEE~FGHJKLMNPQ~RST||&&&&&&&&&&&&&&&&", String.join("", post));

        str = "(1&(2&(3&(4&(5&(~6&(7&(8&((9&(10&(11&(12&(13&(14&(15&(~16&(17|18|19)))))))))|(20&(21&(~22&(23&(24&(((12&~25&26)|(27&13&14&~28&29))&(30|31))))))))))))))))";
        strings = expressionEvaluator.tokenizeBinary(str);
        Assert.assertEquals(128, strings.size());
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(72, post.size());
        Assert.assertEquals("123456~78910111213141516~171819||&&&&&&&&202122~23241225~26&&27131428~29&&&&|3031|&&&&&&|&&&&&&&&", String.join("", post));

        str = "(S12/13-AU_R_S&(2/3-ZU_R_R&(12-TPR&(13-TPR&(5-U_R_LR&(~5-U_N_LR&(5A-TPR&(2/3-TPR&((5-ADUCR&(ML-ZU_R_R&(M-TPR&(4-NWKR&(10/11-TPR&(4A-TPR&(OV11-Z2U_R_R&(~ML-ZU_N_R&(S11-RECR|S11-HECR|S11-DECR)))))))))|(5-BDUCR&(5B-TPR&(~LL-ZU_N_R&(L-TPR&(4B-TPR&(((4-NWKR&~OV10/1-Z2U_N_R&OV10/1-Z2U_R_R)|(4-RWKR&10/11-TPR&4A-TPR&~OV10/2-Z2U_N_R&OV10/2-Z2U_R_R))&(S10-RECR|S10-HECR))))))))))))))))";
        strings = expressionEvaluator.tokenizeBinary(str);
        Assert.assertEquals(128, strings.size());
        binaryTree = BinaryTree.createBinaryTree(strings);
        post = binaryTree.getPostOrder(binaryTree);
        Assert.assertEquals(72, post.size());
    }
}
