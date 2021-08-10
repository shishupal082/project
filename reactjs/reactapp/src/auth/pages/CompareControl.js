import $S from "../../interface/stack.js";

import DataHandler from "../common/DataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";


var CompareControl;

(function($S){
CompareControl = function(arg) {
    return new CompareControl.fn.init(arg);
};

CompareControl.fn = CompareControl.prototype = {
    constructor: CompareControl,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(CompareControl);

CompareControl.extend({
    setFinalTableData: function() {
        var rolesConfig = DataHandler.getData("rolesConfig", {});
        if (!$S.isObject(rolesConfig)) {
            rolesConfig = {};
        }
        var roleAccess = rolesConfig.roleAccess;
        var relatedUsers = rolesConfig.relatedUsers;
        var allUsername = [];
        if (!$S.isObject(roleAccess)) {
            roleAccess = {};
        }
        if (!$S.isObject(relatedUsers)) {
            relatedUsers = {};
        }
        for (var roleAccessName in roleAccess) {
            if (!$S.isArray(roleAccess[roleAccessName])) {
                continue;
            }
            allUsername = allUsername.concat(roleAccess[roleAccessName]);
        }
        for (var username in relatedUsers) {
            if (!$S.isArray(relatedUsers[username])) {
                continue;
            }
            allUsername.push(username);
            allUsername = allUsername.concat(relatedUsers[username]);
        }
        var finalAllUsername = [];
        for (var i=0; i<allUsername.length; i++) {
            if (finalAllUsername.indexOf(allUsername[i]) < 0) {
                finalAllUsername.push(allUsername[i]);
            }
        }
        finalAllUsername = finalAllUsername.sort();
        DataHandler.setData("compare_control.allUsername", finalAllUsername);
    },
    getRenderData: function() {
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var rolesConfig = DataHandler.getData("rolesConfig", {});
        var allUsername = DataHandler.getData("compare_control.allUsername", []);
        var requiredUsername = allUsername;
        var currentList1Data = DataHandler.getCurrentList1Data();
        var temp2;
        var i, j;
        if ($S.isObject(currentList1Data) && $S.isArray(currentList1Data.value) && currentList1Data.value.length > 0) {
            requiredUsername = currentList1Data.value;
        }
        var firstRow = $S.clone(requiredUsername), relatedUsers = {};
        if ($S.isObject(rolesConfig) && $S.isObject(rolesConfig.relatedUsers)) {
            relatedUsers = rolesConfig.relatedUsers;
        }
        var comapresUsersName = requiredUsername;
        if (!$S.isArray(comapresUsersName)) {
            comapresUsersName = [];
        }
        var comapresUsers = [];
        for (i = 0; i < comapresUsersName.length; i++) {
            if (!$S.isStringV2(comapresUsersName[i])) {
                continue;
            }
            comapresUsers.push({
                "username": comapresUsersName[i],
                "response": relatedUsers[comapresUsersName[i]],
                "renderData": []
            });
        }
        var tableData = [];
        var sequence = [];
        var temp = {}, tempData, username, itemUsername;
        for (i = 0; i < comapresUsers.length; i++) {
            username = comapresUsers[i].username;
            sequence.push(username);
            if ($S.isArray(comapresUsers[i].response)) {
                tempData = comapresUsers[i].response;
                if ($S.isArray(tempData)) {
                    for(j=0; j<tempData.length; j++) {
                        itemUsername = tempData[j];
                        if ($S.isArray(temp[itemUsername])) {
                            temp[itemUsername].push(username);
                        } else {
                            temp[itemUsername] = [username];
                        }
                        comapresUsers[i].renderData.push(tempData[j]);
                    }
                }
            }
        }
        tableData.push(sequence);
        var t;
        for(username in temp) {
            t = [];
            for (i = 0; i < sequence.length; i++) {
                if (temp[username].indexOf(sequence[i]) >= 0) {
                    t.push(username);
                } else {
                    t.push("");
                }
            }
            tableData.push(t);
        }
        var compareControlPattern = [], data = [];
        for(i=0; i<firstRow.length; i++) {
            compareControlPattern.push({"name": "item-"+i, "heading": firstRow[i], "isSortable": true, "tableName": "table1"});
        }
        for(i=1; i<tableData.length; i++) {
            temp2 = {};
            for(j=0; j<tableData[i].length; j++) {
                temp2["item-" + j] = tableData[i][j];
            }
            data.push(temp2);
        }
        var finalTable = DBViewDataHandler.GetFinalTable({"table1": {"tableData": data}}, compareControlPattern, resultCriteria, requiredDataTable);
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

export default CompareControl;
