import $S from "../../interface/stack.js";

import Api from '../../common/Api.js';
import AppHandler from '../../common/app/common/AppHandler.js';
import Config from "../common/Config";
import DataHandler from "../common/DataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";


var PermissionControl;

(function($S){
PermissionControl = function(arg) {
    return new PermissionControl.fn.init(arg);
};

PermissionControl.fn = PermissionControl.prototype = {
    constructor: PermissionControl,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(PermissionControl);

PermissionControl.extend({
    loadRolesConfig: function(callback) {
        var url = Config.getApiUrl("getRolesConfig", null, true);
        var appControlApi = Config.getApiUrl("appControlDataApi", null, true);
        if (!$S.isString(url)) {
            return $S.callMethod(callback);
        }
        $S.loadJsonData(null, [url], function(response, apiName, ajax){
            if ($S.isObject(response) && response["status"] === "SUCCESS" && $S.isObject(response["data"])) {
                DataHandler.setData("rolesConfig", response["data"]);
            }
            AppHandler.loadAppControlData(appControlApi, null, null, null, function(list1Data, metaData) {
                DataHandler.setData("appControlData", metaData);
                $S.callMethod(callback);
            });
        }, function() {
            $S.log("Load rolesConfig complete.");
        }, "rolesConfig", Api.getAjaxApiCallMethod());
    }
});

PermissionControl.extend({
    setFinalTableData: function() {
        var rolesConfig = DataHandler.getData("rolesConfig", {});
        var response = {};
        if ($S.isObject(rolesConfig) && $S.isObject(rolesConfig["userRolesMapping"])) {
            response = rolesConfig["userRolesMapping"];
        }
        DataHandler.setData("permission_control.response", response);
        if (!$S.isObject(response)) {
            response = {};
        }
        var tempValidPermission = [], tempListPermission = [], validPermission = {}, i, username;
        for(username in response) {
            if ($S.isArray(response[username])) {
                tempListPermission = tempListPermission.concat(response[username]);
            }
        }
        for(i=0; i<tempListPermission.length; i++) {
            if (tempValidPermission.indexOf(tempListPermission[i]) < 0) {
                tempValidPermission.push(tempListPermission[i]);
            }
        }
        tempValidPermission = tempValidPermission.sort();
        for(i=0; i<tempValidPermission.length; i++) {
            for(username in response) {
                if (!$S.isArray(response[username])) {
                    continue;
                }
                if (response[username].indexOf(tempValidPermission[i]) >= 0) {
                    if ($S.isArray(validPermission[tempValidPermission[i]])) {
                        validPermission[tempValidPermission[i]].push(username);
                    } else {
                        validPermission[tempValidPermission[i]] = [username];
                    }
                }
            }
        }
        DataHandler.setData("permission_control.validPermissionList", tempValidPermission);
    },
    getRenderData: function() {
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var response = DataHandler.getData("permission_control.response", []);
        var tempValidPermission = DataHandler.getData("permission_control.validPermissionList", []);
        var currentList1Data = DataHandler.getCurrentList1Data();
        var tableData = [], permissionMonitoringList;
        var firstRow = ["Username"], temp;
        var i, j, username;
        if ($S.isObject(currentList1Data)) {
            permissionMonitoringList = currentList1Data.value;
        }
        if ($S.isArray(permissionMonitoringList) && permissionMonitoringList.length > 0) {
            firstRow = firstRow.concat(permissionMonitoringList);
        } else {
            firstRow = firstRow.concat(tempValidPermission);
        }
        tableData.push(firstRow)
        for(username in response) {
            temp = [username];
            for(i=1; i<firstRow.length; i++) {
                if ($S.isArray(response[username]) && response[username].indexOf(firstRow[i]) >= 0) {
                    temp.push(firstRow[i]);
                } else {
                    temp.push("");
                }
            }
            tableData.push(temp);
        }
        var permissionControlPattern = [], data = [];
        for(i=0; i<firstRow.length; i++) {
            permissionControlPattern.push({"name": firstRow[i], "isSortable": true, "tableName": "table1"});
        }
        for(i=1; i<tableData.length; i++) {
            temp = {};
            for(j=0; j<tableData[i].length; j++) {
                if (j===0) {
                    temp["Username"] = tableData[i][j];
                } else {
                    temp[tableData[i][j]] = tableData[i][j];
                }
            }
            data.push(temp);
        }
        var finalTable = DBViewDataHandler.GetFinalTable({"table1": {"tableData": data}}, permissionControlPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        return renderData;
    },
    getRenderFieldRow: function() {
        var currentList3Data = null, dateParameterField = null;
        var renderData = this.getRenderData();
        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        return {"tag": "div", "className": "", "text": renderFieldRow};
    }
});
})($S);

export default PermissionControl;
