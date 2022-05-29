import $S from '../../interface/stack.js';
// import TemplateHelper from '../../common/TemplateHelper';

import TemplateHelper from "../../common/TemplateHelper";
// import AppHandler from "../../common/app/common/AppHandler";
// import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";

import Config from './Config';
import DataHandler from './DataHandler';
import DataHandlerV2 from './DataHandlerV2';
import AccountHelper from './AccountHelper';
import AccountHelper2 from './AccountHelper2';
import Template from './Template';

var TemplateHandler;

(function($S){
// var DT = $S.getDT();
var loadingCount = 0;
TemplateHandler = function(arg) {
    return new TemplateHandler.fn.init(arg);
};


TemplateHandler.fn = TemplateHandler.prototype = {
    constructor: TemplateHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(TemplateHandler);

TemplateHandler.extend({
    "journal": function(pageName, renderData) {
        var template = this.getTemplate(pageName), temp;
        var sNo = 1;
        if ($S.isArray(renderData) && renderData.length > 0) {
            TemplateHelper.addItemInTextArray(template, "journalEntryTr", this.getTemplate("journalEntry1stRow", ""));
            for (var i=0; i<renderData.length; i++) {
                temp = this.getTemplate("journalEntry", "");
                if ($S.isObject(renderData[i])) {
                    renderData[i]["value1"] = renderData[i]["value"];
                    renderData[i]["value2"] = renderData[i]["value"];
                }
                renderData[i]["s.no"] = sNo++;
                TemplateHelper.updateTemplateText(temp, renderData[i]);
                TemplateHelper.addItemInTextArray(template, "journalEntryTr", temp);
            }
            return template;
        }
        return this.getTemplate("noDataFound");
    },
    "journalbydate": function(pageName, renderData) {
        return AccountHelper.getJournalDataByDateFields(renderData);
    },
    "currentbalbydate": function(pageName, renderData) {
        var accountData = DataHandlerV2.getAccountData();
        return AccountHelper.getCurrentBalByDateRowData(renderData, accountData);
    },
    "currentbalbydatev2": function(pageName, renderData) {
        var accountData = DataHandlerV2.getAccountData();
        return AccountHelper.getCurrentBalByDateRowDataV2(renderData, accountData);
    },
    "summary": function(pageName, renderData) {
        var accountData = DataHandlerV2.getAccountData();
        var dateSelectionFields = DataHandler.getData("dateSelectionParameter", []);
        return AccountHelper.getAccountSummaryFields(renderData, accountData, dateSelectionFields);
    },
    "accountsummarybydate": function(pageName, renderData) {
        var accountData = DataHandlerV2.getAccountData();
        return AccountHelper.getAccountSummaryByDateFields(renderData, accountData);
    },
    "accountsummarybycalander": function(pageName, renderData) {
        var accountData = DataHandlerV2.getAccountData();
        var yearlyDateSelection = DataHandler.getData("combinedDateSelectionParameter", {})["yearly"];
        return AccountHelper.getAccountSummaryByCalenderFields(renderData, accountData, yearlyDateSelection);
    },
    "profitandloss": function(pageName, renderData) {
        return AccountHelper2.getProfitAndLossFields(renderData);
    },
    "trialbalance": function(pageName, renderData) {
        var accountData = DataHandlerV2.getAccountData();
        return AccountHelper.getTrialBalanceFields(renderData, accountData);
    },
    "ledger": function(pageName, renderData) {
        var accountData = DataHandlerV2.getAccountData();
        return AccountHelper.getLedgerBookFields(renderData, accountData);
    },
    "customisecredit": function(pageName, renderData) {
        var dataByCompany = renderData;
        var accountData = DataHandlerV2.getAccountData();
        var customFields = {"customiseCreditAccount": DataHandler.getAppData("customiseCreditAccount", [])};
        var customiseCreditAccountData = AccountHelper2.getCustomAccountsData(accountData, customFields, "customiseCreditAccount");
        var yearlyDateSelection = DataHandler.getData("combinedDateSelectionParameter", {})["yearly"];
        return AccountHelper.getCustomisedAccountSummaryByCalenderFields(dataByCompany, customiseCreditAccountData, yearlyDateSelection, "Cr");
    },
    "customisedebit": function(pageName, renderData) {
        var dataByCompany = renderData;
        var accountData = DataHandlerV2.getAccountData();
        var customFields = {"customiseDebitAccount": DataHandler.getAppData("customiseDebitAccount", [])};
        var customiseCreditAccountData = AccountHelper2.getCustomAccountsData(accountData, customFields, "customiseDebitAccount");
        var yearlyDateSelection = DataHandler.getData("combinedDateSelectionParameter", {})["yearly"];
        return AccountHelper.getCustomisedAccountSummaryByCalenderFields(dataByCompany, customiseCreditAccountData, yearlyDateSelection, "Dr");
    },
    "custompage": function(pageName, renderData) {
        var dataByCompany = renderData;
        var accountData = DataHandlerV2.getAccountData();
        var customFields = {"customeAccount": DataHandler.getAppData("customeAccount", [])};
        var customiseAccountData = AccountHelper2.getCustomAccountsData(accountData, customFields, "customeAccount");
        var yearlyDateSelection = DataHandler.getData("combinedDateSelectionParameter", {})["yearly"];
        return AccountHelper.getCustomiseAccountSummaryFields(dataByCompany, customiseAccountData, yearlyDateSelection);
    }
});

TemplateHandler.extend({
    getTemplate: function(pageName) {
        if (Template[pageName]) {
            return $S.clone(Template[pageName]);
        }
        return $S.clone(Template["templateNotFound"]);
    },
    _getLinkTemplateV2: function(toUrl, toText, templateName) {
        var linkTemplate = TemplateHandler.getTemplate(templateName);
        TemplateHelper.setTemplateAttr(linkTemplate, "home.link.toUrl", "href", toUrl);
        TemplateHelper.updateTemplateText(linkTemplate, {"home.link.toText": toText});
        return linkTemplate;
    },
    // getAppHeading: function(currentPageName) {
    //     var goBackLinkData = Config.goBackLinkData;
    //     if (currentPageName === "home") {
    //         goBackLinkData = [];
    //     }
    //     var headingText = DataHandler.getData("companyName", "");
    //     var pageHeading = DataHandler.GetMetaDataPageHeading(currentPageName);
    //     var appHeading = {
    //         "tag": "div",
    //         "className": "container",
    //         "text": [goBackLinkData, {"tag": "div.center.h2", "text": headingText},{"tag": "div.center.h2", "text": pageHeading}]
    //     };
    //     return [appHeading];
    // },
    generateProjectHomeRenderField: function() {
        var appControlData = DataHandler.getData("appControlData", []);
        var template = this.getTemplate("home");
        var linkTemplate, toUrl;
        if (appControlData.length === 0) {
            return this.getTemplate("noDataFound");
        }
        for (var i = 0; i< appControlData.length; i++) {
            toUrl = DataHandler.getPageUrl(appControlData[i].id);
            linkTemplate = this._getLinkTemplateV2(toUrl, appControlData[i].name, "home.link");
            TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
        }
        return template;
    },
    generateHomeRenderField: function() {
        var homeFields = CommonDataHandler.getList2Data(DataHandler, Config.otherPagesList);
        var template = this.getTemplate("home");
        var otherPagesList = Config.otherPagesList;
        var linkTemplate, toUrl;
        if (homeFields.length === 0) {
            return this.getTemplate("noDataFound");
        }
        for (var i = 0; i< homeFields.length; i++) {
            toUrl = "";
            if (otherPagesList.indexOf(homeFields[i].pageName) >= 0) {
                toUrl = DataHandler.getOtherPagesUrlByPageName(homeFields[i].pageName);
                linkTemplate = this._getLinkTemplateV2(toUrl, homeFields[i].toText, "home.link");
            } else if ($S.isStringV2(homeFields[i].toUrl)) {
                toUrl = homeFields[i].toUrl;
                linkTemplate = this._getLinkTemplateV2(toUrl, homeFields[i].toText, "home.a");
            }
            if ($S.isStringV2(toUrl)) {
                TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
            }
        }
        return template;
    },
    SetHeadingUsername: function(username) {
        var heading = this.getTemplate("heading");
        if ($S.isString(username)) {
            TemplateHelper.setTemplateAttr(heading, "pageHeading.username", "text", username);
            Template["heading"] = heading;
            return true;
        }
        return false;
    },
    GetHeadingField: function(headingText) {
        var renderField = this.getTemplate("heading");
        TemplateHelper.updateTemplateText(renderField, {"heading-text": headingText});
        return renderField;
    },
    GetPageRenderField: function(dataLoadStatus, renderData, footerData, pageName) {
        var renderField;
        if (!dataLoadStatus) {
            renderField = this.getTemplate("loading");
            $S.log("loadingCount: " + (loadingCount++));
            return renderField;
        }
        // var currentList3Data = DataHandler.getCurrentList3Data();
        // var sortingFields = DataHandler.getData("sortingFields", []);
        var pageName1 = DataHandler.getData("pageName", "");
        if (pageName1 === Config.projectHome) {
            renderField = this.generateProjectHomeRenderField();
        } else if (pageName1 === Config.home) {
            renderField = this.generateHomeRenderField();
        } else if (pageName1 === Config.otherPages && (Config.otherPagesList.indexOf(pageName) < 0 || CommonDataHandler.isPageDisabled(DataHandler, pageName))) {
            renderField = this.getTemplate("noPageFound");
        } else {
            if ($S.isFunction(TemplateHandler[pageName])) {
                renderField = TemplateHandler[pageName](pageName, renderData);
            } else {
                renderField = this.getTemplate("noPageFound");
            }
        }
        // var metaData = DataHandler.getMetaData({});
        // var footerFieldHtml = AppHandler.GenerateFooterHtml(metaData, footerData);
        // var footerField = this.getTemplate("footerField");
        // TemplateHelper.updateTemplateText(footerField, {"footerLink": footerFieldHtml});
        // TemplateHelper.addItemInTextArray(renderField, "footer", footerField);
        return renderField;
    },
});

})($S);

export default TemplateHandler;

