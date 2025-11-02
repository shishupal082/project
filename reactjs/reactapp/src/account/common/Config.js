import $$$ from '../../interface/global';
import CommonConfig from "../../common/app/common/CommonConfig";
import $S from "../../interface/stack.js";

var Config = {};

var basepathname = CommonConfig.basepathname;

Config.requestId = $S.getRequestId();
Config.baseApi = CommonConfig.baseApi;
Config.basepathname = CommonConfig.basepathname;
Config.appVersion = CommonConfig.appVersion;
Config.gtag = CommonConfig.gtag;
Config.roleId = CommonConfig.roleId;
Config.projectHeading = $$$.projectHeading;

Config.appControlDataPath = CommonConfig.appControlDataPath;
Config.validAppControl = CommonConfig.validAppControl;
Config.tempConfig = {
    "journal.tableName": "accountal_data",
    "enabledPages": $$$.enabledPages,
    "redirectPages": $$$.redirectPages,
    "linkText": $$$.linkText
};


var pageUrl = {
    "projectHome": basepathname+"/",
    "home": basepathname+"/:pid",
    "otherPages": basepathname+"/:pid/:pageName"
};


// var pages = {
//     "home": basepathname+"/",
//     "journal": basepathname+"/journal",
//     "journalbydate": basepathname+"/journalbydate",
//     "ledger": basepathname+"/ledger",
//     "trialbalance": basepathname+"/trialbalance",
//     "currentbal": basepathname+"/currentbal",
//     "currentbalbydate": basepathname+"/currentbalbydate",
//     "currentbalbydatev2": basepathname+"/currentbalbydatev2",
//     "summary": basepathname+"/summary",
//     "accountsummarybydate": basepathname+"/summarybydate",
//     "accountsummarybycalander": basepathname+"/summarybycalander",
//     "customisedebit": basepathname+"/customisedebit",
//     "customisecredit": basepathname+"/customisecredit",
//     "custompage": basepathname+"/custompage",
//     "profitandloss": basepathname+"/profitandloss"
// };

Config.projectHome = "projectHome";
Config.home = "home";
Config.otherPages = "otherPages";

Config.journal = "journal";
Config.journalbydate = "journalbydate";
Config.ledger = "ledger";
Config.trialbalance = "trialbalance";
Config.currentbalbydate = "currentbalbydate";
Config.currentbalbydatev2 = "currentbalbydatev2";
Config.summary = "summary";
Config.summaryv2 = "summaryv2";
Config.accountsummarybydate = "accountsummarybydate";
Config.accountsummarybycalander = "accountsummarybycalander";
Config.customisedebit = "customisedebit";
Config.customisecredit = "customisecredit";
Config.custompage = "custompage";
Config.profitandloss = "profitandloss";
Config.noMatch = "noMatch";

Config.otherPagesList = ["journal", "journalbydate", "currentbalbydate", "currentbalbydatev2",
                        "summary", "summaryv2", "accountsummarybydate", "accountsummarybycalander", "trialbalance", "ledger",
                        "profitandloss", "customisedebit", "customisecredit", "custompage"];


Config.defaultDateSelect = "monthly";
Config.dateSelectionRequired = ["journal", "journalbydate", "currentbalbydate", "currentbalbydatev2", "summary", "summaryv2", "accountsummarybydate"];
Config.pageUrl = pageUrl;

Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];

export default Config;
