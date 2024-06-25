import $S from "../../interface/stack.js";
import TemplateHelper from "../../common/TemplateHelper";

// import Config from "./Config";
import DataHandler from "./DataHandler";
import TemplateHandler from "./template/TemplateHandler";
var TestPage;
(function($S){
// var DT = $S.getDT();
TestPage = function(arg) {
    return new TestPage.fn.init(arg);
};
TestPage.fn = TestPage.prototype = {
    constructor: TestPage,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(TestPage);
TestPage.extend({
    _getCurrentSerialNumber: function(currentPageData, currentSNo, lastSNo, lastPageId, currentPageId) {
        var currentSerialNumber = "";
        if (!$S.isNumber(lastSNo)) {
            lastSNo = 0;
        }
        if (currentSNo !== "auto") {
            if ($S.isNumeric(currentSNo)) {
                currentSerialNumber = currentSNo * 1;
            }
        } else {
            currentSerialNumber = lastSNo + 1;
        }
        return currentSerialNumber;
    },
    _getRowIndex: function(currentSNo, maxUserPerPage) {
        var rowIndex = 1;
        if (!$S.isNumber(maxUserPerPage)) {
            maxUserPerPage = 4;
        }
        if ($S.isNumber(currentSNo)) {
            rowIndex = currentSNo % maxUserPerPage;
            if (rowIndex === 0) {
                rowIndex = maxUserPerPage;
            }
        }
        return rowIndex;
    },
    _verifyPageName: function(pageData, maxUserPerPage) {
        var finalPageDataArray = [];
        var j, temp;
        if (!$S.isNumber(maxUserPerPage)) {
            maxUserPerPage = 4;
        }
        if ($S.isObject(pageData)) {
            for (var pageId in pageData) {
                if (!$S.isArray(pageData[pageId])) {
                    continue;
                }
                if (pageData[pageId].length <= maxUserPerPage) {
                    finalPageDataArray.push(pageData[pageId]);
                } else {
                    j = 0;
                    temp = [];
                    for (var i=0; i<pageData[pageId].length; i++) {
                        if (j<maxUserPerPage) {
                            j++;
                            temp.push(pageData[pageId][i]);
                            continue;
                        }
                        finalPageDataArray.push(temp);
                        j = 1;
                        temp = [];
                        temp.push(pageData[pageId][i]);
                    }
                    finalPageDataArray.push(temp);
                }
            }
        }
        return finalPageDataArray;
    },
    _getPageParam: function() {
        var pageParam = DataHandler.getAppData("pageParam", {});
        var pageParamDate = DataHandler.getAppData("pageParam.date", "");
        if ($S.isStringV2(pageParamDate) && $S.isObject(pageParam)) {
            pageParam["date"] = pageParamDate;
        }
        return pageParam;
    },
    _generateTemplateData: function(pageData) {
        var i, j, questionArr;
        var subOptions;
        if ($S.isArray(pageData)) {
            for (i=0; i<pageData.length; i++) {
                if ($S.isObject(pageData[i])) {
                    for(var key in pageData[i]) {
                        if ($S.isString(pageData[i][key])) {
                            pageData[i][key] = pageData[i][key].replaceAll("...", ",");
                        }
                    }
                }
                if ($S.isObject(pageData[i]) && $S.isStringV2(pageData[i]["question"])) {
                    questionArr = pageData[i]["question"].split(";");
                    if (questionArr.length > 1) {
                        pageData[i]["sub_options"] = [];
                        for(j=1;j<questionArr.length;j++) {
                            subOptions = TemplateHelper.updateTemplateText(this.getTemplate("page-template-sub_options"), {"page-template-sub_options.name": questionArr[j]});
                            pageData[i]["sub_options"].push(subOptions);
                        }
                        pageData[i]["question"] = questionArr[0];
                    }
                }
            }
        }
        return pageData;
    }
});
TestPage.extend({
    getTemplate: function(templateName, pageName, pageData) {
        var pageTemplate = [];
        if ($S.isStringV2(templateName)) {
            pageTemplate = DataHandler.getAppData(templateName, []);
        }
        return pageTemplate;
    },
    getPageFromData: function(pageName, pageData, pageType) {
        var finalPages = [], template;
        var table, appField;
        var templateData = this._generateTemplateData(pageData);
        if (templateData.length < 1) {
            finalPages.push(TemplateHandler.getTemplate("noDataFound", []));
        } else {
            finalPages.push(this.getTemplate("app-header"));
            table = this.getTemplate("page-template-table");
            for (var i=0; i<templateData.length; i++) {
                template = this.getTemplate("page-template-table-body-row");
                if ($S.isObject(templateData[i])) {
                    if ($S.isString(templateData[i]["option-1"]) && templateData[i]["option-1"].length === 0) {
                        TemplateHelper.addClassTemplate(template, "page-template-table-body-row.option-1-fields", "d-none");
                    }
                    if ($S.isString(templateData[i]["option-2"]) && templateData[i]["option-2"].length === 0) {
                        TemplateHelper.addClassTemplate(template, "page-template-table-body-row.option-2-fields", "d-none");
                    }
                    if ($S.isString(templateData[i]["option-3"]) && templateData[i]["option-3"].length === 0) {
                        TemplateHelper.addClassTemplate(template, "page-template-table-body-row.option-3-fields", "d-none");
                    }
                    if ($S.isString(templateData[i]["option-4"]) && templateData[i]["option-4"].length === 0) {
                        TemplateHelper.addClassTemplate(template, "page-template-table-body-row.option-4-fields", "d-none");
                    }
                }
                TemplateHelper.updateTemplateText(template, templateData[i]);
                TemplateHelper.addItemInTextArray(table, "page-template-table.name", template);
            }
            finalPages.push(table);
            appField = this.getTemplate("app-field");
            TemplateHelper.addClassTemplate(appField, "app-field.name", pageType);
            if ($S.isArray(appField) && appField.length > 0) {
                TemplateHelper.addItemInTextArray(appField, "app-field.name", finalPages);
                finalPages = appField;
            }
        }
        return finalPages;
    }
});

})($S);

export default TestPage;
