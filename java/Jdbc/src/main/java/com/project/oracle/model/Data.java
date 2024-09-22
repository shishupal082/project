package com.project.oracle.model;

import java.util.ArrayList;
import java.util.Arrays;

public class Data {
    public ArrayList<String> getTableData() {
        String str = "2024-08-08,Test Muri-Jhalida,Test ADSTE/MURI,2,DC Track Circuit,Test-DCTMURI00002,96BTF,,,,,23.3713117,85.8663751,,,Test Muri,Station/IBH,Test Muri-Jhalida,Test Ranchi,Test South Eastern Railway,Survey Completed";
        String[] strArr = str.split(",");
        return new ArrayList<>(Arrays.asList(strArr));
    }
    public ArrayList<String> getTableColumn() {
        ArrayList<String> columnNames = new ArrayList<>();
        columnNames.add("file_date");
        columnNames.add("sub_section");
        columnNames.add("section_officer");
        columnNames.add("s_no");
        columnNames.add("asset_type");
        columnNames.add("asset_code");
        columnNames.add("gear_name");
        columnNames.add("rfid");
        columnNames.add("make");
        columnNames.add("model");
        columnNames.add("serial_no");
        columnNames.add("latitude");
        columnNames.add("longitude");
        columnNames.add("installation_date");
        columnNames.add("waranty_expiry_date");
        columnNames.add("location");
        columnNames.add("location_type");
        columnNames.add("section");
        columnNames.add("division");
        columnNames.add("zone");
        columnNames.add("status");
        return columnNames;
    }
}
