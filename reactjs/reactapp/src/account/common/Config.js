import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";
import Template from "./Template.js";

var basepathname = $$$.basepathname;

var Config = {};
Config.Template = Template;
Config.baseapi = $$$.baseapi;
Config.backIconUrl = $$$.backIconUrl;

var appControlApi = $$$.appControlApi;

if (!$S.isArray(appControlApi)) {
    appControlApi = [];
}
Config.appControlApi = appControlApi.map(function(el, i, arr) {
    return Config.baseapi + el;
});

var pages = {
    "home": basepathname+"/",
    "journal": basepathname+"/journal",
    "journalbydate": basepathname+"/journalbydate",
    "ledger": basepathname+"/ledger",
    "trialbalance": basepathname+"/trialbalance",
    "currentbal": basepathname+"/currentbal",
    "currentbalbydate": basepathname+"/currentbalbydate",
    "summary": basepathname+"/summary",
    "accountsummarybydate": basepathname+"/summarybydate",
    "accountsummarybycalander": basepathname+"/summarybycalander",
    "customisedebit": basepathname+"/customisedebit",
    "customisecredit": basepathname+"/customisecredit",
    "custompage": basepathname+"/custompage",
    "profitandloss": basepathname+"/profitandloss"
};

Config.home = "home";
Config.journal = "journal";
Config.journalbydate = "journalbydate";
Config.ledger = "ledger";
Config.trialbalance = "trialbalance";
Config.currentbal = "currentbal";
Config.currentbalbydate = "currentbalbydate";
Config.summary = "summary";
Config.accountsummarybydate = "accountsummarybydate";
Config.accountsummarybycalander = "accountsummarybycalander";
Config.customisedebit = "customisedebit";
Config.customisecredit = "customisecredit";
Config.custompage = "custompage";
Config.profitandloss = "profitandloss";
Config.noMatch = "noMatch";

Config.dateSelectionRequired = ["journalbydate", "currentbalbydate", "summary", "accountsummarybydate"];
Config.pages = pages;

// Config.homeFields = [
//     {"name": "journalbydate", "toText": "Journal By Date"},
//     {"name": "currentbalbydate", "toText": "Current Balance By Date"},
//     {"name": "profitandloss", "toText": "Profit and Loss"},
//     {"name": "custompage", "toText": "Customise Account Summary"},
//     {"name": "accountsummarybycalander", "toText": "Account Summary By Calender"},
//     {"name": "summary", "toText": "Account Summary By A/C Name"},
//     {"name": "accountsummarybydate", "toText": "Account Summary By Date"},
//     {"name": "customisedebit", "toText": "Customised Debit Account Summary"},
//     {"name": "customisecredit", "toText": "Customised Credit Account Summary"},
//     {"name": "trialbalance", "toText": "Trial Balance"},
//     {"name": "journal", "toText": "Journal"},
//     {"name": "ledger", "toText": "Ledger"},
//     {"name": "currentbal", "toText": "Current Balance"}
// ];

// Config.homeFields = Config.homeFields.map(function(el, i, arr) {
//     el["s.no"] = i;
//     el["toUrl"] = pages[el.name];
//     return el;
// });

// Config.pageHeading = {
//     "home": "Home",
//     "trialbalance": "Trial Balance",
//     "journal": "Journal",
//     "journalbydate": "Journal By Date",
//     "ledger": "Ledger Book",
//     "currentbal": "Current Balance",
//     "currentbalbydate": "Current Balance By Date",
//     "customisedebit": "Customised Debit Account Summary",
//     "customisecredit": "Customised Credit Account Summary",
//     "custompage": "Customised Account Summary",
//     "summary": "Account Summary",
//     "accountsummarybydate": "Account Summary By Date",
//     "accountsummarybycalander": "Account Summary By Calender",
//     "profitandloss": "Profit and Loss",
//     "pageNotFound": "Page Not Found"
// };


// Config.dateSelection = [
//     {"name": "Daily", "value": "daily"},
//     {"name": "Monthly", "value": "monthly"},
//     {"name": "Yearly", "value": "yearly"},
//     {"name": "All", "value": "all"}
// ];

// Config.defaultDateSelectionType = "all";

// Config.defaultCompanyName = "Loading...";
// Config.defaultUserName = "";

/*Update from global variable */

// var key;
// var globalPageHeading = {};
// var globalLinkHeading = {};
// var globalRemoveHomeLink = {};

// if ($S.isObject($$$.linkHeading)) {
//     for(key in $$$.linkHeading) {
//         if ($S.isString($$$.linkHeading[key])) {
//             globalLinkHeading[key] = $$$.linkHeading[key];
//         }
//     }
// }

// if ($S.isObject($$$.pageHeading)) {
//     for(key in $$$.pageHeading) {
//         if ($S.isString($$$.pageHeading[key])) {
//             globalPageHeading[key] = $$$.pageHeading[key];
//         }
//     }
// }

// if ($S.isObject($$$.removeHomeLink)) {
//     for(key in $$$.removeHomeLink) {
//         if ($S.isBooleanTrue($$$.removeHomeLink[key])) {
//             globalRemoveHomeLink[key] = true;
//         }
//     }
// }

// for (key in Config.pageHeading) {
//     if ($S.isString(globalPageHeading[key])) {
//         Config.pageHeading[key] = globalPageHeading[key];
//     }
// }

// Config.homeFields = Config.homeFields.filter(function(el, i, arr) {
//     if ($S.isString(globalLinkHeading[el.name])) {
//         el["toText"] = globalLinkHeading[el.name];
//     }
//     if ($S.isBooleanTrue(globalRemoveHomeLink[el.name])) {
//         return false;
//     }
//     return true;
// });


// Config.isValidCurrentPage = function(currentPage) {
//     var result = false;
//     var defaultValidPage = ["home", "noMatch"];
//     if (!$S.isString(currentPage)) {
//         return true;
//     }
//     if (defaultValidPage.indexOf(currentPage) >= 0) {
//         return true;
//     }
//     for (var i=0; i<Config.homeFields.length; i++) {
//         if (currentPage === Config.homeFields[i].name) {
//             result = true;
//             break;
//         }
//     }
//     return result;
// };

export default Config;
