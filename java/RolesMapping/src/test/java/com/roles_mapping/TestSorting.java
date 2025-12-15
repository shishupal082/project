package com.roles_mapping;

import com.roles_mapping.config.BridgeConstant;
import com.roles_mapping.service.SortingService;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

public class TestSorting {
    private SortingService sortingService = new SortingService();
    @Test
    public void testSorting() {
        ArrayList<ArrayList<String>> result, excelData;
        result = sortingService.sortExcelData(null, null, null, null, null, null);
        Assert.assertNull(result);
        excelData = new ArrayList<>();
        result = sortingService.sortExcelData(excelData, null, null, null, null, null);
        Assert.assertEquals(0, result.size());
        excelData.add(new ArrayList<>(Arrays.asList("CRR,R2,A,3".split(","))));
        excelData.add(new ArrayList<>(Arrays.asList("WG,R4,B,2".split(","))));
        excelData.add(new ArrayList<>(Arrays.asList("CRR,R2,C,10".split(","))));
        result = sortingService.sortExcelData(excelData, null, null, null, null, null);
        Assert.assertEquals(3, result.size());
        Assert.assertEquals("CRR", result.get(0).get(0));
        Assert.assertEquals("WG", result.get(1).get(0));
        result = sortingService.sortExcelData(excelData, 0, null,null, null, null);
        Assert.assertEquals("CRR", result.get(1).get(0));
        result = sortingService.sortExcelData(excelData, 0, null, BridgeConstant.DESC, null, null);
        //"WG,R4,B,2"
        //"CRR,R2,A,3"
        //"CRR,R2,C,10"
        Assert.assertEquals("WG", result.get(0).get(0));
        Assert.assertEquals("CRR", result.get(1).get(0));
        Assert.assertEquals("2", result.get(0).get(3));
        result = sortingService.sortExcelData(result, 3, null, BridgeConstant.DESC, BridgeConstant.INT, null);
        //"CRR,R2,C,10"
        //"CRR,R2,A,3"
        //"WG,R4,B,2"
        Assert.assertEquals("10", result.get(0).get(3));
        Assert.assertEquals("3", result.get(1).get(3));
        Assert.assertEquals("2", result.get(2).get(3));
        result = sortingService.sortExcelData(result, 6, null, BridgeConstant.DESC, BridgeConstant.INT, null);
        //No change (Index out of range)
        Assert.assertEquals("10", result.get(0).get(3));
        Assert.assertEquals("3", result.get(1).get(3));
        Assert.assertEquals("2", result.get(2).get(3));
        result = sortingService.sortExcelData(result, 2, null, BridgeConstant.DESC, BridgeConstant.STRING, null);
        //"CRR,R2,C,10"
        //"WG,R4,B,2"
        //"CRR,R2,A,3"
        Assert.assertEquals("C", result.get(0).get(2));
        Assert.assertEquals("B", result.get(1).get(2));
        Assert.assertEquals("A", result.get(2).get(2));
        result = sortingService.sortExcelData(result, 1, null, BridgeConstant.DESC, BridgeConstant.INT, null);
        //No change (Due to data is string and type is int)
        Assert.assertEquals("C", result.get(0).get(2));
        Assert.assertEquals("B", result.get(1).get(2));
        Assert.assertEquals("A", result.get(2).get(2));
        result.get(0).add("Name");
        //"CRR,R2,C,10,Name"
        //"WG,R4,B,2"
        //"CRR,R2,A,3"
        result = sortingService.sortExcelData(result, 4, null, BridgeConstant.DESC, null, null);
        //No change (Due to data already sorted)
        Assert.assertEquals("Name", result.get(0).get(4));
        Assert.assertEquals("2", result.get(1).get(3));
        Assert.assertEquals("3", result.get(2).get(3));
        result = sortingService.sortExcelData(result, 4, null, BridgeConstant.ASC, null, null);
        //"WG,R4,B,2"
        //"CRR,R2,A,3"
        //"CRR,R2,C,10,Name"
        Assert.assertEquals("2", result.get(0).get(3));
        Assert.assertEquals("3", result.get(1).get(3));
        Assert.assertEquals("10", result.get(2).get(3));
        Assert.assertEquals("Name", result.get(2).get(4));
        result.get(0).add("Name2");
        result.get(0).add("4");
        result.get(2).add("-3");
        //"WG,R4,B,2,Name2,4"
        //"CRR,R2,A,3"
        //"CRR,R2,C,10,Name,-3"
        result = sortingService.sortExcelData(result, 5, null, BridgeConstant.ASC, BridgeConstant.STRING, null);
        //"CRR,R2,A,3"
        //"CRR,R2,C,10,Name,-3"
        //"WG,R4,B,2,Name2,4"
        Assert.assertEquals("3", result.get(0).get(3));
        Assert.assertEquals("A", result.get(0).get(2));
        Assert.assertEquals("-3", result.get(1).get(5));
        Assert.assertEquals("4", result.get(2).get(5));
        result = sortingService.sortExcelData(result, 5, null, BridgeConstant.ASC, BridgeConstant.INT, null);
        //"CRR,R2,C,10,Name,-3"
        //"CRR,R2,A,3"
        //"WG,R4,B,2,Name2,4"
        Assert.assertEquals("3", result.get(1).get(3));
        Assert.assertEquals("A", result.get(1).get(2));
        Assert.assertEquals("-3", result.get(0).get(5));
        Assert.assertEquals("4", result.get(2).get(5));
        result = sortingService.sortExcelData(result, 5, null, BridgeConstant.ASC, BridgeConstant.INT, "-4");
        //"CRR,R2,A,3"
        //"CRR,R2,C,10,Name,-3"
        //"WG,R4,B,2,Name2,4"
        Assert.assertEquals("3", result.get(0).get(3));
        Assert.assertEquals("A", result.get(0).get(2));
        Assert.assertEquals("-3", result.get(1).get(5));
        Assert.assertEquals("4", result.get(2).get(5));
    }
    @Test
    public void testSortingWithHeading() {
        ArrayList<ArrayList<String>> result, excelData;
        excelData = new ArrayList<>();
        excelData.add(new ArrayList<>(Arrays.asList("Location,Rack,Row,Column".split(","))));
        excelData.add(new ArrayList<>(Arrays.asList("CRR,R2,A,3".split(","))));
        excelData.add(new ArrayList<>(Arrays.asList("WG,R4,B,2".split(","))));
        excelData.add(new ArrayList<>(Arrays.asList("CRR,R2,C,10".split(","))));
        result = sortingService.sortExcelData(excelData, null, null, null, null, null);
        //Result no change due to index null
        Assert.assertEquals(4, result.size());
        Assert.assertEquals("WG", result.get(2).get(0));
        Assert.assertEquals("CRR", result.get(1).get(0));
        Assert.assertEquals("Location", result.get(0).get(0));
        result = sortingService.sortExcelData(excelData, 0, null, BridgeConstant.DESC, null, null);
        //Sorting done including heading
        //"WG,R4,B,2"
        //"Location,Rack,Row,Column"
        //"CRR,R2,A,3"
        //"CRR,R2,C,10"
        Assert.assertEquals("WG", result.get(0).get(0));
        Assert.assertEquals("Location", result.get(1).get(0));
        Assert.assertEquals("CRR", result.get(2).get(0));
        result = sortingService.sortExcelData(excelData, 0, new ArrayList<>(Collections.singletonList(0)), BridgeConstant.DESC, null, null);
        //First row skipped for sorting
        //"Location,Rack,Row,Column"
        //"WG,R4,B,2"
        //"CRR,R2,A,3"
        //"CRR,R2,C,10"
        Assert.assertEquals("Location", result.get(0).get(0));
        Assert.assertEquals("WG", result.get(1).get(0));
        Assert.assertEquals("CRR", result.get(2).get(0));
    }
}
