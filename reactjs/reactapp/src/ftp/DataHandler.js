import $S from "../interface/stack.js";
import Config from "./Config";
import FTPHelper from "./FTPHelper";
import GATracking from "./GATracking";

import UserControl from "./UserControl";
import AppHandler from "../common/app/common/AppHandler";

var DataHandler;

(function($S){

var CurrentFormData = $S.getDataObj();
var keys = [];


keys.push("pageName");
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
    }
});
DataHandler.extend({
    getPdfDownloadLink: function(filename) {
        return Config.baseapi + "/download/file/" + filename + "?u=" + Config.getUserData("username", "");
    },
    getPdfViewLink: function(filename) {
        return Config.baseapi + "/view/file/" + filename + "?u=" + Config.getUserData("username", "");
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
    loadPageData: function(callBack) {
        var isLogin = AppHandler.GetUserData("login", false);
        var pageName = DataHandler.getData("pageName", "");
        if ($S.isBooleanTrue(Config.forceLogin) && isLogin) {
            if (pageName === Config.users_control) {
                UserControl.loadPageData(function(response) {
                    DataHandler.setData("users_control.response", response);
                    $S.callMethod(callBack);
                });
            } else {
                $S.callMethod(callBack);
            }
        } else {
            $S.callMethod(callBack);
        }
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        AppHandler.LoadStaticData(Config.getApiUrl("getStaticDataApi", false, true), function() {
            AppHandler.LoadLoginUserDetails(Config.getApiUrl("getLoginUserDetails", false, true), function() {
                DataHandler.loadPageData(function() {
                    DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                });
            });
        });
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, pageName) {
        this.setData("pageName", pageName);
    }
});
DataHandler.extend({
    handleInputChange: function(e) {
        var currentTarget = e.currentTarget;
        var fieldName = currentTarget.name;
        if (fieldName === "upload_file.file") {
            var file = currentTarget.files[0];
            CurrentFormData.setData(fieldName, file, true);
        } else {
            CurrentFormData.setData(fieldName, currentTarget.value.trim());
        }
    },
    handleButtonClick: function(e, Data, callBack) {
        var currentTarget = e.currentTarget;
        if (currentTarget.name === "dashboard.fileinfo.view") {
            GATracking.trackResponseAfterLogin("view_file", {"status": "IFRAME"});
            CurrentFormData.setData("dashboard.currentPdfLink", currentTarget.value);
            window.scrollTo(0, 0);
            callBack(true);
        } else if (currentTarget.name === "dashboard.fileinfo.delete") {
            var deleting = window.confirm("Are you sure? You want to delete file: " + currentTarget.value);
            if (deleting) {
               DataHandler.deleteFile(Data, callBack, currentTarget.value); 
            }
        }
    },
    handleDropDownChange: function(e, Data, callBack) {
        DataHandler.setData("dashboard.orderBy", e.currentTarget.value);
        callBack(true);
    }
});
DataHandler.extend({
    deleteFile: function(Data, callBack, filename) {
        var url = Config.apiMapping["delete_file"];
        var postData = {};
        postData["filename"] = filename;
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            console.log(response);
            if (status === "FAILURE") {
                GATracking.trackResponseAfterLogin("delete_file", {"status": "FAILURE_RESPONSE"});
                alert("Error in delete file, Please Try again.");
            } else {
                GATracking.trackResponseAfterLogin("delete_file", response);
                DataHandler.handleApiResponse(Data, callBack, "delete_file", ajax, response);
            }
        });
    },
    handleFormSubmit: function(e, Data, callBack) {
        var pageName = Config.getDataHandler("page", "");
        var url = Config.apiMapping[pageName];
        if ($S.isString(url)) {
            if (pageName === "upload_file") {
                var formData = new FormData();
                var uploadFileApiVersion = Config.getDataHandler("upload_file_api_version", "v1");
                if (uploadFileApiVersion === "v2") {
                    var subject = DataHandler.getData("upload_file.subject", "");
                    var heading = DataHandler.getData("upload_file.heading", "");
                    if ($S.isString(subject) && $S.isString(heading)) {
                        if (subject.length < 1) {
                            alert("Subject required");
                            return;
                        }
                        if (heading.length < 1) {
                            alert("Heading required");
                            return
                        }
                    } else {
                        alert("Subject and Heading required");
                        return;
                    }
                    formData.append("subject", subject);
                    formData.append("heading", heading);
                }
                DataHandler.setData("formSubmitStatus", "in_progress");
                DataHandler.setData("upload_file.percentComplete", 0);
                $S.callMethod(callBack);
                formData.append("file", CurrentFormData.getData("upload_file.file", {}, true));
                $S.uploadFile(Config.JQ, url, formData, function(ajax, status, response) {
                    DataHandler.setData("formSubmitStatus", "completed");
                    $S.callMethod(callBack);
                    console.log(response);
                    if (status === "FAILURE") {
                        GATracking.trackResponseAfterLogin("upload_file", {"status": "FAILURE_RESPONSE"});
                        alert("Error in uploading file, Please Try again.");
                    } else {
                        GATracking.trackResponseAfterLogin("upload_file", response);
                        DataHandler.handleApiResponse(Data, callBack, pageName, ajax, response);
                    }
                }, function(percentComplete) {
                    DataHandler.setData("upload_file.percentComplete", percentComplete);
                    $S.callMethod(callBack);
                });
            }
        }
    }
});
DataHandler.extend({
    handleApiResponse: function(Data, callBack, apiName, ajax, response) {
        if (apiName === "upload_file") {
            if (response.status === "FAILURE") {
                alert(Config.getAleartMessage(response));
                if (response.failureCode === "UNAUTHORIZED_USER") {
                    FTPHelper.pageReload();
                }
            } else {
                alert("File saved as: " + response.data.fileName);
                Config.location.href = "/dashboard";
            }
        } else if (apiName === "delete_file") {
            if (response.status === "FAILURE") {
                alert(Config.getAleartMessage(response));
                if (response.failureCode === "UNAUTHORIZED_USER") {
                    FTPHelper.pageReload();
                }
            } else {
                alert("File deleted");
                Config.location.href = "/dashboard";
            }
        }
    }
});
DataHandler.extend({
    _getAppHeading: function() {
        var appHeading = AppHandler.GetStaticData("headingJson", false);
        if ($S.isString(appHeading)) {
            try {
                appHeading = JSON.parse(appHeading);
            } catch(e) {}
        } else {
            appHeading = null;
        }
        return appHeading;
    },
    _getRenderFieldRow: function() {
        var pageName = DataHandler.getData("pageName", "");
        var renderFieldRow = [];
        if (pageName === Config.users_control) {
            renderFieldRow = UserControl.getRenderFieldRow();
        }
        return renderFieldRow;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        // var dataLoadStatus = this.isDataLoadComplete();
        var appHeading = this._getAppHeading();
        // if (dataLoadStatus) {
        //     renderData = this.getRenderData();
        // }
        var renderFieldRow = this._getRenderFieldRow();

        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);

        appStateCallback();
    }
});
})($S);

export default DataHandler;
