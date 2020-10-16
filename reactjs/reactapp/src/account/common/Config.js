import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var Config = {};

var basepathname = $$$.basepathname;


Config.baseapi = $$$.baseapi;
Config.backIconUrl = $$$.backIconUrl;
Config.appVersion = $$$.appVersion;

var appControlApi = $$$.appControlApi;

if (!$S.isArray(appControlApi)) {
    appControlApi = [];
}

Config.appControlApi = appControlApi.map(function(el, i, arr) {
    return Config.baseapi + el + "?v=" + Config.appVersion;
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
Config.defaultPageFields = [];

for(var key in pages) {
    if (key !== "home") {
        Config.defaultPageFields.push({"name": key, "toText": $S.capitalize(key), "toUrl": pages[key]});
    }
}


Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];

Config.goBackLinkData = [
    {
        "tag": "div",
        "className": "position-absolute",
        "text": {
            "tag": "link",
            "url": pages.home,
            "text": {
                "tag": "h2",
                "text": [
                    {
                        "tag": "img",
                        "src": Config.backIconUrl,
                        "className": "back-img",
                        "alt": "back"
                    },
                    {
                        "tag": "span",
                        "text": "Back"
                    }
                ]
            }
        }
    }
];
export default Config;
