import $S from "../../interface/stack.js";
import Api from "../../common/Api";
import TemplateHelper from "../../common/TemplateHelper";
import TemplateHelperV2 from "../../common/TemplateHelperV2";
import Config from "./Config";
import PageData from "./PageData";

var FTPHelper = {};

(function($S){
// var DT = $S.getDT();
var TextFilter = $S.getTextFilter();
var FTP = function(arg) {
    return new FTP.fn.init(arg);
};

FTP.fn = FTP.prototype = {
    constructor: FTP,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FTP);

//setLinkTemplate
FTP.extend({
    setLinkTemplate: function(Data) {
        var linkTemplate = Data.getTemplate("link", {});
        var field = TemplateHelper(linkTemplate).searchField("link.loginAs");
        field.text = Data.getData("userName", "");
        // field = TemplateHelper(linkTemplate).searchField("link.logout");
        // field.className = TextFilter(field.className).addClass("d-none").className;

        // field = TemplateHelper(linkTemplate).searchField("link.change_password");
        // field.className = TextFilter(field.className).addClass("d-none").className;

        field = TemplateHelper(linkTemplate).searchField("link.forgot_password");
        field.className = TextFilter(field.className).addClass("d-none").className;

        Data.setData("linkTemplate", linkTemplate);
        return linkTemplate;
    }
});

// checkForRedirect
FTP.extend({
    checkForRedirect: function(Data) {
        var pageName = Config.getPageData("page", "");
        var isLogin = Data.getData("isLogin", false);
        var redirectStatus = false;
        if (["dashboard", "upload_file", "change_password", "logout"].indexOf(pageName) >= 0) {
            if (!isLogin) {
                Config.location.href = Config.basepathname + "/login";
                redirectStatus = true;
            }
        } else if (["forgot_password", "login"].indexOf(pageName) >= 0) {
            if (isLogin) {
                Config.location.href = Config.basepathname + "/dashboard";
                redirectStatus = true;
            }
        }
        return redirectStatus;
    }
});
FTP.extend({
    _generateFileinfoField: function(Data, currentUserName, fileResponse, currentPdfLink) {
        var template = Data.getTemplate("dashboard.fileinfo", {});
        var field, fullFilename;
        fullFilename = fileResponse.actualFilename;

        // Changing display text parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.filename");
        field.text = fileResponse.filename;
        if (fullFilename === currentPdfLink) {
            field.className = TextFilter(field.className).addClass("text-danger").className;
        }
        // Changing view parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.view");
        field.value = fullFilename;
        if (fullFilename === currentPdfLink) {
            field.className = TextFilter(field.className).addClass("disabled").className;
        }

        // Changing open in new tab link parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.open-in-new-tab");
        field.href = PageData.getPdfViewLink(fullFilename);

        // Changing download link parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.download");
        field.href = PageData.getPdfDownloadLink(fullFilename);

        // Changing delete link parameter
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.delete");
        field.value = fullFilename;
        if (currentUserName !== fileResponse.username) {
            field.className = TextFilter(field.className).removeClass("text-danger").addClass("disabled").className;
        }
        return template;
    },
    _getDashboardData: function(Data) {
        var dashboardData = {"dashboardRow": []};
        var apiData = PageData.getData("dashboard.apiResponseByUser", {});
        var i, temp;
        temp = Object.keys(apiData);
        var displayUserSequense = ["public"];
        temp = temp.sort();
        for(i=0; i<temp.length; i++) {
            if (temp[i] === "public") {
                continue;
            }
            displayUserSequense.push(temp[i]);
        }
        var template2Data;
        for(i=0; i<displayUserSequense.length; i++) {
            if (apiData[displayUserSequense[i]]) {
                template2Data = {"rowHeading": displayUserSequense[i],
                                "dashboardRowData": apiData[displayUserSequense[i]]};
                dashboardData["dashboardRow"].push(template2Data);
            }
        }
        return dashboardData;
    },
    getDashboardFieldOrderByDate: function(Data) {
        var apiData = PageData.getData("dashboard.apiResponse", []);
        if (apiData.length < 1) {
            return Data.getTemplate("noDataFound", {});
        }

        var dashboardTemplate = Data.getTemplate("dashboard", {});
        var dashboardTemplateData = {"dashboardRow": []};
        var template2, template2Data;
        template2 = Data.getTemplate("dashboardOrderByOption", {});
        TemplateHelperV2.setTemplateAttr(template2, "dashboard.orderbydropdown.td", "colSpan", 3);
        dashboardTemplateData.dashboardRow.push(template2);
        var i, count=1;
        template2 = Data.getTemplate("dashboard1stRowByDate", {});
        dashboardTemplateData.dashboardRow.push(template2);
        var parentTemplateName = "dashboardRowDataByDate";
        var currentPdfLink = PageData.getData("dashboard.currentPdfLink", "");
        var currentUserName = Data.getData("userName", "");
        for(i=0; i<apiData.length; i++) {
            template2 = Data.getTemplate(parentTemplateName, {});
            template2Data = {};
            template2Data[parentTemplateName+".s.no"] = count++;
            template2Data[parentTemplateName+".username"] = apiData[i]["username"];

            template2Data[parentTemplateName+".fileinfo"] = FTP._generateFileinfoField(Data, currentUserName, apiData[i], currentPdfLink);
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            dashboardTemplateData.dashboardRow.push(template2);
        }
        TemplateHelper.setTemplateTextByFormValues(dashboardTemplate, dashboardTemplateData);
        return dashboardTemplate;
    },
    getDashboardField: function(Data, pageName) {
        var orderBy = PageData.getData("dashboard.orderBy", null);
        if (orderBy === "orderByFilename") {
            return FTP.getDashboardFieldOrderByDate(Data);
        }
        var dashboardData = FTP._getDashboardData(Data);
        if (dashboardData.dashboardRow.length < 1) {
            return Data.getTemplate("noDataFound", {});
        }

        var currentUserName = Data.getData("userName", "");
        var dashboardTemplate = Data.getTemplate(pageName, {});
        var dashboardTemplateData = {"dashboardRow": []};

        var template2, template2Data;
        template2 = Data.getTemplate("dashboardOrderByOption", {});
        dashboardTemplateData.dashboardRow.push(template2);

        var i, j, count;
        var currentPdfLink = PageData.getData("dashboard.currentPdfLink", "");
        for(i=0; i<dashboardData.dashboardRow.length; i++) {
            template2 = Data.getTemplate("dashboardRowHeading", {});
            template2Data = {"rowHeading": dashboardData.dashboardRow[i].rowHeading};
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            dashboardTemplateData.dashboardRow.push(template2);

            template2 = Data.getTemplate("dashboard1stRow", {});
            dashboardTemplateData.dashboardRow.push(template2);

            count = 1;
            for(j=0; j<dashboardData.dashboardRow[i].dashboardRowData.length; j++) {
                template2 = Data.getTemplate("dashboardRowData", {});
                template2Data = {"s.no": count++};
                template2Data["fileinfo"] = FTP._generateFileinfoField(Data, currentUserName, dashboardData.dashboardRow[i].dashboardRowData[j], currentPdfLink);
                TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
                dashboardTemplateData.dashboardRow.push(template2);
            }
        }
        TemplateHelper.setTemplateTextByFormValues(dashboardTemplate, dashboardTemplateData);
        return dashboardTemplate;
    }
});
//getFieldTemplateByPageName
FTP.extend({
    displayVisibleItem: function(dashboardField) {
        var displayFileName = PageData.getData("dashboard.currentPdfLink");
        var fileinfo = FTP.generateFileInfo(displayFileName);
        var field, ext, displayLink;
        // var dcurrentDropDownValue = TemplateHelperV2.getTemplateAttr(Template, "dashboard.orderbydropdown", "value", null);

        var dashboardOrderBy = PageData.getData("dashboard.orderBy", null);
        TemplateHelperV2.setTemplateAttr(dashboardField, "dashboard.orderbydropdown", "value", dashboardOrderBy);
        if (fileinfo && $S.isString(fileinfo.ext)) {
            ext = fileinfo.ext.toLowerCase();
            displayLink = PageData.getCurrentPdfLink();
            if (Config.imgExt.indexOf(ext) >= 0) {
                field = TemplateHelper(dashboardField).searchFieldV2("dashboard.display.object.div");
                field.className = TextFilter(field.className).addClass("d-none").className;

                field = TemplateHelper(dashboardField).searchFieldV2("dashboard.display.img");
                field.src = displayLink;
                field.alt = fileinfo.filename;
            } else {
                field = TemplateHelper(dashboardField).searchFieldV2("dashboard.display.img.div");
                field.className = TextFilter(field.className).addClass("d-none").className;
                field = TemplateHelper(dashboardField).searchFieldV2("pdfViewObject");
                field.data = displayLink;
                // field.type = "application/" + ext;
                field = TemplateHelper(dashboardField).searchFieldV2("pdfViewEmbed");
                field.src = displayLink;
                // field.type = "application/" + ext;
            }
        }
    },
    getFieldTemplateByPageName: function(Data, pageName) {
        var pageTemplate = [];
        var template = {};
        if (pageName === "upload_file") {
            template = Data.getTemplate(pageName, {});
            var message = Config.getApiConfig("uploadFileInstruction", "");
            TemplateHelperV2.setTemplateAttr(template, "upload_file.message", "text", message);
            pageTemplate.push(template);
        } else if (pageName === "dashboard") {
            var dashboardField = FTP.getDashboardField(Data, pageName);
            FTP.displayVisibleItem(dashboardField);
            pageTemplate.push(dashboardField);
        } else {
            pageTemplate.push(Data.getTemplate(pageName, {}));
        }
        return pageTemplate;
    }
});
//loadPageData, loadStaticData
FTP.extend({
    loadStaticData: function(Data, callBack) {
        var url = Config.apiMapping["static_file"];
        $S.loadJsonData(null, [url], function(response, apiName, ajaxDetails) {
            if ($S.isObject(response) && $S.isObject(response.data)) {
                if ($S.isObject(response.data.template)) {
                    var oldTemplate = Data.getData("FTPTemplate", {});
                    Object.assign(oldTemplate, response.data.template);
                    Data.setData("FTPTemplate", oldTemplate);
                }
                if ($S.isObject(response.data.config)) {
                    Config.setApiConfig(response.data.config);
                }
            }
        }, function() {
            $S.callMethod(callBack);
        }, null, Api.getAjaxApiCallMethod());
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
        return responseByUser;
    },
    generateFileInfo: function (str) {
        if (!$S.isString(str)) {
            return null;
        }
        var strArr = str.split("/");
        var r = {}, temp;
        if (strArr.length === 2) {
            r = {"actualFilename": str, "filename": strArr[1], "username": strArr[0], "ext": ""};
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
        function reverseFileName(str) {
            if (!$S.isString(str)) {
                return null;
            }
            var strArr = str.split("/");
            if (strArr.length === 2) {
                return strArr[1] + "/" + strArr[0];
            }
            return null;
        }
        if ($S.isArray(response)) {
            var i, fileResponse;
            for(i=0; i<response.length; i++) {
                fileResponse = reverseFileName(response[i]);
                if (fileResponse !== null) {
                    tempResult.push(fileResponse);
                }
            }
            tempResult = tempResult.sort();
            for(i=0; i<tempResult.length; i++) {
                fileResponse = reverseFileName(tempResult[i]);
                if (fileResponse !== null) {
                    finalResult.push(fileResponse);
                }
            }
            for(i=finalResult.length-1; i>=0; i--) {
                fileResponse = FTP.generateFileInfo(finalResult[i]);
                if (fileResponse !== null) {
                    dashboardResult.push(fileResponse);
                }
            }
        }
        return dashboardResult;
    },
    loadPageData: function(Data, callBack) {
        var pageName = Config.getPageData("page", "");
        if (pageName === "dashboard") {
            var url = Config.apiMapping["get_files"];
            $S.loadJsonData(null, [url], function(response, apiName, ajaxDetails) {
                if ($S.isObject(response) && $S.isArray(response.data)) {
                    var dashboardApiResponse = FTP._generateDashboardResponse(response.data);
                    if (dashboardApiResponse && dashboardApiResponse.length > 0) {
                        var pdfLinkNotFound = true;
                        for (var i = 0; i < dashboardApiResponse.length; i++) {
                            if (dashboardApiResponse[i].ext === "pdf") {
                                pdfLinkNotFound = false;
                                PageData.setData("dashboard.currentPdfLink", dashboardApiResponse[i].actualFilename);
                                break;
                            }
                        }
                        if (pdfLinkNotFound) {
                            PageData.setData("dashboard.currentPdfLink", dashboardApiResponse[0].actualFilename);
                        }
                    }
                    PageData.setData("dashboard.apiResponse", dashboardApiResponse);
                    PageData.setData("dashboard.apiResponseByUser", FTP._generateDashboardResponseByUser(dashboardApiResponse));
                }
            }, function() {
                $S.callMethod(callBack);
            }, null, Api.getAjaxApiCallMethod());
        } else {
            $S.callMethod(callBack);
        }
    }
});
FTPHelper = FTP;
})($S);

export default FTPHelper;
