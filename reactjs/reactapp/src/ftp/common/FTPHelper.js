import $S from "../../interface/stack.js";
import Api from "../../common/Api";
import TemplateHelper from "../../common/TemplateHelper";
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
    _generateFileinfoField: function(Data, username, filename, currentPdfLink) {
        var template = Data.getTemplate("dashboard.fileinfo", {});
        var field, fullFilename;
        fullFilename = username + "/" + filename;

        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.filename");
        field.text = filename;
        if (fullFilename === currentPdfLink) {
            field.className = TextFilter(field.className).addClass("text-danger").className;
        }

        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.view");
        field.value = fullFilename;

        if (fullFilename === currentPdfLink) {
            field.className = TextFilter(field.className).addClass("disabled").className;
        }
        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.open-in-new-tab");
        field.href = PageData.getPdfViewLink(fullFilename);

        field = TemplateHelper(template).searchFieldV2("dashboard.fileinfo.download");
        field.href = PageData.getPdfDownloadLink(fullFilename);
        return template;
    },
    getDashboardField: function(Data, pageName) {
        var apiData = PageData.getData("dashboard.apiData", {});
        var i, j, temp;
        var displayUserSequense = ["public"];

        temp = Object.keys(apiData);
        if (temp.length < 1) {
            return Data.getTemplate("noDataFound", {});
        }
        temp = temp.sort();
        for(i=0; i<temp.length; i++) {
            if (temp[i] === "public") {
                continue;
            }
            displayUserSequense.push(temp[i]);
        }
        var dashboardData = {"dashboardRow": []}, template2Data;
        var currentPdfLink = PageData.getData("dashboard.currentPdfLink", "");
        for(i=0; i<displayUserSequense.length; i++) {
            if (apiData[displayUserSequense[i]]) {
                template2Data = {"rowHeading": displayUserSequense[i],
                                "dashboardRowData": apiData[displayUserSequense[i]]};
                dashboardData["dashboardRow"].push(template2Data);
            }
        }
        var dashboardTemplate = Data.getTemplate(pageName, {});
        var dashboardTemplateData = {"dashboardRow": []};
        var template2;
        var count, username, filename;
        for(i=0; i<dashboardData.dashboardRow.length; i++) {
            username = dashboardData.dashboardRow[i].rowHeading;
            template2 = Data.getTemplate("dashboardRowHeading", {});
            template2Data = {"rowHeading": username};
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            dashboardTemplateData.dashboardRow.push(template2);

            template2 = Data.getTemplate("dashboard1stRow", {});
            dashboardTemplateData.dashboardRow.push(template2);

            count = 1;
            for(j=0; j<dashboardData.dashboardRow[i].dashboardRowData.length; j++) {
                filename = dashboardData.dashboardRow[i].dashboardRowData[j];
                template2 = Data.getTemplate("dashboardRowData", {});
                template2Data = {"s.no": count++};
                template2Data["fileinfo"] = FTP._generateFileinfoField(Data, username, filename, currentPdfLink);
                TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
                dashboardTemplateData.dashboardRow.push(template2);
            }
        }
        TemplateHelper.setTemplateTextByFormValues(dashboardTemplate, dashboardTemplateData);
        // Data.setData("dashboardField", dashboardTemplate);
        return dashboardTemplate;
    }
});
//getFieldTemplateByPageName
FTP.extend({
    getFieldTemplateByPageName: function(Data, pageName) {
        var pageTemplate = [];
        if (pageName === "upload_file") {
            pageTemplate.push(Data.getTemplate(pageName, {}));
        } else if (pageName === "dashboard") {
            var dashboardField = FTP.getDashboardField(Data, pageName);;
            var pdfLink = PageData.getCurrentPdfLink(Data);
            var field = TemplateHelper(dashboardField).searchFieldV2("pdfViewObject");
            field.data = pdfLink;
            field = TemplateHelper(dashboardField).searchFieldV2("pdfViewEmbed");
            field.src = pdfLink;
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
            }
        }, function() {
            $S.callMethod(callBack);
        }, null, Api.getAjaxApiCallMethod());
    },
    loadPageData: function(Data, callBack) {
        var pageName = Config.getPageData("page", "");
        if (pageName === "dashboard") {
            var url = Config.apiMapping["get_files"];
            $S.loadJsonData(null, [url], function(response, apiName, ajaxDetails) {
                var apiDataByUser = {};
                if ($S.isObject(response) && $S.isArray(response.data)) {
                    PageData.setData("dashboard.apiResponse", response.data);
                    PageData.setData("dashboard.currentPdfLink", response.data[0]);
                    var apiData = response.data;
                    var i, temp;
                    for(i=0; i<apiData.length; i++) {
                        if ($S.isString(apiData[i])) {
                            //username/filename
                            temp = apiData[i].split("/");
                            if (temp.length === 2) {
                                if (apiDataByUser[temp[0]]) {
                                    apiDataByUser[temp[0]].push(temp[1]);
                                } else {
                                    apiDataByUser[temp[0]] = [temp[1]];
                                }
                            } else {
                                console.log("Invalid data in api: " + apiData[i]);
                            }
                        } else {
                            console.log("Invalid data in api: " + apiData[i]);
                        }
                    }
                }
                PageData.setData("dashboard.apiData", apiDataByUser);
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
