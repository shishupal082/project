import $S from "../../interface/stack.js";
import TemplateHelper from "../../common/TemplateHelper";

// import Config from "./Config";
import DataHandler from "./DataHandler";
import TemplateHandler from "./template/TemplateHandler";
var Mastersheet;
(function($S){
// var DT = $S.getDT();
Mastersheet = function(arg) {
    return new Mastersheet.fn.init(arg);
};
Mastersheet.fn = Mastersheet.prototype = {
    constructor: Mastersheet,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(Mastersheet);
Mastersheet.extend({
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
    _getRowIndex: function(orgSNo, currentSNo, lastSNo, lastPageId, pageId) {
        var rowIndex = 1;
        if ($S.isNumber(currentSNo)) {
            rowIndex = currentSNo % 4;
            if (rowIndex === 0) {
                rowIndex = 4;
            }
        }
        return rowIndex;
    },
    _verifyPageName: function(pageData) {
        var finalPageDataArray = [];
        var maxUserPerPage = 4, j, temp;
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
    _generateTemplateData: function(mastersheetData) {
        var tempData = {}, tempData2, pageId, i;
        if ($S.isArray(mastersheetData)) {
            for (i=0; i<mastersheetData.length; i++) {
                if ($S.isObject(mastersheetData[i]) && $S.isStringV2(mastersheetData[i]["pageId"])) {
                    pageId = mastersheetData[i]["pageId"];
                    if (!$S.isArray(tempData[pageId])) {
                        tempData[pageId] = [];
                    }
                    tempData[pageId].push(mastersheetData[i]);
                }
            }
        }
        var finalData = [];
        var lastSNo = "", lastPageId = "";
        var rowIndex, pageParam, orgSNo, currentSNo, serialNoDisplay, hq, billUnitNo;
        tempData = this._verifyPageName(tempData);
        for (pageId in tempData) {
            pageParam = DataHandler.getAppData("pageParam", {});
            tempData2 = $S.clone(pageParam);
            hq = "";
            billUnitNo = "";
            if ($S.isArray(tempData[pageId])) {
                for (i=0; i<tempData[pageId].length; i++) {
                    if ($S.isObject(tempData[pageId][i])) {
                        orgSNo = tempData[pageId][i]["s_no"];
                        serialNoDisplay = orgSNo;
                        currentSNo = this._getCurrentSerialNumber(tempData2, orgSNo, lastSNo, lastPageId, pageId);
                        if (!$S.isNumber(currentSNo)) {
                            continue;
                        }
                        rowIndex = this._getRowIndex(orgSNo, currentSNo, lastSNo, lastPageId, pageId);
                        lastSNo = currentSNo;
                        if (orgSNo === "auto") {
                            serialNoDisplay = currentSNo;
                        }
                        tempData2["username-" + rowIndex] = serialNoDisplay + ") " + tempData[pageId][i]["username"];
                        tempData2["user-designation-" + rowIndex] = tempData[pageId][i]["designation"];
                        tempData2["user-pf-number-" + rowIndex] = tempData[pageId][i]["pf_no"];
                        if ($S.isStringV2(tempData[pageId][i]["hq"])) {
                            hq = tempData[pageId][i]["hq"];
                        }
                        if ($S.isStringV2(tempData[pageId][i]["bill_unit_no"])) {
                            billUnitNo = tempData[pageId][i]["bill_unit_no"];
                        }
                    }
                }
            }
            lastPageId = pageId;
            tempData2["hq"] = hq;
            tempData2["bill-unit-no"] = billUnitNo;
            finalData.push(tempData2);
        }
        return finalData;
    }
});
Mastersheet.extend({
    getTemplate: function(pageName, mastersheetData) {
        var mastersheetPage = [];
        var templateName = DataHandler.getAppData("templateName", "");
        if ($S.isStringV2(templateName)) {
            mastersheetPage = DataHandler.getAppData(templateName, []);
        }
        return mastersheetPage;
    },
    getPageFromData: function(pageName, mastersheetData) {
        var finalPages = [], template;
        var templateData = this._generateTemplateData(mastersheetData);
        if (templateData.length < 1) {
            finalPages.push(TemplateHandler.getTemplate("noDataFound", []));
        } else {
            for (var i=0; i<templateData.length; i++) {
                template = this.getTemplate();
                TemplateHelper.updateTemplateText(template, templateData[i]);
                finalPages.push(template);
            }
        }
        return finalPages;
    }
});

})($S);

export default Mastersheet;
