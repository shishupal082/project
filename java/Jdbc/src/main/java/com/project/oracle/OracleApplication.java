package com.project.oracle;

import com.project.common.Logger;
import com.project.oracle.model.Data;
import com.project.oracle.model.OracleDatabaseConfig;
import com.project.oracle.service.TableOracleDb;

import java.util.ArrayList;
import java.util.HashMap;

public class OracleApplication {
    public void run() {
        String driver = "oracle.jdbc.driver.OracleDriver";
        String url = "jdbc:oracle:thin:@10.130.4.50:1521:xe";
        String username = "system";
        String password = "admin";
        Data sampleData = new Data();
        OracleDatabaseConfig oracleDatabaseConfig = new OracleDatabaseConfig(driver, url, username, password);
        TableOracleDb tableOracleDb = new TableOracleDb(oracleDatabaseConfig);
        HashMap<String, String> filterParam = new HashMap<>();
        //
        ArrayList<HashMap<String, String>> result = tableOracleDb.getByMultipleParameter(filterParam);
        Logger.info(Integer.toString(result.size()));
        Logger.info(result.toString());
        //
        filterParam.put("asset_code", "Test-DCTMURI00002");
        result = tableOracleDb.getByMultipleParameter(filterParam);
        Logger.info(Integer.toString(result.size()));
        Logger.info(result.toString());

        //
        filterParam.put("asset_code", "Test-DCTMURI00002");
        filterParam.put("deleted", "FALSE");
        result = tableOracleDb.getByMultipleParameter(filterParam);
        Logger.info(Integer.toString(result.size()));
        Logger.info(result.toString());
    }
}
