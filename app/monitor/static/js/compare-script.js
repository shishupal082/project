(function(window, $S) {
var Compare = function(config) {
    return new Compare.fn.init(config);
};

Compare.fn = Compare.prototype = {
    constructor: Compare,
    init: function(config) {
        return this;
    }
};
$S.extendObject(Compare);
var ConfigParam = {}; 
Compare.extend({
    setConfig: function(config) {
        if ($S.isObject(config)) {
            ConfigParam = $S.clone(config);
        }
    },
    getConfigParam: function(name, defaultValue) {
        if ($S.isStringV2(name)) {
            return $S.clone(ConfigParam[name]);
        }
        return defaultValue;
    },
    _getRenderList: function() {
        var list1Data = this.getConfigParam("list1Data", []);
        var renderList = [{"value": "", "text": "Select compare id ..."}];
        if (!$S.isArray(list1Data)) {
            list1Data = [];
        }
        var i;
        for(i=0; i<list1Data.length; i++) {
            if ($S.isObject(list1Data[i]) && $S.isStringV2(list1Data[i].value) && $S.isStringV2(list1Data[i].text)) {
                renderList.push({
                    "value": list1Data[i].value,
                    "text": list1Data[i].text
                });
            }
        }
        return renderList;
    },
    _onChange: function(value) {
        var renderList = this._getRenderList();
        var selectedItem = {};
        if ($S.isNumeric(value)) {
            value = value*1;
            if (renderList.length > value) {
                selectedItem = renderList[value];
            }
        }
        var comapresUsersName = [];
        if ($S.isObject(selectedItem) && $S.isStringV2(selectedItem.value)) {
            comapresUsersName = selectedItem.value.split(",");
        }
        this.start(comapresUsersName);
    },
    renderDropdown: function() {
        var renderList = this._getRenderList();
        var html = '', self = this;
        for (var i=0; i<renderList.length; i++) {
            html += '<option value="'+(i).toString()+'">' + renderList[i].text + '</option>';
        }
        $("#select-list-1").html(html).on("change", function(e) {
            var value = e.currentTarget.value;
            self._onChange(value);
        });
    },
    start: function(comapresUsersName) {
        if (!$S.isArray(comapresUsersName)) {
            comapresUsersName = [];
        }
        var comapresUsers = [];
        var i, j;
        for (i = 0; i < comapresUsersName.length; i++) {
            if (!$S.isStringV2(comapresUsersName[i])) {
                continue;
            }
            comapresUsers.push({
                "username": comapresUsersName[i],
                "response": {},
                "renderData": [],
                "isLoaded": false
            });
        }
        var tableData = [];
        function createData() {
            var sequence = [];
            var temp = {}, tempData, username, itemUsername;
            for (i = 0; i < comapresUsers.length; i++) {
                if ($S.isObject(comapresUsers[i].response)) {
                    username = comapresUsers[i].username;
                    sequence.push(username);
                    tempData = comapresUsers[i].response.data;
                    if ($S.isArray(tempData)) {
                        for(j=0; j<tempData.length; j++) {
                            itemUsername = tempData[j].username;
                            if ($S.isArray(temp[itemUsername])) {
                                temp[itemUsername].push(username);
                            } else {
                                temp[itemUsername] = [username];
                            }
                            comapresUsers[i].renderData.push(tempData[j].username);
                        }
                    }
                }
            }
            tableData.push(sequence);
            var t;
            for(var username in temp) {
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
        }
        function renderData() {
            for (i = 0; i < comapresUsers.length; i++) {
                if (comapresUsers[i].isLoaded === false) {
                    return;
                }
            }
            createData();
            var tableHtml = "";
            var table = $S.getTable(tableData, "dashboard");
            table.addRowIndex(0);
            table.updateTableContent(0,0,"");
            tableHtml += table.getHtml();
            $("#tableHtml").html(tableHtml);
            $("#tableHtml table").addClass("table table-bordered table-striped");
        }
        var baseapi = this.getConfigParam("baseApi", "");
        for (i = 0; i < comapresUsers.length; i++) {
            var dataUrl = baseapi+"/api/get_related_users_data_by_username?username="+comapresUsers[i].username;
            $S.loadJsonData($, [dataUrl], function(response, apiName, ajax) {
                for (j = 0; j < comapresUsers.length; j++) {
                    if (apiName === comapresUsers[j].username) {
                        comapresUsers[j].response = response;
                        comapresUsers[j].isLoaded = true;
                    }
                }
                renderData();
            }, null, comapresUsers[i].username);
        }
    }
});
window.$Compare = Compare;
})(window, $S);
