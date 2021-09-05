import $S from "../../interface/stack.js";
import Config from "./Config";
import Template from "./Template";
import TemplateHandler from "./TemplateHandler";
import FormHandler from "./FormHandler";
import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import Api from "../../common/Api";


import CommonConfig from "../../common/app/common/CommonConfig";
import UserControl from "../pages/UserControl";
import PermissionControl from "../pages/PermissionControl";
import CompareControl from "../pages/CompareControl";
import DatabaseFiles from "../pages/DatabaseFiles";
// import GATracking from "./GATracking";

var DataHandler;

(function($S){

var CurrentFormData = $S.getDataObj();
var keys = ["platform"];

keys.push("pageName");
keys.push("login.username");
keys.push("login.password");
keys.push("guest-login-status");

keys.push("change_password.old_password");
keys.push("change_password.new_password");
keys.push("change_password.confirm_password");

keys.push("forgot_password.username");
keys.push("forgot_password.mobile");
keys.push("forgot_password.email");

keys.push("create_password.username");
keys.push("create_password.create_password_otp");
keys.push("create_password.new_password");
keys.push("create_password.confirm_password");

keys.push("database_files.response");

keys.push("register.username");
keys.push("register.passcode");
keys.push("register.password");
keys.push("register.displayName");
keys.push("register.mobile");
keys.push("register.email");

keys.push("login_other_user.username");
keys.push("relatedUsersData");

keys.push("users_control.response");
keys.push("permission_control.response");
keys.push("permission_control.validPermissionList"); // Use for marshaling permission data
keys.push("compare_control.allUsername");

keys.push("rolesConfig");
keys.push("appControlDataApi");
keys.push("appControlData");

keys.push("list1Data");
keys.push("currentList1Id");
keys.push("filterOptions");
keys.push("filterValues");
keys.push("sortingFields");

keys.push("formSubmitStatus"); // in_progress, completed

CurrentFormData.setKeys(keys);
CurrentFormData.setData("formSubmitStatus", "not_started");

DataHandler = function(arg) {
    return new DataHandler.fn.init(arg);
};

DataHandler.fn = DataHandler.prototype = {
    constructor: DataHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(DataHandler);

DataHandler.extend({
    setData: function(key, value) {
        return CurrentFormData.setData(key, value);
    },
    getData: function(key, defaultValue) {
        return CurrentFormData.getData(key, defaultValue);
    },
    trackUIEvent: function(event, status, reason, comment) {
        var postData = {"event": event, "status": status, "reason": reason};
        postData["comment"] = comment;
        var url = Config.getApiUrl("track_event", null, true)+"?u=" + AppHandler.GetUserData("username", "");
        $S.sendPostRequest(Config.JQ, url, postData);
    },
    isAndroid: function(username) {
        if (AppHandler.GetStaticData("android_check_enable") !== "true") {
            return false;
        }
        var event = "android_check";
        var platform = $S.getNavigatorData(Config.navigator, "platform");
        var appVersion = $S.getNavigatorData(Config.navigator, "appVersion");
        var isLinuxArmv = platform.search(/linux armv/i) >= 0;
        var isLinuxAarch = platform.search(/linux aarch/i) >= 0;
        var isLinuxAndroid = appVersion.search(/linux; android/i) >= 0;
        if ((isLinuxArmv || isLinuxAarch) && isLinuxAndroid) {
            // DataHandler.setData("platform", "Android");
            platform = "Android";
            AppHandler.Track(username, event, platform);
            return true;
        }
        var status = "FAILURE";
        var reason = "";
        var comment = "";
        if (isLinuxArmv || isLinuxAarch) {
            comment = $S.getUserAgentTrackingData(Config.navigator);
            reason = "LINUX_ARMV_OR_AARCH_NOT_ANDROID";
        } else if (isLinuxAndroid) {
            comment = $S.getUserAgentTrackingData(Config.navigator);
            reason = "ANDROID_NOT_LINUX_ARMV";
        } else {
            AppHandler.Track(username, event, "Not Android");
            return false;
        }
        AppHandler.Track(username, event, "Not Android:"+reason);
        DataHandler.trackUIEvent(event, status, reason, comment);
        return false;
    }
});
DataHandler.extend({
    checkForRedirect: function() {
        var pageName = DataHandler.getData("pageName", "");
        var isLogin = AppHandler.GetUserData("login", false);
        var redirectStatus = false;
        if ([Config.change_password, Config.logout, Config.login_other_user, Config.users_control, Config.permission_control, Config.compare_control].indexOf(pageName) >= 0) {
            if (!isLogin) {
                AppHandler.LazyRedirect("/login", 250);
                redirectStatus = true;
            }
        } else if ([Config.forgot_password, Config.login, Config.register, Config.create_password].indexOf(pageName) >= 0) {
            if (isLogin) {
                AppHandler.LazyRedirect(Config.loginRedirectUrl, 250);
                redirectStatus = true;
            }
        }
        return redirectStatus;
    },
    generateFilterOptions: function(pageName, finalTableData, filterKeyMapping) {
        var currentAppData = {};
        var metaData = CommonDataHandler.getData("metaData", {});
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        var filterOptions = AppHandler.generateFilterDataV2(filterKeyMapping, currentAppData, metaData, finalTableData, filterSelectedValues, "name");
        DataHandler.setData("filterOptions", filterOptions);
    },
    setList1Data: function(list1Data) {
        if (!$S.isArray(list1Data)) {
            list1Data = [];
        }
        list1Data.map(function(el, i, arr) {
            if ($S.isObject(el)) {
                el.id = i.toString();
            }
            return el;
        });
        if (list1Data.length > 0) {
            DataHandler.setData("currentList1Id", list1Data[0]["id"]);
        }
        DataHandler.setData("list1Data", list1Data);
    },
    handlePageLoad: function() {
        AppHandler.setGtag(Config.gtag);
        var userData = Config.UserData;
        var pageData = Config.PageData;
        if ($S.isObject(userData)) {
            if (userData["login"] === "true") {
                userData["login"] = true;
            } else {
                userData["login"] = false;
            }
            if ($S.isObject(userData["roles"])) {
                for (var key in userData["roles"]) {
                    userData["roles"][key] = userData["roles"][key] === "true";
                }
            }
            AppHandler.SetUserDetails(userData);
        }
        if ($S.isObject(pageData)) {
            AppHandler.SetStaticData(pageData);
        }
        TemplateHandler.setFooterTemplate();
    },
    handleAppControlDataLoad: function(pageName) {
        var appControlData = DataHandler.getData("appControlData", {});
        var list1Data = [];
        if ($S.isObject(appControlData)) {
            if (pageName === Config.permission_control) {
                list1Data = appControlData.permissionControlList;
            } else if (pageName === Config.compare_control) {
                list1Data = appControlData.compareControlList;
            }
        }
        this.setList1Data(list1Data);
    },
    handleStaticDataLoad: function(pageName) {
        var jsonFileData = AppHandler.GetStaticData("jsonFileData", {});
        var appControlDataApi = null;
        if ($S.isObject(jsonFileData)) {
            if (pageName === Config.permission_control) {
                appControlDataApi = jsonFileData.permissionControlApi;
            } else if (pageName === Config.compare_control) {
                appControlDataApi = jsonFileData.compareControlApi;
            }
        }
        Config.setApiUrl("appControlDataApi", appControlDataApi);
    },
    getCurrentList1Data: function() {
        var currentList1Id = DataHandler.getData("currentList1Id", "");
        var list1Data = DataHandler.getData("list1Data", "");
        var currentList1Data = null;
        if ($S.isArray(list1Data)) {
            for(var i=0; i<list1Data.length; i++) {
                if (!$S.isObject(list1Data[i])) {
                    continue;
                }
                if (list1Data[i].id === currentList1Id) {
                    currentList1Data = list1Data[i];
                    break;
                }
            }
        }
        return currentList1Data;
    },
    getAppData: function(key, defaultValue) {
        if (!$S.isStringV2(key)) {
            return defaultValue;
        }
        var metaData = CommonDataHandler.getData("metaData", {});
        return $S.findParam([metaData], key, defaultValue);
    }
});
DataHandler.extend({
    loadPageData: function(pageName, callback) {
        CommonDataHandler.loadMetaDataByAppId(Config.defaultMetaData);
        var staticDataUrl = CommonConfig.getApiUrl("getStaticDataApi", null, true);
        var filterKeyMapping, data;
        if ([Config.logout, Config.login_other_user].indexOf(pageName) >= 0) {
            var url = CommonConfig.getApiUrl("getRelatedUsersDataV2Api", null, true);
            var isLoginOtherUserEnable = AppHandler.GetUserData("isLoginOtherUserEnable", false);
            if ($S.isBooleanTrue(isLoginOtherUserEnable)) {
                $S.loadJsonData(null, [url], function(response, apiName, ajax) {
                    if ($S.isObject(response)) {
                        DataHandler.setData("relatedUsersData", response.data);
                    }
                    $S.callMethod(callback);
                }, null, "relatedUsersDataV2", Api.getAjaxApiCallMethod());
            } else {
                $S.callMethod(callback);
            }
        } else if (pageName === Config.users_control) {
            UserControl.loadRelatedUsersData(function() {
                $S.callMethod(callback);
            });
        } else if (pageName === Config.database_files) {
            DatabaseFiles.loadData(function() {
                DataHandler.setList1Data(DatabaseFiles.getList1Data(pageName));
                filterKeyMapping = DatabaseFiles.getFilterKeyMapping(pageName);
                data = DataHandler.getData("database_files.response", []);
                DataHandler.generateFilterOptions(pageName, data, filterKeyMapping);
                $S.callMethod(callback);
            });
        } else if ([Config.permission_control, Config.compare_control].indexOf(pageName) >= 0) {
            AppHandler.LoadStaticData(staticDataUrl, function() {
                DataHandler.handleStaticDataLoad(pageName);
                PermissionControl.loadRolesConfig(function() {
                    DataHandler.handleAppControlDataLoad(pageName);
                    if (pageName === Config.permission_control) {
                        PermissionControl.setFinalTableData();
                    } else if (pageName === Config.compare_control) {
                        CompareControl.setFinalTableData();
                    }
                    $S.callMethod(callback);
                });
            });
        }
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        var pageName = DataHandler.getData("pageName", "");
        AppHandler.TrackPageView(pageName);
        var redirectStatus = this.checkForRedirect();
        if (!redirectStatus) {
            if ([Config.logout, Config.login_other_user, Config.users_control, Config.permission_control, Config.compare_control, Config.database_files].indexOf(pageName) >= 0) {
                DataHandler.loadPageData(pageName, function() {
                    DataHandler.reRenderApp(appStateCallback, appDataCallback);
                });
            } else {
                this.reRenderApp(appStateCallback, appDataCallback);
            }
        }
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, pageName) {
        DataHandler.setData("pageName", pageName);
    },
    OnInputChange: function(appStateCallback, appDataCallback, name, value) {
        DataHandler.setData(name, value);
    },
    OnDropdownChange: function(appStateCallback, appDataCallback, name, value) {
        if (name === "list1-select") {
            DataHandler.setData("currentList1Id", value);
            DataHandler.reRenderApp(appStateCallback, appDataCallback);
        } else {
            DataHandler.setData(name, value);
        }
    },
    OnButtonClick: function(appStateCallback, appDataCallback, name, value) {
        if (name === "login.submit-guest") {
            DataHandler.setData("guest-login-status", true);
        } else if (name === "sortable") {
            var sortingFields = DataHandler.getData("sortingFields", []);
            var finalSortingField = DBViewDataHandler.UpdateSortingFields(sortingFields, value);
            DataHandler.setData("sortingFields", finalSortingField);
            DataHandler.reRenderApp(appStateCallback, appDataCallback);
        }
    },
    OnResetClick: function(appStateCallback, appDataCallback) {
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                filterOptions[i].selectedValue = "";
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", {});
        DataHandler.reRenderApp(appStateCallback, appDataCallback);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
        var filterValues = DataHandler.getData("filterValues", {});
        var filterOptions = DataHandler.getData("filterOptions", []);
        if (!$S.isObject(filterValues)) {
            filterValues = {};
        }
        filterValues[name] = value;
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                if (filterOptions[i].selectName === name) {
                    filterOptions[i].selectedValue = value;
                }
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", filterValues);
        DataHandler.reRenderApp(appStateCallback, appDataCallback);
    },
    OnFormSubmit: function(appStateCallback, appDataCallback, name, value) {
        var callback = function() {
            DataHandler.reRenderApp(appStateCallback, appDataCallback);
        };
        var pageName = DataHandler.getData("pageName", "");
        switch(value) {
            case "login_form":
                FormHandler.handleLoginForm(pageName, callback);
            break;
            case "register_form":
                FormHandler.handleRegisterForm(pageName, callback);
            break;
            case "change_password_form":
                FormHandler.handleChangePasswordForm(pageName, callback);
            break;
            case "forgot_password_form":
                FormHandler.handleForgotPasswordForm(pageName, callback);
            break;
            case "create_password_form":
                FormHandler.handleCreatePasswordForm(pageName, callback);
            break;
            case "login_other_user_form":
                FormHandler.handleLoginOtherUser(pageName, callback, value);
            break;
            default:
            break;
        }
    }
});
DataHandler.extend({
    getRenderData: function(pageName) {
        var renderData = {};
        if ([Config.users_control, Config.permission_control, Config.compare_control, Config.database_files].indexOf(pageName) >= 0) {
            return renderData;
        }
        renderData = {"guest-login-status": false, "is_guest_enable": false,
                "fieldsValue": {},
                "submitBtnName": "", "formSubmitStatus": ""};
        var fieldsName = [];
        var submitBtnName = "";
        switch(pageName) {
            case "login":
                submitBtnName = pageName + ".submit";
                fieldsName = ["login.username", "login.password"];
                renderData["guest-login-status"] = DataHandler.getData("guest-login-status", false);
                renderData["isGuestLoginEnable"] = AppHandler.GetStaticData("is_guest_enable", "false") === "true";
            break;
            case "register":
                submitBtnName = pageName + ".submit";
                fieldsName = ["register.username", "register.passcode", "register.password", "register.displayName", "register.mobile", "register.email"];
            break;
            case "forgot_password":
                submitBtnName = pageName + ".submit";
                fieldsName = ["forgot_password.username", "forgot_password.mobile", "forgot_password.email"];
            break;
            case "change_password":
                submitBtnName = pageName + ".submit";
                fieldsName = ["change_password.old_password", "change_password.new_password", "change_password.confirm_password"];
            break;
            case "create_password":
                submitBtnName = pageName + ".submit";
                fieldsName = ["create_password.username", "create_password.username", "create_password.create_password_otp", "create_password.new_password", "create_password.confirm_password"];
            break;
            case "logout":
            case "login_other_user":
                submitBtnName = "login_other_user.submit";
                fieldsName = ["login_other_user.username"];
            break;
            case "noMatch":
            default:
            break;
        }
        renderData.submitBtnName = submitBtnName;
        renderData.formSubmitStatus = DataHandler.getData("formSubmitStatus", "");
        for (var i=0; i<fieldsName.length; i++) {
            renderData.fieldsValue[fieldsName[i]] = DataHandler.getData(fieldsName[i], "");
        }
        return renderData;
    }
});
DataHandler.extend({
    reRenderApp: function(appStateCallback, appDataCallback) {
        var appHeading =[AppHandler.getTemplate(Template, "heading", "App Heading")];
        var pageName = DataHandler.getData("pageName", "");
        var renderData = this.getRenderData(pageName);
        var renderFieldRow = TemplateHandler.getRenderField(pageName, renderData);
        var isLogin = AppHandler.GetUserData("login", false);
        if ($S.isBooleanTrue(isLogin)) {
            appHeading.push(TemplateHandler.getLinkTemplate());
        }

        appDataCallback("filterOptions", DataHandler.getData("filterOptions", []));
        appDataCallback("list1Data", DataHandler.getData("list1Data", []));
        appDataCallback("currentList1Id", DataHandler.getData("currentList1Id", "0"));
        appDataCallback("appHeading", appHeading);
        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});
})($S);

export default DataHandler;
