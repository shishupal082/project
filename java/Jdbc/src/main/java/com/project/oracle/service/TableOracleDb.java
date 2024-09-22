package com.project.oracle.service;

import com.project.common.Logger;
import com.project.oracle.model.OracleConnection;
import com.project.oracle.model.OracleDatabaseConfig;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class TableOracleDb {
    private static final Logger logger = new Logger();
    private final OracleConnection oracleConnection;
    public TableOracleDb(OracleDatabaseConfig oracleDatabaseConfig) {
        this.oracleConnection = new OracleConnection(oracleDatabaseConfig);
    }
    private String getEqualQuery(ArrayList<String> finalQueryParam, String colName, ArrayList<String> filterValues) {
        if (filterValues == null || filterValues.isEmpty()) {
            return null;
        }
        if (finalQueryParam == null) {
            finalQueryParam = new ArrayList<>();
        }
        String filterQuery = "";
        if (filterValues.size() > 1) {
            filterQuery = "(";
        }
        int i=0;
        for (String str : filterValues) {
            if (i==0) {
                filterQuery = filterQuery.concat(colName + "='" + str + "'");
            } else {
                filterQuery = filterQuery.concat(" or " + colName + "='" + str + "'");
            }
//            finalQueryParam.add(str);
            i++;
        }
        if (filterValues.size() > 1) {
            filterQuery = filterQuery.concat(")");
        }
        return filterQuery;
    }
    private String getLikeQuery(ArrayList<String> finalQueryParam, String colName, ArrayList<String> filterValues) {
        if (filterValues == null || filterValues.isEmpty()) {
            return null;
        }
        if (finalQueryParam == null) {
            finalQueryParam = new ArrayList<>();
        }
        //For reading .pdf or .csv file
         String filterQuery = "";
        if (filterValues.size() > 1) {
            filterQuery = "(";
        }
        int i=0;
        for (String str : filterValues) {
            if (i==0) {
                filterQuery = filterQuery.concat(colName + " like ?");
            } else {
                filterQuery = filterQuery.concat(" or " + colName + " like ?");
            }
//            finalQueryParam.add(str);
            i++;
        }
        if (filterValues.size() > 1) {
            filterQuery = filterQuery.concat(")");
        }
        return filterQuery;
    }
    private ArrayList<HashMap<String, String>> generateTableData(ArrayList<String> columnNames, ResultSet rs) {
        ArrayList<HashMap<String, String>> result = new ArrayList<>();
        HashMap<String, String> rowData;
        String value;
        if (rs == null || columnNames == null) {
            return null;
        }

        try {
            while (rs.next()) {
                rowData = new HashMap<>();
                for (String columnName: columnNames) {
                    if (columnName == null || columnName.isEmpty()) {
                        continue;
                    }
                    value = rs.getString(columnName);
                    rowData.put(columnName, value);
                }
                result.add(rowData);
            }
        } catch (Exception e) {
            result = null;
            logger.info("Error in reading data parsing mysql: {}", e.toString());
        }
        return result;
    }
    public ArrayList<HashMap<String, String>> getByMultipleParameter(HashMap<String, String> filterParameter) {

        ArrayList<String> finalQueryParam = new ArrayList<>();
        StringBuilder filterQuery = new StringBuilder();
        String columnName;
        String filterValue;
        String tempFilterQuery;
        boolean isAndRequired = false;
        if (filterParameter != null) {
            for(Map.Entry<String, String> set: filterParameter.entrySet()) {
                if (set == null) {
                    continue;
                }
                columnName = set.getKey();
                filterValue = set.getValue();
                if (columnName == null || columnName.isEmpty() || filterValue == null || filterValue.isEmpty()) {
                    continue;
                }
                tempFilterQuery = columnName + "='"+filterValue+"'";
                if (isAndRequired) {
                    filterQuery.append(" and ");
                }
//                finalQueryParam.add(filterValue);
                filterQuery.append(tempFilterQuery);
                isAndRequired = true;
            }
        }
        String whereClause = "";
        if (!filterQuery.toString().isEmpty()) {
            whereClause = " where (" + filterQuery + ")";
        }
        String query = "select * from smms_assets " + whereClause;
        logger.info("getByMultipleParameter: Query: ", query, finalQueryParam.toString());
        ResultSet rs = oracleConnection.query(query, finalQueryParam);
        ArrayList<String> columnNames = new ArrayList<>();
        columnNames.add("added_time");
        return this.generateTableData(columnNames, rs);
    }
    /*
    public void updateTableEntry(HashMap<String, String> data,
                                 HashMap<String, ArrayList<String>> requestFilterParameter) {
        if (tableConfiguration == null || data == null || StaticService.isInValidString(tableConfiguration.getTableName())) {
            return;
        }
        ArrayList<String> updateColumnName = tableConfiguration.getUpdateColumnName();
        if (updateColumnName == null) {
            return;
        }
        boolean isDeletedEnabled = this.isDeletedEnabled(tableConfiguration);
        StringBuilder filterQuery = new StringBuilder();
        StringBuilder setDataParameter = new StringBuilder();
        String columnName;
        ArrayList<String> filterParameter;
        ArrayList<String> finalQueryParam = new ArrayList<>();
        if (!isDeletedEnabled) {
            if (requestFilterParameter == null) {
                requestFilterParameter = new HashMap<>();
            }
            ArrayList<String> temp = new ArrayList<>();
            temp.add("FALSE");
            requestFilterParameter.put("deleted", temp);
        }
        int index = 0;
        int lastIndex = updateColumnName.size()-1;
        for(String col: updateColumnName) {
            setDataParameter.append(col).append("=?");
            if (index != lastIndex) {
                setDataParameter.append(",");
            }
            finalQueryParam.add(data.get(col));
            index++;
        }
        String tempFilterQuery;
        boolean isAndRequired = false;
        if (requestFilterParameter != null) {
            for(Map.Entry<String, ArrayList<String>> set: requestFilterParameter.entrySet()) {
                if (set == null) {
                    continue;
                }
                columnName = set.getKey();
                filterParameter = set.getValue();
                if (columnName == null || columnName.isEmpty() || filterParameter == null) {
                    continue;
                }
                tempFilterQuery = this.getEqualQuery(finalQueryParam, columnName, filterParameter);
                if (tempFilterQuery != null && !tempFilterQuery.isEmpty()) {
                    if (isAndRequired) {
                        filterQuery.append(" and ");
                    }
                    filterQuery.append(tempFilterQuery);
                    isAndRequired = true;
                }
            }
        }
        String query = "UPDATE " + tableConfiguration.getTableName() + " SET " +
                setDataParameter +
                " WHERE " + filterQuery;
        try {
            oracleConnection.updateQueryV2(query, finalQueryParam);
        } catch (Exception e) {
            logger.info("updateEntry: error in query: {}, {}", query, e.getMessage());
        }
    }
    public void addTableEntry(TableConfiguration tableConfiguration, HashMap<String, String> data) {
        if (tableConfiguration == null || data == null || StaticService.isInValidString(tableConfiguration.getTableName())) {
            return;
        }
        ArrayList<String> updateColumnName = tableConfiguration.getUpdateColumnName();
        if (updateColumnName == null) {
            return;
        }
        StringBuilder setDataParameter = new StringBuilder();
        StringBuilder setValueParameter = new StringBuilder();
        ArrayList<String> finalQueryParam = new ArrayList<>();
        int index = 0;
        int lastIndex = updateColumnName.size()-1;
        for(String col: updateColumnName) {
            setDataParameter.append(col);
            setValueParameter.append("?");
            if (index != lastIndex) {
                setDataParameter.append(",");
                setValueParameter.append(",");
            }
            finalQueryParam.add(data.get(col));
            index++;
        }
        String query = "INSERT INTO " + tableConfiguration.getTableName() + " (" + setDataParameter + ")" +
                " VALUES(" + setValueParameter + ")";
        try {
            oracleConnection.updateQueryV2(query, finalQueryParam);
        } catch (Exception e) {
            logger.info("addTableEntry: error in query: {}, {}, {}", query, finalQueryParam.toString(), e.getMessage());
        }
    }
    public void addEntry(TableConfiguration tableConfiguration, HashMap<String, String> data, Integer entryCount0) {
        if (tableConfiguration == null || data == null) {
            return;
        }
        int entryCount;
        if (entryCount0 != null) {
            entryCount = entryCount0;
        } else {
            entryCount = this.getEntryCount(tableConfiguration, data);
        }
        if (entryCount > 0) {
            logger.info("addEntry: Entry already exist for data, add not possible. " +
                    "tableConfiguration: {},  data: {}", tableConfiguration, data);
            return;
        }
        ArrayList<String> uniquePattern = tableConfiguration.getUniquePattern();
        if (uniquePattern == null || uniquePattern.isEmpty()) {
            logger.info("addEntry: Configuration error. uniquePattern is null or empty: {}, data: {}", uniquePattern, data);
            return;
        }
        this.addTableEntry(tableConfiguration, data);
    }
    public ArrayList<HashMap<String, String>> searchData(HashMap<String, String> filterData) {
        if (filterData == null) {
            return null;
        }
        return this.getByMultipleParameter(filterData, false);
    }
    public int getEntryCount(TableConfiguration tableConfiguration, HashMap<String, String> data) {
        ArrayList<HashMap<String, String>> existingData = this.searchData(tableConfiguration, data);
        if (existingData == null || existingData.isEmpty()) {
            return 0;
        }
        return existingData.size();
    }
    public void updateEntry(TableConfiguration tableConfiguration, HashMap<String, String> data, Integer entryCount0) {
        if (tableConfiguration == null || data == null) {
            return;
        }
        int entryCount;
        if (entryCount0 != null) {
            entryCount = entryCount0;
        } else {
            entryCount = this.getEntryCount(tableConfiguration, data);
        }
        if (entryCount != 1) {
            logger.info("updateEntry: Unique entry not exist, update not possible.");
            return;
        }
        ArrayList<String> uniquePattern = tableConfiguration.getUniquePattern();
        if (uniquePattern == null || uniquePattern.isEmpty()) {
            return;
        }
        HashMap<String, ArrayList<String>> requestFilterParameter = new HashMap<>();
        ArrayList<String> filterParam;
        String columnValue;
        for(String columnName: uniquePattern) {
            columnValue = data.get(columnName);
            filterParam = new ArrayList<>();
            filterParam.add(columnValue);
            requestFilterParameter.put(columnName, filterParam);
        }
        this.updateTableEntry(tableConfiguration, data, requestFilterParameter);
    }*/
}
