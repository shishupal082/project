import $S from "../../interface/stack.js";

import Api from '../../common/Api.js';
import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";

import Config from "../common/Config";
import GATracking from "../common/GATracking";
import Template from "../common/Template";
import DataHandler from "../common/DataHandler";


var Dashboard;

(function($S){
var DT = $S.getDT();
Dashboard = function(arg) {
    return new Dashboard.fn.init(arg);
};

Dashboard.fn = Dashboard.prototype = {
    constructor: Dashboard,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(Dashboard);

Dashboard.extend({
    _generateFileinfoField: function(currentUserName, fileResponse, currentPdfLink) {
        var template = AppHandler.getTemplate(Template, "dashboard.fileinfo", {});
        var field, fullFilename;
        fullFilename = fileResponse.actualFilename;

        // Changing display text parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.filename");
        field.text = fileResponse.filename;
        if (fullFilename === currentPdfLink) {
            TemplateHelper.addClassTemplate(field, "dashboard.fileinfo.filename", "text-danger");
        }
        // Changing view parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.view");
        field.value = fullFilename;
        if (fullFilename === currentPdfLink) {
            TemplateHelper.addClassTemplate(field, "dashboard.fileinfo.view", "disabled");
        }

        // Changing open in new tab link parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.open-in-new-tab");
        field.href = DataHandler.getPdfViewLink(fullFilename);

        // Changing download link parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.download");
        var platform = DataHandler.getData("platform", false);
        if (platform === "Android") {
            field.isTargetBlank = true;
            field.href = DataHandler.getPdfViewLink(fullFilename)+"&container="+platform;
        } else {
            field.href = DataHandler.getPdfDownloadLink(fullFilename);
        }

        // Changing delete link parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.delete");
        field.value = fullFilename;
        if (!$S.isBooleanTrue(fileResponse.deleteOption)) {
            TemplateHelper.addClassTemplate(field, "dashboard.fileinfo.delete", "disabled");
            TemplateHelper.removeClassTemplate(field, "dashboard.fileinfo.delete", "text-danger");
        }
        //Changing file subject_heading parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.subject_heading");
        if ($S.isString(fileResponse.subject) && $S.isString(fileResponse.heading)) {
            if (fileResponse.subject.length > 0 || fileResponse.heading > 0) {
                TemplateHelper.removeClassTemplate(field, "dashboard.fileinfo.subject_heading", "d-none");
                var formValues = {};
                formValues["dashboard.fileinfo.subject"] = fileResponse.subject;
                formValues["dashboard.fileinfo.heading"] = fileResponse.heading;
                TemplateHelper.updateTemplateText(field, formValues);
            } else {
                TemplateHelper.addClassTemplate(field, "dashboard.fileinfo.subject_heading", "d-none");
            }
        } else {
            TemplateHelper.addClassTemplate(field, "dashboard.fileinfo.subject_heading", "d-none");
        }
        return template;
    },
    _generateDashboardResponseByUser: function(dashboardApiResponse) {
        var responseByUser = {};
        if ($S.isArray(dashboardApiResponse)) {
            var i;
            for(i=0; i<dashboardApiResponse.length; i++) {
                if ($S.isString(dashboardApiResponse[i]["username"]) && dashboardApiResponse[i]["username"].length) {
                    if (responseByUser[dashboardApiResponse[i]["username"]]) {
                        responseByUser[dashboardApiResponse[i]["username"]].push(dashboardApiResponse[i]);
                    } else {
                        responseByUser[dashboardApiResponse[i]["username"]] = [dashboardApiResponse[i]];
                    }
                }
            }
        }
        var keys = Object.keys(responseByUser).sort();
        var finalResponse = [], key;
        key = "public";
        if ($S.isArray(responseByUser[key]) && responseByUser[key].length > 0) {
            finalResponse.push({"heading": key, "fieldData": responseByUser[key]})
        }
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            if (key === "public") {
                continue;
            }
            finalResponse.push({"heading": key, "fieldData": responseByUser[key]});
        }
        return finalResponse;
    },
    _generateDashboardResponseByDate: function(dashboardApiResponse) {
        var responseByDate = {};
        var i;
        if ($S.isArray(dashboardApiResponse)) {
            for(i=0; i<dashboardApiResponse.length; i++) {
                if ($S.isString(dashboardApiResponse[i]["dateHeading"]) && dashboardApiResponse[i]["dateHeading"].length) {
                    if (responseByDate[dashboardApiResponse[i]["dateHeading"]]) {
                        responseByDate[dashboardApiResponse[i]["dateHeading"]].push(dashboardApiResponse[i]);
                    } else {
                        responseByDate[dashboardApiResponse[i]["dateHeading"]] = [dashboardApiResponse[i]];
                    }
                }
            }
        }
        var keys = Object.keys(responseByDate).sort();
        var finalResponse = [], key;
        for(i=keys.length-1; i>=0; i--) {
            key = keys[i];
            if (key === "others") {
                continue;
            }
            finalResponse.push({"heading": key, "fieldData": responseByDate[key]});
        }
        key = "others";
        if ($S.isArray(responseByDate[key]) && responseByDate[key].length > 0) {
            finalResponse.push({"heading": key, "fieldData": responseByDate[key]})
        }
        return finalResponse;
    },
    getDashboardFieldOrderByDate: function() {
        var apiData = DataHandler.getData("dashboard.apiResponseByDate", []);
        if (apiData.length < 1) {
            return AppHandler.getTemplate(Template, "noDataFound", {});
        }
        var dashboardTemplate = AppHandler.getTemplate(Template, "dashboard", {});
        var dashboardTemplateData = {"dashboardRow": []};
        var template2, template2Data;
        template2 = AppHandler.getTemplate(Template, "dashboardOrderByOption", {});
        TemplateHelper.setTemplateAttr(template2, "dashboard.orderbydropdown.td", "colSpan", 3);
        dashboardTemplateData.dashboardRow.push(template2);
        var i, j, count;
        var parentTemplateName = "dashboardRowDataByDate";
        var currentPdfLink = DataHandler.getData("dashboard.currentPdfLink", "");
        var currentUserName = AppHandler.GetUserData("username", "");
        for(i=0; i<apiData.length; i++) {
            if ($S.isArray(apiData[i].fieldData) && apiData[i].fieldData.length > 0) {
                template2 = AppHandler.getTemplate(Template, "dashboardRowHeading", {});
                TemplateHelper.setTemplateAttr(template2, "dashboardRowHeading.heading", "colSpan", 3);

                template2Data = {"rowHeading": apiData[i].heading};
                TemplateHelper.updateTemplateText(template2, template2Data);
                dashboardTemplateData.dashboardRow.push(template2);

                template2 = AppHandler.getTemplate(Template, "dashboard1stRowByDate", {});
                dashboardTemplateData.dashboardRow.push(template2);
                count=1;
                for (j=0; j<apiData[i].fieldData.length; j++) {
                    template2 = AppHandler.getTemplate(Template, parentTemplateName, {});
                    template2Data = {};
                    template2Data[parentTemplateName+".s.no"] = count++;
                    template2Data[parentTemplateName+".username"] = apiData[i].fieldData[j]["username"];

                    template2Data[parentTemplateName+".fileinfo"] = Dashboard._generateFileinfoField(currentUserName, apiData[i].fieldData[j], currentPdfLink);
                    TemplateHelper.updateTemplateText(template2, template2Data);
                    dashboardTemplateData.dashboardRow.push(template2);
                }
            }
        }
        TemplateHelper.updateTemplateText(dashboardTemplate, dashboardTemplateData);
        return dashboardTemplate;
    },
    getDashboardField: function() {
        var orderBy = DataHandler.getData("dashboard.orderBy", null);
        if (orderBy === "orderByDate") {
            return Dashboard.getDashboardFieldOrderByDate();
        }
        var apiData = DataHandler.getData("dashboard.apiResponseByUser", []);
        if (apiData.length < 1) {
            return AppHandler.getTemplate(Template, "noDataFound", {});
        }
        var currentUserName = AppHandler.GetUserData("username", "");
        var dashboardTemplate = AppHandler.getTemplate(Template, "dashboard", {});
        var dashboardTemplateData = {"dashboardRow": []};

        var template2, template2Data;
        template2 = AppHandler.getTemplate(Template, "dashboardOrderByOption", {});
        dashboardTemplateData.dashboardRow.push(template2);

        var i, j, count;
        var parentTemplateName = "dashboardRowData";
        var currentPdfLink = DataHandler.getData("dashboard.currentPdfLink", "");
        for(i=0; i<apiData.length; i++) {
            if ($S.isArray(apiData[i].fieldData) && apiData[i].fieldData.length > 0) {
                template2 = AppHandler.getTemplate(Template, "dashboardRowHeading", {});
                template2Data = {"rowHeading": apiData[i].heading};
                TemplateHelper.updateTemplateText(template2, template2Data);
                dashboardTemplateData.dashboardRow.push(template2);

                template2 = AppHandler.getTemplate(Template, "dashboard1stRow", {});
                dashboardTemplateData.dashboardRow.push(template2);
                count=1;
                for (j=0; j<apiData[i].fieldData.length; j++) {
                    template2 = AppHandler.getTemplate(Template, parentTemplateName, {});
                    template2Data = {};
                    template2Data[parentTemplateName+".s.no"] = count++;
                    template2Data[parentTemplateName+".fileinfo"] = Dashboard._generateFileinfoField(currentUserName, apiData[i].fieldData[j], currentPdfLink);
                    TemplateHelper.updateTemplateText(template2, template2Data);
                    dashboardTemplateData.dashboardRow.push(template2);
                }
            }
        }
        TemplateHelper.updateTemplateText(dashboardTemplate, dashboardTemplateData);
        return dashboardTemplate;
    },
    generateFileInfo: function (str) {
        if (!$S.isString(str)) {
            return null;
        }
        function parseDateHeading(filename) {
            var dateHeading = "others";
            var p1 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9]/i;
            var dateObj, temp;
            if ($S.isString(filename) && filename.length >= 10) {
                temp = filename.substring(0, 10);
                dateObj = DT.getDateObj(temp);
                if (dateObj !== null) {
                    if (temp.search(p1) >= 0) {
                        dateHeading = temp;
                    }
                }
            }
            return dateHeading;
        }
        var strArr = str.split("/");
        var r = {}, temp;
        if (strArr.length === 2) {
            r = {"actualFilename": str, "filename": strArr[1], "username": strArr[0], "ext": "", "dateHeading": ""};
            r["dateHeading"] = parseDateHeading(r["filename"]);
            temp = r.filename.split(".");
            if (temp.length > 1) {
                r["ext"] = temp[temp.length-1];
            }
            return r;
        }
        return null;
    },
    _generateDashboardResponse: function(response) {
        var tempResult = [];
        var finalResult = [];
        var dashboardResult = [];
        function reverseFileName(obj) {
            if (!$S.isObject(obj) || !$S.isString(obj.filepath)) {
                return obj;
            }
            var str = obj.filepath;
            var strArr = str.split("/");
            if (strArr.length === 2) {
                obj.filepath = strArr[1] + "/" + strArr[0];
            }
            return obj;
        }
        if ($S.isArray(response)) {
            var i, fileResponse;
            for(i=0; i<response.length; i++) {
                fileResponse = reverseFileName(response[i]);
                if (fileResponse !== null) {
                    tempResult.push(fileResponse);
                }
            }
            tempResult = tempResult.sort(function(a,b) {
                if ($S.isObject(a) && $S.isObject(b)) {
                    if ($S.isString(a.filepath)) {
                        return a.filepath.localeCompare(b.filepath);
                    }
                }
                return -1;
            });
            for(i=0; i<tempResult.length; i++) {
                fileResponse = reverseFileName(tempResult[i]);
                if (fileResponse !== null) {
                    finalResult.push(fileResponse);
                }
            }
            for(i=finalResult.length-1; i>=0; i--) {
                fileResponse = Dashboard.generateFileInfo(finalResult[i].filepath);
                Object.assign(finalResult[i], fileResponse);
                dashboardResult.push(finalResult[i]);
            }
        }
        return dashboardResult;
    },
    displayVisibleItem: function(dashboardField) {
        var displayFileName = DataHandler.getData("dashboard.currentPdfLink");
        var fileinfo = Dashboard.generateFileInfo(displayFileName);
        var field, ext, displayLink;
        // var dcurrentDropDownValue = TemplateHelper.getTemplateAttr(Template, "dashboard.orderbydropdown", "value", null);

        var dashboardOrderBy = DataHandler.getData("dashboard.orderBy", null);
        TemplateHelper.setTemplateAttr(dashboardField, "dashboard.orderbydropdown", "value", dashboardOrderBy);
        if (fileinfo && $S.isString(fileinfo.ext)) {
            ext = fileinfo.ext.toLowerCase();
            displayLink = DataHandler.getCurrentPdfLink();
            if (Config.imgExt.indexOf(ext) >= 0) {
                field = TemplateHelper(dashboardField).searchFieldV2("dashboard.display.object.div");
                TemplateHelper.addClassTemplate(field, "dashboard.display.object.div", "d-none");

                field = TemplateHelper(dashboardField).searchFieldV2("dashboard.display.img");
                field.src = displayLink;
                field.alt = fileinfo.filename;
            } else {
                field = TemplateHelper(dashboardField).searchFieldV2("dashboard.display.img.div");
                TemplateHelper.addClassTemplate(field, "dashboard.display.img.div", "d-none");
                field = TemplateHelper(dashboardField).searchFieldV2("pdfViewObject");
                field.data = displayLink;
                // field.type = "application/" + ext;
                field = TemplateHelper(dashboardField).searchFieldV2("pdfViewEmbed");
                field.src = displayLink;
                // field.type = "application/" + ext;
            }
        }
    },
    loadPageData: function(callback) {
        var url = Config.getApiUrl("get_files", false, true);
        if (!$S.isString(url)) {
            $S.callMethod(callback);
        }
        $S.loadJsonData(null, [url], function(response, apiName, ajaxDetails) {
            if ($S.isObject(response) && $S.isArray(response.data)) {
                var dashboardApiResponse = Dashboard._generateDashboardResponse(response.data);
                var apiResponseByDate = Dashboard._generateDashboardResponseByDate(dashboardApiResponse);
                if (apiResponseByDate && apiResponseByDate.length > 0) {
                    if (apiResponseByDate[0].fieldData && apiResponseByDate[0].fieldData.length > 0) {
                        GATracking.trackResponseAfterLogin("view_file_dashboard", {"status": "IFRAME"});
                        DataHandler.setData("dashboard.currentPdfLink", apiResponseByDate[0].fieldData[0].actualFilename);
                    }
                }
                DataHandler.setData("dashboard.apiResponse", dashboardApiResponse);
                DataHandler.setData("dashboard.apiResponseByUser", Dashboard._generateDashboardResponseByUser(dashboardApiResponse));
                DataHandler.setData("dashboard.apiResponseByDate", apiResponseByDate);
            }
        }, function() {
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethod());
    }
});

Dashboard.extend({
    handleApiResponse: function(callback, apiName, ajax, response) {
        if (response.status === "FAILURE") {
            alert(DataHandler.getAleartMessage(response));
            if (response.failureCode === "UNAUTHORIZED_USER") {
                AppHandler.LazyReload();
            }
            return false
        }
        alert("File deleted");
        var jsonFileData = AppHandler.GetStaticData("jsonFileData", {});
        var redirectUrl = "";
        if ($S.isObject(jsonFileData) && $S.isObject(jsonFileData.config)) {
            if ($S.isString(jsonFileData.config.uploadFileRedirectUrl)) {
                redirectUrl = jsonFileData.config.uploadFileRedirectUrl;
            }
        }
        if (redirectUrl.length > 0) {
            AppHandler.LazyRedirect(redirectUrl, 250);
        }
        return true;
    },
    deleteFile: function(filename, callback) {
        var url = Config.getApiUrl("delete_file", "", true);
        var postData = {};
        postData["filename"] = filename;
        postData["role_id"] = Config.roleId;
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            console.log(response);
            if (status === "FAILURE") {
                GATracking.trackResponseAfterLogin("delete_file", {"status": "FAILURE_RESPONSE"});
                alert("Error in delete file, Please Try again.");
            } else {
                GATracking.trackResponseAfterLogin("delete_file", response);
                Dashboard.handleApiResponse(callback, "delete_file", ajax, response);
            }
        });
    },
    getRenderFieldRow: function() {
        var dashboardTemplate = this.getDashboardField();
        // var apiData = DataHandler.getData("dashboard.apiResponseByDate", []);
        // if (apiData.length < 1) {
        //     return AppHandler.getTemplate(Template, "noDataFound", {});
        // }
        // var dashboardTemplate = AppHandler.getTemplate(Template, "dashboard", {});
        // var dashboardTemplateData = {"dashboardRow": []};
        // var template2, template2Data;
        // template2 = AppHandler.getTemplate(Template, "dashboardOrderByOption", {});
        // TemplateHelper.setTemplateAttr(template2, "dashboard.orderbydropdown.td", "colSpan", 3);
        // dashboardTemplateData.dashboardRow.push(template2);
        // var i, j, count;
        // var parentTemplateName = "dashboardRowDataByDate";
        // var currentPdfLink = DataHandler.getData("dashboard.currentPdfLink", "");
        // var currentUserName = AppHandler.GetUserData("username", "");
        // for(i=0; i<apiData.length; i++) {
        //     if ($S.isArray(apiData[i].fieldData) && apiData[i].fieldData.length > 0) {
        //         template2 = AppHandler.getTemplate(Template, "dashboardRowHeading", {});
        //         TemplateHelper.setTemplateAttr(template2, "dashboardRowHeading.heading", "colSpan", 3);

        //         template2Data = {"rowHeading": apiData[i].heading};
        //         TemplateHelper.updateTemplateText(template2, template2Data);
        //         dashboardTemplateData.dashboardRow.push(template2);

        //         template2 = AppHandler.getTemplate(Template, "dashboard1stRowByDate", {});
        //         dashboardTemplateData.dashboardRow.push(template2);
        //         count=1;
        //         for (j=0; j<apiData[i].fieldData.length; j++) {
        //             template2 = AppHandler.getTemplate(Template, parentTemplateName, {});
        //             template2Data = {};
        //             template2Data[parentTemplateName+".s.no"] = count++;
        //             template2Data[parentTemplateName+".username"] = apiData[i].fieldData[j]["username"];

        //             template2Data[parentTemplateName+".fileinfo"] = Dashboard._generateFileinfoField(currentUserName, apiData[i].fieldData[j], currentPdfLink);
        //             TemplateHelper.updateTemplateText(template2, template2Data);
        //             dashboardTemplateData.dashboardRow.push(template2);
        //         }
        //     }
        // }
        // TemplateHelper.updateTemplateText(dashboardTemplate, dashboardTemplateData);
        Dashboard.displayVisibleItem(dashboardTemplate);
        return dashboardTemplate;
    }
});
})($S);

export default Dashboard;
