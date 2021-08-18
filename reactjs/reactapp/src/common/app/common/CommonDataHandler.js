import $S from "../../../interface/stack.js";

import Api from "../../Api";
import AppHandler from "../../app/common/AppHandler";

import CommonConfig from "./CommonConfig";


var CommonDataHandler;

(function($S){

var CurrentData = $S.getDataObj();
var keys = [];

keys.push("fieldsData");
keys.push("pathParams");

keys.push("appControlMetaData");
keys.push("appControlData");
keys.push("metaData");

keys.push("metaDataLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("firstTimeDataLoadStatus");


keys.push("loginUserDetailsLoadStatus");

keys.push("date-select");

CurrentData.setKeys(keys);

CurrentData.setData("firstTimeDataLoadStatus", "not-started");

CommonDataHandler = function(arg) {
    return new CommonDataHandler.fn.init(arg);
};
CommonDataHandler.fn = CommonDataHandler.prototype = {
    constructor: CommonDataHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(CommonDataHandler);

CommonDataHandler.extend({
    addAdditionalDataKeys: function(keysArray) {
        var isUpdated = false;
        if ($S.isArray(keysArray)) {
            for(var i=0; i<keysArray.length; i++) {
                if ($S.isStringV2(keysArray[i]) && keys.indexOf(keysArray[i]) < 0) {
                    isUpdated = true;
                    keys.push(keysArray[i]);
                }
            }
        }
        if (isUpdated) {
            CurrentData.setKeys(keys);
        }
        return isUpdated;
    },
    setData: function(key, value, isDirect) {
        return CurrentData.setData(key, value, isDirect);
    },
    getData: function(key, defaultValue, isDirect) {
        return CurrentData.getData(key, defaultValue, isDirect);
    },
    setFieldsData: function(key, value) {
        if (!$S.isStringV2(key)) {
            return;
        }
        var fieldsData = this.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        if ($S.isString(value)) {
            value = value.trim();
        }
        fieldsData[key] = value;
        this.setData("fieldsData", fieldsData);
    },
    getFieldsData: function(key, defaultValue) {
        var fieldsData = this.getData("fieldsData", {});
        if ($S.isStringV2(key)) {
            if ($S.isObject(fieldsData)) {
                if ($S.isUndefined(fieldsData[key])) {
                    return defaultValue;
                } else {
                    return fieldsData[key];
                }
            }
        }
        return defaultValue;
    },
    getPathParamsData: function(key, defaultValue) {
        var pathParams = this.getData("pathParams", {});
        if ($S.isString(key) && key.length > 0) {
            if ($S.isObject(pathParams)) {
                if ($S.isUndefined(pathParams[key])) {
                    return defaultValue;
                } else {
                    return pathParams[key];
                }
            }
        }
        return defaultValue;
    },
    getAppDataById: function(currentAppId, defaultCurrentAppData) {
        var appControlData = this.getData("appControlData", []);
        var currentAppData = defaultCurrentAppData;
        if ($S.isArray(appControlData)) {
            for (var i = 0; i < appControlData.length; i++) {
                if (appControlData[i]["id"] === currentAppId) {
                    currentAppData = appControlData[i];
                    break;
                }
            }
        }
        return currentAppData;
    },
    getDataLoadStatusByKey: function(keys) {
        var dataLoadStatus = [], i;
        var loadStatus;
        if ($S.isArray(keys)) {
            for (i = 0; i < keys.length; i++) {
                if ($S.isString(keys[i])) {
                    loadStatus = this.getData(keys[i], "");
                    dataLoadStatus.push(loadStatus);
                }
            }
        } else {
            return "";
        }
        for (i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] !== "completed") {
                return "";
            }
        }
        return "completed";
    }
});

CommonDataHandler.extend({
    getAppData: function(appId, key, defaultValue) {
        if (!$S.isStringV2(key)) {
            return defaultValue;
        }
        var currentAppData = this.getAppDataById(appId, {});
        var metaData = this.getData("metaData", {});
        return $S.findParam([currentAppData, metaData], key, defaultValue);
    }
});

CommonDataHandler.extend({
    _handleMetaDataLoad: function(metaDataResponse) {
        var finalMetaData = {}, i, tempMetaData, temp;
        var appControlMetaData = this.getData("appControlMetaData", {});
        if ($S.isObject(appControlMetaData)) {
            finalMetaData = appControlMetaData;
        }
        if ($S.isArray(metaDataResponse)) {
            for (i=0; i<metaDataResponse.length; i++) {
                if ($S.isObject(metaDataResponse[i])) {
                    tempMetaData = metaDataResponse[i];
                    temp = tempMetaData.metaData;
                    if ($S.isObject(temp)) {
                        temp = Object.keys(temp);
                        if (temp.length > 0) {
                            tempMetaData = tempMetaData.metaData;
                        }
                    }
                    finalMetaData = Object.assign(finalMetaData, tempMetaData);
                }
            }
        }
        this.setData("metaData", finalMetaData);
    },
    setDateSelectParameter: function(appId) {
        var currentAppControlData = this.getAppDataById(appId, {});
        var metaData = this.getData("metaData", {});
        var dateSelect = this.getData("date-select", "");
        if (dateSelect === "") {
            dateSelect = $S.findParam([currentAppControlData, metaData], "dateSelect", "");
            if (dateSelect === "") {
                dateSelect = CommonConfig.defaultDateSelect;
            }
        }
        this.setData("date-select", dateSelect);
    }
});

CommonDataHandler.extend({
    loadLoginUserDetailsData: function(callback) {
        var loginUserDetailsApi = CommonConfig.getApiUrl("getLoginUserDetailsApi", null, true);
        if ($S.isStringV2(loginUserDetailsApi)) {
            CommonDataHandler.setData("loginUserDetailsLoadStatus", "in_progress");
            AppHandler.LoadLoginUserDetails(loginUserDetailsApi, function() {
                CommonDataHandler.setData("loginUserDetailsLoadStatus", "completed");
                $S.callMethod(callback);
            });
        } else {
            CommonDataHandler.setData("loginUserDetailsLoadStatus", "completed");
            $S.callMethod(callback);
        }
    },
    loadAppControlData: function(callback) {
        var appControlApi = CommonConfig.getApiUrl("getAppControlApi", null, true);
        this.setData("appControlDataLoadStatus", "in_progress");
        AppHandler.loadAppControlData(appControlApi, CommonConfig.baseApi, CommonConfig.appControlDataPath, CommonConfig.validAppControl, function(appControlData, metaData) {
            CommonDataHandler.setData("appControlData", appControlData);
            CommonDataHandler.setData("appControlMetaData", metaData);
            $S.log("appControlData load complete");
            CommonDataHandler.setData("appControlDataLoadStatus", "completed");
            $S.callMethod(callback);
        });
    },
    loadMetaDataByAppId: function(appId, callback) {
        var currentAppControlData = this.getAppDataById(appId, {});//{}
        var request = [], metaDataApi = [];
        if ($S.isArray(currentAppControlData["metaDataApi"])) {
            metaDataApi = currentAppControlData["metaDataApi"];
        }
        metaDataApi = metaDataApi.map(function(el, i, arr) {
            return CommonConfig.baseApi + el + "?v=" + CommonConfig.appVersion;
        });
        var metaDataRequest = {
                            "url": metaDataApi,
                            "apiName": "metaData",
                            "requestMethod": Api.getAjaxApiCallMethod()};
        request.push(metaDataRequest);
        this.setData("metaDataLoadStatus", "in_progress");
        AppHandler.LoadDataFromRequestApi(request, function() {
            for(var i=0; i<request.length; i++) {
                if (request[i].apiName === "metaData") {
                    CommonDataHandler._handleMetaDataLoad(request[i].response);
                }
            }
            CommonDataHandler.setData("metaDataLoadStatus", "completed");
            $S.log("metaData load complete");
            $S.callMethod(callback);
        });
    },
    loadJSONDataByApiName: function(apiName, callback) {
        var apiUrl = CommonConfig.getApiUrl(apiName, null, true);
        if ($S.isStringV2(apiUrl)) {
            $S.loadJsonData(CommonConfig.JQ, [apiUrl], function(response, apiName, ajax){
                if ($S.isFunction(callback)) {
                    callback(apiName, response);
                }
            }, null, apiName, Api.getAjaxApiCallMethod());
        } else {
            $S.callMethod(callback);
        }
    }
});
CommonDataHandler.extend({
    OnReloadClick: function(appStateCallback, appDataCallback) {
        AppHandler.TrackEvent("reloadClick");
    },
    OnResetClick: function(appStateCallback, appDataCallback, name, value) {
        AppHandler.TrackEvent("resetClick");
    },
    OnClick: function(appStateCallback, appDataCallback, name, value) {
        if ($S.isStringV2(name)) {
            return;
        }
        this.setFieldsData(name, value);
    },
    OnDateSelectClick: function(appStateCallback, appDataCallback, name, value) {
        CommonDataHandler.setData("date-select", value);
    },
    OnDropdownChange: function(appStateCallback, appDataCallback, name, value) {
        if ($S.isStringV2(name)) {
            return;
        }
        this.setFieldsData(name, value);
    },
    OnInputChange: function(appStateCallback, appDataCallback, name, value) {
        if ($S.isStringV2(name)) {
            return;
        }
        this.setFieldsData(name, value);
    }
});
CommonDataHandler.extend({
    _getDynamicEnabledData: function(allDynamicEnabledData) {
        if (!$S.isObject(allDynamicEnabledData)) {
            return true;
        }
        var dynamicEnablingData = [];
        var isValidRole;
        for(var key in allDynamicEnabledData) {
            isValidRole = AppHandler.GetUserData(key);
            if ($S.isBooleanTrue(isValidRole)) {
                dynamicEnablingData = allDynamicEnabledData[key];
                break;
            }
        }
        return dynamicEnablingData;
    },
    getEnabledPageId: function(allDynamicEnabledData) {
        var dynamicEnablingData = this._getDynamicEnabledData(allDynamicEnabledData);
        var enabledPageId = [];
        if ($S.isObject(dynamicEnablingData)) {
            enabledPageId = dynamicEnablingData["enabledPageId"];
        }
        return enabledPageId;
    },
    getEnabledViewPageName: function(allDynamicEnabledData) {
        var dynamicEnablingData = this._getDynamicEnabledData(allDynamicEnabledData);
        var enabledViewPage = [];
        if ($S.isObject(dynamicEnablingData)) {
            enabledViewPage = dynamicEnablingData["enabledViewPage"];
        }
        return enabledViewPage;
    },
    isEnabled: function(allDynamicEnabledData, type, value) {
        var dynamicEnablingData = this._getDynamicEnabledData(allDynamicEnabledData);
        var enabledPages = [], enabledPageId = [], enabledForms = [], enabledViewPage = [];
        if ($S.isObject(dynamicEnablingData)) {
            if ($S.isArray(dynamicEnablingData["enabledPages"])) {
                enabledPages = dynamicEnablingData["enabledPages"];
            }
            if ($S.isArray(dynamicEnablingData["enabledPageId"])) {
                enabledPageId = dynamicEnablingData["enabledPageId"];
            }
            if ($S.isArray(dynamicEnablingData["enabledForms"])) {
                enabledForms = dynamicEnablingData["enabledForms"];
            }
            if ($S.isArray(dynamicEnablingData["enabledViewPage"])) {
                enabledViewPage = dynamicEnablingData["enabledViewPage"];
            }
        }
        if (type === "pageName") {
            return enabledPages.indexOf(value) >= 0;
        }
        if (type === "pageId") {
            return enabledPageId.indexOf(value) >= 0;
        }
        if (type === "form") {
            return enabledForms.indexOf(value) >= 0;
        }
        if (type === "viewPage") {
            return enabledViewPage.indexOf(value) >= 0;
        }
        return false;
    }
});
})($S);

export default CommonDataHandler;
