import $$$ from '../../interface/global';
import CommonConfig from "../../common/app/common/CommonConfig";
import $S from "../../interface/stack.js";

var Config = {};

var basepathname = CommonConfig.basepathname;


Config.baseapi = CommonConfig.baseApi;
Config.appVersion = CommonConfig.appVersion;
Config.gtag = CommonConfig.gtag;

var appControlApi = $$$.appControlApi;

Config.appControlApi = [Config.baseapi + appControlApi]

var pages = {
    "home": basepathname+"/",
    "journal": basepathname+"/journal",
    "journalbydate": basepathname+"/journalbydate",
    "ledger": basepathname+"/ledger",
    "trialbalance": basepathname+"/trialbalance",
    "currentbal": basepathname+"/currentbal",
    "currentbalbydate": basepathname+"/currentbalbydate",
    "currentbalbydatev2": basepathname+"/currentbalbydatev2",
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
Config.currentbalbydatev2 = "currentbalbydatev2";
Config.summary = "summary";
Config.accountsummarybydate = "accountsummarybydate";
Config.accountsummarybycalander = "accountsummarybycalander";
Config.customisedebit = "customisedebit";
Config.customisecredit = "customisecredit";
Config.custompage = "custompage";
Config.profitandloss = "profitandloss";
Config.noMatch = "noMatch";

Config.dateSelectionRequired = ["journalbydate", "currentbalbydate", "currentbalbydatev2", "summary", "accountsummarybydate"];
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
            "href": pages.home,
            "text": {
                "tag": "h2",
                "text": [
                    {
                        "tag": "img",
                        "src": $$$.backIconUrl,
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
