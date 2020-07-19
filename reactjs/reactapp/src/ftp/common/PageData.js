import $S from "../../interface/stack.js";
// import Api from "../../common/Api";
import Config from "./Config";

var PageData;

(function($S){
var CurrentFormData = $S.getDataObj();
var keys = ["upload_file.file"];
keys.push("dashboard.apiResponse");
keys.push("dashboard.apiData");
keys.push("dashboard.currentPdfLink");
keys.push("login.username");
keys.push("login.password");
keys.push("change_password.old_password");
keys.push("change_password.new_password");
keys.push("change_password.confirm_password");
CurrentFormData.setKeys(keys);

PageData = function(arg) {
    return new PageData.fn.init(arg);
};

PageData.fn = PageData.prototype = {
    constructor: PageData,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(PageData);

PageData.extend({
    setData: function(key, value) {
        return CurrentFormData.setData(key, value);
    },
    getData: function(key, defaultValue) {
        return CurrentFormData.getData(key, defaultValue);
    }
});
PageData.extend({
    getPdfDownloadLink: function(filename) {
        return Config.baseapi + "/download/file?name=" + filename;
    },
    getPdfViewLink: function(filename) {
        return Config.baseapi + "/view/file?name=" + filename;
    },
    getCurrentPdfLink: function(Data) {
        var pdfLink = CurrentFormData.getData("dashboard.currentPdfLink", null);
        if (pdfLink !== null) {
            return PageData.getPdfViewLink(pdfLink);
        }
        var apiResponse = CurrentFormData.getData("dashboard.apiResponse", null);
        if (apiResponse !== null && apiResponse.length >= 1) {
            pdfLink = PageData.getPdfViewLink(apiResponse[0]);//Config.baseapi + "/view/file?name=" + apiResponse[0];
        }
        return pdfLink;
    }
});
PageData.extend({
    handleInputChange: function(e) {
        var currentTarget = e.currentTarget;
        var fieldName = currentTarget.name;
        if (fieldName === "upload_file.file") {
            var file = currentTarget.files[0];
            CurrentFormData.setData(fieldName, file, true);
        } else {
            CurrentFormData.setData(fieldName, currentTarget.value);
        }
    },
    handleButtonClick: function(e, Data, callBack) {
        var currentTarget = e.currentTarget;
        if (e.currentTarget.name === "dashboard.fileinfo.view") {
            CurrentFormData.setData("dashboard.currentPdfLink", currentTarget.value);
            window.scrollTo(0, 0);
            callBack(true);
        }
    }
});
PageData.extend({
    handleFormSubmit: function(e, Data, callBack) {
        var pageName = Config.getPageData("page", "");
        var url = Config.apiMapping[pageName];
        var postData = {};
        if ($S.isString(url)) {
            if (pageName === "upload_file") {
                var formData = new FormData();
                formData.append("file", CurrentFormData.getData("upload_file.file", {}, true));
                $S.uploadFile(Config.JQ, url, formData, function(ajax, status, response) {
                    console.log(response);
                    if (status === "FAILURE") {
                        alert("Error in uploading file, Please Try again.");
                    } else {
                        PageData.handleApiResponse(Data, callBack, pageName, ajax, response);
                    }
                });
            } else if (pageName === "login") {
                postData["username"] = CurrentFormData.getData("login.username", "");
                postData["password"] = CurrentFormData.getData("login.password", "");
                $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
                    console.log(response);
                    if (status === "FAILURE") {
                        alert("Error in login, Please Try again.");
                    } else {
                        PageData.handleApiResponse(Data, callBack, pageName, ajax, response);
                    }
                });
            } else if (pageName === "change_password") {
                postData["old_password"] = CurrentFormData.getData("change_password.old_password", "");
                postData["new_password"] = CurrentFormData.getData("change_password.new_password", "");
                postData["confirm_password"] = CurrentFormData.getData("change_password.confirm_password", "");
                $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
                    console.log(response);
                    if (status === "FAILURE") {
                        alert("Error in change password, Please Try again.");
                    } else {
                        PageData.handleApiResponse(Data, callBack, pageName, ajax, response);
                    }
                });
            }
        }
    }
});
PageData.extend({
    handleApiResponse: function(Data, callBack, pageName, ajax, response) {
        // var template;
        if (pageName === "upload_file") {
            if (response.status === "FAILURE") {
                alert(Config.getAleartMessage(response.failureCode));
            } else {
                alert("File saved as: " + response.data.fileName);
                Config.location.href = "/dashboard";
            }
        } else if (pageName === "login") {
            if (response.status === "FAILURE") {
                alert(Config.getAleartMessage(response.failureCode));
            } else {
                Config.location.href = "/dashboard";
            }
        } else if (pageName === "change_password") {
            if (response.status === "FAILURE") {
                alert(Config.getAleartMessage(response.failureCode));
            } else {
                Config.location.href = "/dashboard";
            }
        }
    }
});
})($S);

export default PageData;
