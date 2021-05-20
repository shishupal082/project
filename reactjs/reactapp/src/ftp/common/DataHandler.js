import $S from "../../interface/stack.js";

import AppHandler from "../../common/app/common/AppHandler";
import TemplateHelper from "../../common/TemplateHelper";

import Config from "./Config";
import GATracking from "./GATracking";
import Template from "./Template";

import UserControl from "../pages/UserControl";
import UploadFile from "../pages/UploadFile";
import Dashboard from "../pages/Dashboard";

var DataHandler;

(function($S){

var CurrentFormData = $S.getDataObj();
var keys = [];


keys.push("pageName");
keys.push("platform");
keys.push("upload_file.file");
keys.push("upload_file.percentComplete");
keys.push("upload_file.subject");
keys.push("upload_file.heading");

keys.push("dashboard.apiResponse"); // []
keys.push("dashboard.apiResponseByUser");// []
keys.push("dashboard.apiResponseByDate");// []
keys.push("dashboard.currentPdfLink");
keys.push("dashboard.orderBy"); // date or users


keys.push("users_control.response");
keys.push("formSubmitStatus"); // in_progress, completed
CurrentFormData.setKeys(keys);

CurrentFormData.setData("formSubmitStatus", "not_started");
CurrentFormData.setData("users_control.response", []);


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
        var url = Config.getApiUrl("track_event", "", true);
        $S.sendPostRequest(Config.JQ, url, postData);
    },
    getNavigatorData: function(key) {
        var result = key;
        try {
            var uiNavigator = Config.navigator;
            if ($S.isString(uiNavigator[key])) {
                result = uiNavigator[key];
            }
        } catch(err) {
            result = "error in " + key;
        }
        return result;
    },
    getUserAgentTrackingData: function() {
        var trackingData = [];
        var trackingKey = ["platform","appVersion","appCodeName","appName"];
        for(var i=0; i<trackingKey.length; i++) {
            trackingData.push(this.getNavigatorData(trackingKey[i]));
        }
        return trackingData.join(",");
    },
    isAndroid: function() {
        var platform = this.getNavigatorData("platform");
        var appVersion = this.getNavigatorData("appVersion");
        var isLinuxArmv = platform.search(/linux armv/i) >= 0;
        var isLinuxAndroid = appVersion.search(/linux; android/i) >= 0;
        if (isLinuxArmv && isLinuxAndroid) {
            return true;
        }
        var event = "android_check";
        var status = "FAILURE";
        var reason = "";
        var comment = "";
        if (isLinuxArmv) {
            comment = this.getUserAgentTrackingData();
            reason = "LINUX_ARMV_NOT_ANDROID";
        } else if (isLinuxAndroid) {
            comment = this.getUserAgentTrackingData();
            reason = "ANDROID_NOT_LINUX_ARMV";
        } else {
            return false;
        }
        this.trackUIEvent(event, status, reason, comment);
        return false;
    }
});
DataHandler.extend({
    getPdfDownloadLink: function(filename) {
        return Config.baseApi + "/download/file/" + filename + "?u=" + AppHandler.GetUserData("username", "");
    },
    getPdfViewLink: function(filename) {
        return Config.baseApi + "/view/file/" + filename + "?u=" + AppHandler.GetUserData("username", "");
    },
    getCurrentPdfLink: function(Data) {
        var pdfLink = CurrentFormData.getData("dashboard.currentPdfLink", null);
        if (pdfLink !== null) {
            pdfLink = DataHandler.getPdfViewLink(pdfLink)+"&container=iframe";
        }
        return pdfLink;
    }
});
DataHandler.extend({
    _handleStaticDataLoad: function() {
        var appHeading = AppHandler.GetStaticData("headingJson", []);
        var pageNotFound = AppHandler.GetStaticData("pageNotFoundJson", []);
        var afterLoginLinkJson = AppHandler.GetStaticData("afterLoginLinkJson", []);
        var footerLinkJsonAfterLogin = AppHandler.GetStaticData("footerLinkJsonAfterLogin", []);
        var jsonFileData = AppHandler.GetStaticData("jsonFileData", {});
        var isAdminTextDisplayEnable = AppHandler.GetUserData("isAdminTextDisplayEnable", false);
        if (!isAdminTextDisplayEnable) {
            this.setData("dashboard.orderBy", "orderByUsername");
        } else {
            this.setData("dashboard.orderBy", "orderByDate");
        }
        var uploadFileInstruction;
        try {
            appHeading = JSON.parse(appHeading);
        } catch(e) {}
        try {
            pageNotFound = JSON.parse(pageNotFound);
        } catch(e) {}
        try {
            afterLoginLinkJson = JSON.parse(afterLoginLinkJson);
        } catch(e) {}
        try {
            footerLinkJsonAfterLogin = JSON.parse(footerLinkJsonAfterLogin);
        } catch(e) {}
        if ($S.isArray(appHeading) && appHeading.length > 0) {
            Template["heading"] = appHeading;
        }
        if ($S.isArray(pageNotFound) && pageNotFound.length > 0) {
            Template["pageNotFound"] = pageNotFound;
        }
        if ($S.isArray(afterLoginLinkJson) && afterLoginLinkJson.length > 0) {
            Template["link"] = afterLoginLinkJson;
        }
        if ($S.isArray(footerLinkJsonAfterLogin) && footerLinkJsonAfterLogin.length > 0) {
            Template["footerLinkJsonAfterLogin"] = footerLinkJsonAfterLogin;
        }

        if ($S.isObject(jsonFileData) && $S.isObject(jsonFileData.config)) {
            if ($S.isString(jsonFileData.config.uploadFileInstruction)) {
                uploadFileInstruction = jsonFileData.config.uploadFileInstruction;
                TemplateHelper.setTemplateAttr(Template["upload_file"], "upload_file.message", "text", uploadFileInstruction);
            }
        }

        var field = TemplateHelper(Template["link"]).searchField("link.loginAs");
        field.text = AppHandler.GetUserData("username", "");

        var isAdmin = AppHandler.GetUserData("isAdminTextDisplayEnable", false);
        if ($S.isBooleanTrue(isAdmin)) {
            TemplateHelper.removeClassTemplate(Template["link"], "link.is-admin", "d-none");
        } else {
            TemplateHelper.addClassTemplate(Template["link"], "link.is-admin", "d-none");
        }
        var userDetails = AppHandler.GetUserDetails();
        if ($S.isObject(userDetails) && $S.isObject(userDetails.roles)) {
            for(var key in userDetails.roles) {
                TemplateHelper.removeClassTemplate(Template["footerLinkJsonAfterLogin"], key, "d-none");
            }
        }
    },
    loadPageData: function(callBack) {
        var isLogin = AppHandler.GetUserData("login", false);
        var pageName = DataHandler.getData("pageName", "");
        if ($S.isBooleanTrue(Config.forceLogin)) {
            if (isLogin) {
                if (pageName === Config.users_control) {
                    UserControl.loadPageData(function(response) {
                        DataHandler.setData("users_control.response", response);
                        $S.callMethod(callBack);
                    });
                } else if (pageName === Config.dashboard) {
                    Dashboard.loadPageData(function(response) {
                        $S.callMethod(callBack);
                    });
                } else {
                    $S.callMethod(callBack);
                }
            } else {
                AppHandler.LazyRedirect(Config.getApiUrl("loginRedirectUrl", "", false));
            }
        } else {
            $S.callMethod(callBack);
        }
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        var isAndroid = this.isAndroid();
        if (isAndroid) {
            this.setData("platform", "Android");
        }
        AppHandler.LoadStaticData(Config.getApiUrl("getStaticDataApi", false, true), function() {
            AppHandler.LoadLoginUserDetails(Config.getApiUrl("getLoginUserDetails", false, true), function() {
                DataHandler._handleStaticDataLoad();
                DataHandler.loadPageData(function() {
                    DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                });
            });
        });
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, pageName) {
        var disabledPages = Config.disabledPages;
        if ($S.isArray(disabledPages) && disabledPages.indexOf(pageName) >= 0) {
            pageName = Config.noMatch;
        }
        this.setData("pageName", pageName);
    },
    OnFileUploadChange: function(appStateCallback, appDataCallback, name, value) {
        CurrentFormData.setData(name, value, true);
    },
    OnInputChange: function(appStateCallback, appDataCallback, name, value) {
        DataHandler.setData(name, value.trim());
    },
    OnFormSubmit: function(appStateCallback, appDataCallback) {
        var pageName = DataHandler.getData("pageName", "");
        if (pageName === Config.upload_file) {
            var file = CurrentFormData.getData("upload_file.file", {}, true);
            UploadFile.upload(file, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        }
    },
    OnDropdownChange: function(appStateCallback, appDataCallback, name, value) {
        var pageName = DataHandler.getData("pageName", "");
        if (pageName === Config.dashboard) {
            DataHandler.setData("dashboard.orderBy", value);
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        }
    },
    OnButtonClick: function(appStateCallback, appDataCallback, name, value) {
        if (name === "dashboard.fileinfo.view") {
            GATracking.trackResponseAfterLogin("view_file", {"status": "IFRAME"});
            DataHandler.setData("dashboard.currentPdfLink", value);
            window.scrollTo(0, 0);
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        } else if (name === "dashboard.fileinfo.delete") {
            var deleting = window.confirm("Are you sure? You want to delete file: " + value);
            if (deleting) {
                Dashboard.deleteFile(value, function() {
                    DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                }); 
            }
        }
    }
});
DataHandler.extend({
    getAleartMessage: function(response) {
        var messageMap = {};
        if (!$S.isObject(response)) {
            return response;
        }
        var messageCode = response.failureCode;
        var error = response.error;
        if ($S.isString(messageMap[messageCode])) {
            return messageMap[messageCode];
        }
        return error;
    }
});
DataHandler.extend({
    _getRenderFieldRow: function() {
        var pageName = DataHandler.getData("pageName", "");
        var file = CurrentFormData.getData("upload_file.file", {}, true);
        var renderFieldRow = [];
        if (pageName === Config.users_control) {
            renderFieldRow = UserControl.getRenderFieldRow();
        } else if (pageName === Config.upload_file) {
            renderFieldRow = UploadFile.getRenderFieldRow(file);
        } else if (pageName === Config.dashboard) {
            renderFieldRow = Dashboard.getRenderFieldRow();
        } else {
            renderFieldRow = AppHandler.getTemplate(Template, "pageNotFound", {});
        }
        return renderFieldRow;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var renderFieldRow = this._getRenderFieldRow();
        var appHeading = AppHandler.getTemplate(Template, "heading", []);

        var finalResponse = [];
        finalResponse.push(AppHandler.getTemplate(Template, "link", []));
        finalResponse.push(renderFieldRow);
        finalResponse.push(AppHandler.getTemplate(Template, "footerLinkJsonAfterLogin", []));

        appDataCallback("appHeading", appHeading);
        appDataCallback("renderFieldRow", finalResponse);
        appStateCallback();
    }
});
})($S);

export default DataHandler;
