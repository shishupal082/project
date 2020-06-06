import $$$ from '../../interface/global';

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
    {"toUrl": pages.journalbydate, "toText": "Journal By Date"},
    {"toUrl": pages.currentbalbydate, "toText": "Current Balance By Date"},
    {"toUrl": pages.summary, "toText": "Account Summary By A/C Name"},
    {"toUrl": pages.accountsummarybydate, "toText": "Account Summary By Date"},
    {"toUrl": pages.trialbalance, "toText": "Trial Balance"},
    {"toUrl": pages.journal, "toText": "Journal"},
    {"toUrl": pages.ledger, "toText": "Ledger"},
    {"toUrl": pages.currentbal, "toText": "Current Balance"}
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

export default Config;
