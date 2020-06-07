import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var basepathname = $$$.basepathname;

var Config = {};

Config.baseapi = $$$.baseapi;
Config.backIconUrl = $$$.backIconUrl;
Config.userControlDataApi = $$$.userControlDataApi;


var pages = {
    "home": basepathname+"/",
    "journal": basepathname+"/journal",
    "journalbydate": basepathname+"/journalbydate",
    "ledger": basepathname+"/ledger",
    "trialbalance": basepathname+"/trialbalance",
    "currentbal": basepathname+"/currentbal",
    "currentbalbydate": basepathname+"/currentbalbydate",
    "summary": basepathname+"/summary",
    "accountsummarybydate": basepathname+"/summarybydate"
};

Config.pages = pages;

Config.homeFields = [
    {"name": "journalbydate", "toUrl": pages.journalbydate, "toText": "Journal By Date"},
    {"name": "currentbalbydate", "toUrl": pages.currentbalbydate, "toText": "Current Balance By Date"},
    {"name": "summary", "toUrl": pages.summary, "toText": "Account Summary By A/C Name"},
    {"name": "accountsummarybydate", "toUrl": pages.accountsummarybydate, "toText": "Account Summary By Date"},
    {"name": "trialbalance", "toUrl": pages.trialbalance, "toText": "Trial Balance"},
    {"name": "journal", "toUrl": pages.journal, "toText": "Journal"},
    {"name": "ledger", "toUrl": pages.ledger, "toText": "Ledger"},
    {"name": "currentbal", "toUrl": pages.currentbal, "toText": "Current Balance"}
];

Config.pageHeading = {
    "trialbalance": "Trial Balance",
    "journal": "Journal",
    "journalbydate": "Journal By Date",
    "ledger": "Ledger Book",
    "currentbal": "Current Balance",
    "currentbalbydate": "Current Balance By Date",
    "summary": "Account Summary",
    "accountsummarybydate": "Account Summary By Date",
    "pageNotFound": "Page Not Found"
};


Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];

Config.defaultDateSelectionType = "all";

Config.defaultCompanyName = "Loading...";
Config.defaultUserName = "";

Config.noMatchFields = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "badge badge-primary",
        "name": "date",
        "text": "Page not found"
    }
}]

/*Update from global variable */

var i, key;
var globalPageHeading = {};
var globalLinkHeading = {};

if ($S.isObject($$$.linkHeading)) {
    for(key in $$$.linkHeading) {
        if ($S.isString($$$.linkHeading[key])) {
            globalLinkHeading[key] = $$$.linkHeading[key];
        }
    }
}

if ($S.isObject($$$.pageHeading)) {
    for(key in $$$.pageHeading) {
        if ($S.isString($$$.pageHeading[key])) {
            globalPageHeading[key] = $$$.pageHeading[key];
        }
    }
}

for (key in Config.pageHeading) {
    if ($S.isString(globalPageHeading[key])) {
        Config.pageHeading[key] = globalPageHeading[key];
    }
}

for(i=0; i<Config.homeFields.length; i++) {
    if ($S.isString(globalLinkHeading[Config.homeFields[i].name])) {
        Config.homeFields[i]["toText"] = globalLinkHeading[Config.homeFields[i].name];
    }
}

export default Config;
