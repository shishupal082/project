import $S from '../../interface/stack.js';
import TemplateHelper from '../../common/TemplateHelper';

import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";


import DataHandler from './DataHandler';
import TemplateHandler from './TemplateHandler';
import DataHandlerV2 from './DataHandlerV2';


var AccountHelper;

(function($S){
var DT = $S.getDT();
var Account = function(arg) {
    return new Account.fn.init(arg);
};

Account.fn = Account.prototype = {
    constructor: Account,
    init: function(arg) {
        this.arg = arg;
        return this;
    },
    toFixed: function(decimal) {
        return $S.numberToFixed(this.arg, decimal);
    }
};
$S.extendObject(Account);
Account.extend({
    getMonthTemplate: function(year) {
        var monthlyData = [];
        monthlyData.push({"key": "janValue", "dateRange": ["-01-01", "-01-31"]});
        monthlyData.push({"key": "febValue", "dateRange": ["-02-01", "-02-28"]});
        monthlyData.push({"key": "marValue", "dateRange": ["-03-01", "-03-31"]});
        monthlyData.push({"key": "aprValue", "dateRange": ["-04-01", "-04-30"]});
        monthlyData.push({"key": "mayValue", "dateRange": ["-05-01", "-05-31"]});
        monthlyData.push({"key": "junValue", "dateRange": ["-06-01", "-06-30"]});
        monthlyData.push({"key": "julValue", "dateRange": ["-07-01", "-07-31"]});
        monthlyData.push({"key": "augValue", "dateRange": ["-08-01", "-08-31"]});
        monthlyData.push({"key": "sepValue", "dateRange": ["-09-01", "-09-30"]});
        monthlyData.push({"key": "octValue", "dateRange": ["-10-01", "-10-31"]});
        monthlyData.push({"key": "novValue", "dateRange": ["-11-01", "-11-30"]});
        monthlyData.push({"key": "decValue", "dateRange": ["-12-01", "-12-31"]});
        for(var l=0; l<monthlyData.length; l++) {
            if (monthlyData[l].key === "febValue") {
                if ($S.isNumeric(year) && (year*1)%4 === 0) {
                    monthlyData[l]["dateRange"] = ["-02-01", "-02-29"];
                } else {
                    monthlyData[l]["dateRange"] = ["-02-01", "-02-28"]
                }
            }
        }
        return $S.clone(monthlyData);
    },
    getMonthTemplateV2: function(year) {
        var monthlyData = Account.getMonthTemplate(year);
        monthlyData = monthlyData.map(function(el, i, arr) {
            el["dateRange"] = [year+el["dateRange"][0]+ " 00:00", year+el["dateRange"][1]+ " 23:59"];
            return el;
        });
        return $S.clone(monthlyData);
    },
    makeTextBold: function(row, className) {
        row = $S.clone(row);
        if ($S.isObject(row)) {
            for(var key in row) {
                if ($S.isString(row[key]) || $S.isNumeric(row[key])) {
                    row[key] = {"tag": "b", "text": row[key]};
                    if ($S.isString(className)) {
                        row[key]["className"] = className;
                    }
                }
            }
        }
        return row;
    }
});
Account.extend({
    _generateLedgerBalance: function(dataByCompany) {
        var i, key, debitAmount, creditAmount, totalAmount, ledgerRowData;
        var particularEntry;
        if (!$S.isObject(dataByCompany)) {
            return dataByCompany;
        }
        for (key in dataByCompany) {
            ledgerRowData = dataByCompany[key].ledgerRowData;
            debitAmount = 0;
            creditAmount = 0;
            if ($S.isArray(ledgerRowData.dr)) {
                for (i = 0; i < ledgerRowData.dr.length; i++) {
                    if ($S.isNumeric(ledgerRowData.dr[i].dr)) {
                        debitAmount += ledgerRowData.dr[i].dr *1;
                        debitAmount = Account(debitAmount).toFixed(2);
                    }
                }
            } else {
                ledgerRowData.dr = [];
            }
            if ($S.isArray(ledgerRowData.cr)) {
                for (i = 0; i < ledgerRowData.cr.length; i++) {
                    if ($S.isNumeric(ledgerRowData.cr[i].cr)) {
                        creditAmount += ledgerRowData.cr[i].cr *1;
                        creditAmount = Account(creditAmount).toFixed(2);
                    }
                }
            } else {
                ledgerRowData.cr = [];
            }
            totalAmount = creditAmount;
            if (debitAmount > creditAmount) {
                totalAmount = debitAmount;
                particularEntry = {"cr": Account(debitAmount - creditAmount).toFixed(2)};
                particularEntry.particularText = {"tag":"b", "text":"By Balance C/D"};
                ledgerRowData.cr.push(particularEntry);
            } else if (debitAmount < creditAmount) {
                totalAmount = creditAmount;
                particularEntry = {"dr": Account(creditAmount - debitAmount).toFixed(2)};
                particularEntry.particularText = {"tag":"b", "text":"By Balance C/D"};
                ledgerRowData.dr.push(particularEntry);
            }
            particularEntry = {"dr": totalAmount};
            particularEntry.particularText = {"tag":"div.b", "className": "text-right", "text":"Total"};
            ledgerRowData.dr.push(particularEntry);

            particularEntry = {"cr": totalAmount};
            particularEntry.particularText = {"tag":"div.b", "className": "text-right", "text":"Total"};
            ledgerRowData.cr.push(particularEntry);

            if (debitAmount > creditAmount) {
                totalAmount = debitAmount;
                particularEntry = {"dr": Account(debitAmount - creditAmount).toFixed(2), name: "balanceBd"};
                particularEntry.particularText = {"tag":"b", "text":"By Balance B/D"};
                ledgerRowData.dr.push(particularEntry);
            } else if (debitAmount < creditAmount) {
                totalAmount = creditAmount;
                particularEntry = {"cr": Account(creditAmount - debitAmount).toFixed(2), name: "balanceBd"};
                particularEntry.particularText = {"tag":"b", "text":"By Balance B/D"};
                ledgerRowData.cr.push(particularEntry);
            }
        }
        return dataByCompany;
    }
});
//getDataByCompany
Account.extend({
    getDataByCompany: function(finalJournalData, accountData) {
        var i, j, k, particularEntry, accountName, entry, temp;
        var dataByCompany = {};
        if (!$S.isArray(finalJournalData) && !$S.isArray(accountData)) {
            return dataByCompany;
        }
        var accountMapping = {};
        var validAccountName = accountData.map(function(el, index, arr) {
            accountMapping[el.accountName] = el;
            return el.accountName;
        });
        finalJournalData = $S.clone(finalJournalData);
        for (i=0; i<finalJournalData.length; i++) {
            if ($S.isArray(finalJournalData[i].entry)) {
                for (j = 0; j < finalJournalData[i].entry.length; j++) {
                    entry = finalJournalData[i].entry[j];
                    if ($S.isArray(entry.particularEntry)) {
                        if (entry.particularEntry.length >= 2) {
                            temp = entry.particularEntry[0].particularText;
                            // Swap debit and credit
                            if ($S.isDefined(entry.particularEntry[0].dr) && $S.isDefined(entry.particularEntry[1].cr)) {
                                entry.particularEntry[0].particularText = entry.particularEntry[1].particularText;
                                entry.particularEntry[1].particularText = temp;
                            } else if ($S.isDefined(entry.particularEntry[1].dr) && $S.isDefined(entry.particularEntry[0].cr)) {
                                entry.particularEntry[0].particularText = entry.particularEntry[1].particularText;
                                entry.particularEntry[1].particularText = temp;
                            }
                        }
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            accountName = entry.particularEntry[k].account;
                            if (validAccountName.indexOf(accountName) < 0) {
                                // if ($S.isDefined(accountName)) {
                                //     DataHandler.addDataInArray("errorsData", "Invalid accountName: " + accountName);
                                //     console.log("Invalid accountName: " + accountName);
                                // }
                                continue;
                            }
                            if ($S.isString(accountName) && accountName.length) {
                                if ($S.isUndefined(dataByCompany[accountName])) {
                                    dataByCompany[accountName] = {
                                        accountName: accountName,
                                        accountDisplayName: Account._getAccountDisplayName(accountMapping[accountName]),
                                        ledgerRowData: {"dr": [], "cr": []},
                                        currentBalRowData: []
                                    };
                                }
                                particularEntry = $S.clone(entry.particularEntry[k]);
                                particularEntry.date = entry.date;
                                dataByCompany[accountName].currentBalRowData.push(particularEntry);
                                if ($S.isDefined(particularEntry.dr)) {
                                    dataByCompany[accountName].ledgerRowData["dr"].push(particularEntry);
                                } else if ($S.isDefined(particularEntry.cr)) {
                                    dataByCompany[accountName].ledgerRowData["cr"].push(particularEntry);
                                }
                            }
                        }
                    }
                }
            }
        }
        return dataByCompany;
    },
    getDataByCompanyV2: function(finalJournalData, accountData) {
        var i, j, accountName, entry, temp;
        var dataByCompany = {};
        if (!$S.isArray(finalJournalData) && !$S.isArray(accountData)) {
            return dataByCompany;
        }
        var accountMapping = {};
        finalJournalData = $S.clone(finalJournalData);
        for (i=0; i<finalJournalData.length; i++) {
            entry = finalJournalData[i];
            if ($S.isObject(entry)) {
                temp = [];
                temp.push(entry.cr_account);
                temp.push(entry.dr_account);
                for (j=0; j<temp.length; j++) {
                    accountName = temp[j];
                    if ($S.isStringV2(accountName)) {
                        if ($S.isUndefined(dataByCompany[accountName])) {
                            dataByCompany[accountName] = {
                                accountName: accountName,
                                accountDisplayName: Account._getAccountDisplayName(accountMapping[accountName]),
                                ledgerRowData: {"dr": [], "cr": []},
                                currentBalRowData: []
                            };
                        }
                        dataByCompany[accountName].currentBalRowData.push($S.clone(entry));
                    }
                }
            }
        }
        return dataByCompany;
    }
});

Account.extend({
    _isValidDateStr: function(dateStr) {
        //2020-05-31
        var p1 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9]/i;
        //2020-05-31 00:00
        var p2 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]/i;
        // Years more than 4 digit and less than 3 are handle at pattern searching
        // Month more than 12 and less than 1 are handle at date obj
        // Date more than 31 and less than 1 handleed at date obj
        // Hour more than 24 handle at date obj (but not 24:00)
        // Minute more than 59 handle at date obj

        // Case which are not handled
        // 1) Date from 28/29/30 to 31 in the month of feb, april, june, sep, nov
        // 2) Hour 24:00

        var dateObj;
        if ($S.isString(dateStr) && (dateStr.length === 16 || dateStr.length === 10)) {
            dateObj = DT.getDateObj(dateStr);
            if (dateObj !== null) {
                if (dateStr.search(p1) >= 0 || dateStr.search(p2) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    _getRequiredAmount: function(entry, accountName) {
        var amount = 0, i;
        if ($S.isArray(entry)) {
            for (i = 0; i < entry.length; i++) {
                if (entry[i].account === accountName) {
                    if ($S.isDefined(entry[i].dr)) {
                        amount = entry[i].dr;
                    } else if ($S.isDefined(entry[i].cr)) {
                        amount = entry[i].cr;
                    }
                    break;
                }
            }
        }
        return amount.toString();
    },
    _serachEntryByAccount: function(entry, accountName) {
        var result = {}, i;
        if ($S.isArray(entry)) {
            for (i = 0; i < entry.length; i++) {
                if (entry[i].account === accountName) {
                    result = entry[i];
                    break;
                }
            }
        }
        return result;
    },
    _getAccountDisplayName: function(accountData) {
        if ($S.isObject(accountData)) {
            if ($S.isString(accountData.accountDisplayName)) {
                return accountData.accountDisplayName + " A/C";
            }
            return $S.capitalize(accountData.accountName) + " A/C";
        }
        return "Account A/C";
    },
    correctSign: function(fieldData) {
        var signCorrection = ["dr", "cr", "currentBal", "balance"];
        return this.correctSignV2(fieldData, signCorrection);
    },
    correctSignV2: function(fieldData, keys) {
        var signCorrection = $S.isArray(keys) ? keys : [];
        var amount;
        if ($S.isObject(fieldData)) {
            for (var i=0; i<signCorrection.length; i++) {
                amount = fieldData[signCorrection[i]];
                if ($S.isNumeric(amount)) {
                    amount = amount*1;
                    if (amount < 0) {
                        amount = "("+(-1)*amount+")";
                        fieldData[signCorrection[i]] = amount;
                    }
                }
            }
        }
        return fieldData;
    },
    getFinalJournalData: function(journalData) {
        //journalData is apiJournalDataByDate
        var finalJournalData = [];
        var i, j, k, particularEntry, accountName, entry, temp, temp2;
        var debitEntry, creditEntry, tempEntry;
        if (!$S.isArray(journalData)) {
            return finalJournalData;
        }
        var journalEntry = {};;
        for (i=0; i<journalData.length; i++) {
            journalEntry = {};
            journalEntry["entry"] = [];
            if ($S.isArray(journalData[i].entry)) {
                for (j = 0; j < journalData[i].entry.length; j++) {
                    entry = $S.clone(journalData[i].entry[j]);
                    temp = {"debitAccounts": [], "creditAccounts": []};
                    if ($S.isArray(entry.particularEntry)) {
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            accountName = entry.particularEntry[k].account;
                            if ($S.isString(accountName) && accountName.length) {
                                particularEntry = $S.clone(entry.particularEntry[k]);
                                if ($S.isDefined(particularEntry.dr)) {
                                    debitEntry = particularEntry;
                                    temp.debitAccounts.push(accountName);
                                } else if ($S.isDefined(particularEntry.cr)) {
                                    creditEntry = particularEntry;
                                    temp.creditAccounts.push(accountName);
                                }
                            }
                        }
                        if (temp.debitAccounts.length < 2 && temp.creditAccounts.length < 2) {
                            journalEntry["entry"].push(entry);
                            continue;
                        }
                        if (temp.debitAccounts.length === 0 || temp.creditAccounts.length === 0) {
                            journalEntry["entry"].push(entry);
                            continue;
                        }
                        if (temp.debitAccounts.length > 1 && temp.creditAccounts.length > 1) {
                            DataHandler.addDataInArray("errorsData", "Invalid journal entry: (multiple debit and credit row): "+ JSON.stringify(entry));
                            console.log("Invalid journal entry: (multiple debit and credit row)");
                            console.log(entry);
                            continue;
                        }
                        // i.e. single debit entry and multiple credit entry
                        if (temp.debitAccounts.length < temp.creditAccounts.length) {
                            for (k = 0; k < entry.particularEntry.length; k++) {
                                tempEntry = {date: entry.date, particularEntry: []};
                                if ($S.isDefined(entry.particularEntry[k].cr)) {
                                    tempEntry.particularEntry.push($S.clone(entry.particularEntry[k]));
                                    temp2 = $S.clone(debitEntry);
                                    temp2.dr = entry.particularEntry[k].cr;
                                    tempEntry.particularEntry.push(temp2);
                                    journalEntry["entry"].push(tempEntry);
                                }
                            }
                        } else if (temp.debitAccounts.length > temp.creditAccounts.length) {
                            for (k = 0; k < entry.particularEntry.length; k++) {
                                tempEntry = {date: entry.date, particularEntry: []};
                                if ($S.isDefined(entry.particularEntry[k].dr)) {
                                    tempEntry.particularEntry.push($S.clone(entry.particularEntry[k]));
                                    temp2 = $S.clone(creditEntry);
                                    temp2.cr = entry.particularEntry[k].dr;
                                    tempEntry.particularEntry.push(temp2);
                                    journalEntry["entry"].push(tempEntry);
                                }
                            }
                        }
                    }
                }
            }
            finalJournalData.push(journalEntry);
        }
        return finalJournalData;
    },
    getFinalJournalDataV2: function(journalData) {
        //journalData is apiJournalDataByDate
        var finalJournalData = [];
        var i, j, k, particularEntry, accountName, entry, temp, temp2;
        var debitEntry, creditEntry, tempEntry;
        if (!$S.isArray(journalData)) {
            return finalJournalData;
        }
        var journalEntry = {};;
        for (i=0; i<journalData.length; i++) {
            journalEntry = {};
            journalEntry["entry"] = [];
            if ($S.isArray(journalData[i].entry)) {
                for (j = 0; j < journalData[i].entry.length; j++) {
                    entry = $S.clone(journalData[i].entry[j]);
                    temp = {"debitAccounts": [], "creditAccounts": []};
                    if ($S.isArray(entry.particularEntry)) {
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            accountName = entry.particularEntry[k].account;
                            if ($S.isString(accountName) && accountName.length) {
                                particularEntry = $S.clone(entry.particularEntry[k]);
                                if ($S.isDefined(particularEntry.dr)) {
                                    debitEntry = particularEntry;
                                    temp.debitAccounts.push(accountName);
                                } else if ($S.isDefined(particularEntry.cr)) {
                                    creditEntry = particularEntry;
                                    temp.creditAccounts.push(accountName);
                                }
                            }
                        }
                        if (temp.debitAccounts.length < 2 && temp.creditAccounts.length < 2) {
                            journalEntry["entry"].push(entry);
                            continue;
                        }
                        if (temp.debitAccounts.length === 0 || temp.creditAccounts.length === 0) {
                            journalEntry["entry"].push(entry);
                            continue;
                        }
                        if (temp.debitAccounts.length > 1 && temp.creditAccounts.length > 1) {
                            DataHandler.addDataInArray("errorsData", "Invalid journal entry: (multiple debit and credit row): "+ JSON.stringify(entry));
                            console.log("Invalid journal entry: (multiple debit and credit row)");
                            console.log(entry);
                            continue;
                        }
                        // i.e. single debit entry and multiple credit entry
                        if (temp.debitAccounts.length < temp.creditAccounts.length) {
                            for (k = 0; k < entry.particularEntry.length; k++) {
                                tempEntry = {date: entry.date, particularEntry: []};
                                if ($S.isDefined(entry.particularEntry[k].cr)) {
                                    tempEntry.particularEntry.push($S.clone(entry.particularEntry[k]));
                                    temp2 = $S.clone(debitEntry);
                                    temp2.dr = entry.particularEntry[k].cr;
                                    tempEntry.particularEntry.push(temp2);
                                    journalEntry["entry"].push(tempEntry);
                                }
                            }
                        } else if (temp.debitAccounts.length > temp.creditAccounts.length) {
                            for (k = 0; k < entry.particularEntry.length; k++) {
                                tempEntry = {date: entry.date, particularEntry: []};
                                if ($S.isDefined(entry.particularEntry[k].dr)) {
                                    tempEntry.particularEntry.push($S.clone(entry.particularEntry[k]));
                                    temp2 = $S.clone(creditEntry);
                                    temp2.cr = entry.particularEntry[k].dr;
                                    tempEntry.particularEntry.push(temp2);
                                    journalEntry["entry"].push(tempEntry);
                                }
                            }
                        }
                    }
                }
            }
            finalJournalData.push(journalEntry);
        }
        return finalJournalData;
    }
});
Account.extend({
    _getAccountSummaryByDateData: function(accountData, dateSelection, dataByCompany) {
        var fieldData = [];
        // var r = {
        //             "dateHeading": "2020-06-04",
        //             "accountSummaryByDateRow": [
        //                 {"accountDisplayName": "123", "dr": "12", "cr": "12", "currentBal": "LL"}
        //             ]
        //         };
        var i, j, k, template1Data, template2Data, dr, cr;
        var companyData, startDate, endDate, currentDate;
        var totalDr = 0, totalCr = 0;
        for (i = 0; i < dateSelection.length; i++) {
            totalDr = 0;
            totalCr = 0;
            if ($S.isArray(dateSelection[i]["dateRange"]) && dateSelection[i]["dateRange"].length >= 2) {
                startDate = dateSelection[i]["dateRange"][0];
                endDate = dateSelection[i]["dateRange"][1];
            } else {
                continue;
            }
            if (Account._isValidDateStr(startDate) && Account._isValidDateStr(endDate)) {
                startDate = DT.getDateObj(startDate);
                endDate = DT.getDateObj(endDate);
            } else {
                continue;
            }
            template1Data = {"dateHeading": dateSelection[i].dateHeading};
            template1Data["accountSummaryByDateRow"] = [];
            for (j=0; j<accountData.length; j++) {
                template2Data = {};
                if ($S.isDefined(dataByCompany[accountData[j]["accountName"]])) {
                    companyData = dataByCompany[accountData[j]["accountName"]];
                    dr = 0;
                    cr = 0;
                    template2Data["accountDisplayName"] = Account._getAccountDisplayName(accountData[j]);
                    if ($S.isObject(companyData["ledgerRowData"])) {
                        if ($S.isArray(companyData["ledgerRowData"]["dr"])) {
                            for (k=0; k<companyData["ledgerRowData"]["dr"].length; k++) {
                                if ($S.isNumeric(companyData["ledgerRowData"]["dr"][k]["dr"])) {
                                    currentDate = companyData["ledgerRowData"]["dr"][k]["date"];
                                    if (Account._isValidDateStr(currentDate)) {
                                        currentDate = DT.getDateObj(currentDate);
                                        if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
                                            dr += companyData["ledgerRowData"]["dr"][k]["dr"]*1;
                                            dr = Account(dr).toFixed(2);
                                        }
                                    }
                                }
                            }
                        }
                        if ($S.isArray(companyData["ledgerRowData"]["cr"])) {
                            for (k=0; k<companyData["ledgerRowData"]["cr"].length; k++) {
                                if ($S.isNumeric(companyData["ledgerRowData"]["cr"][k]["cr"])) {
                                    currentDate = companyData["ledgerRowData"]["cr"][k]["date"];
                                    if (Account._isValidDateStr(currentDate)) {
                                        currentDate = DT.getDateObj(currentDate);
                                        if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
                                            cr += companyData["ledgerRowData"]["cr"][k]["cr"]*1;
                                            cr = Account(cr).toFixed(2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (dr !== 0 || cr !== 0) {
                        template2Data["dr"] = dr;
                        template2Data["cr"] = cr;
                        template2Data["currentBal"] = Account(dr-cr).toFixed(2);
                        template1Data["accountSummaryByDateRow"].push(template2Data);
                        totalDr = Account(totalDr+dr).toFixed(2);
                        totalCr = Account(totalCr+cr).toFixed(2);
                    }
                }
            }
            template2Data = {"accountDisplayName": {"tag":"div.b", "className": "text-right text-danger", "text":"Total"}};
            template2Data["dr"] = {"tag":"div.b", "className": "text-danger2", "text": totalDr};
            template2Data["cr"] = {"tag":"div.b", "className": "text-danger2", "text": totalCr};
            template1Data["accountSummaryByDateRow"].push(template2Data);
            fieldData.push(template1Data);
        }
        return fieldData;
    }
});
//getLedgerBookFields
Account.extend({
    getLedgerBookFields: function(dataByCompany, accountData) {
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        if (!$S.isArray(accountData)) {
            accountData = [];
        }
        var ledgerData = [];
        if (!$S.isArray(accountData) || !$S.isObject(dataByCompany)) {
            return ledgerData;
        }
        Account._generateLedgerBalance(dataByCompany);
        var ledgerRowTemplate = {};
        var i, j, minLength, maxLength, temp, companyData, ledgerRowFields;
        for (i=0; i<accountData.length; i++) {
            if (dataByCompany[accountData[i].accountName]) {
                companyData = dataByCompany[accountData[i].accountName];
                ledgerRowFields = {accountDisplayName: "", fields: []};
                ledgerRowFields.accountDisplayName = Account._getAccountDisplayName(accountData[i]);
                ledgerRowFields.fields.push(TemplateHandler.getTemplate("ledgerHeading"));
                if ($S.isArray(companyData.ledgerRowData.dr) && $S.isArray(companyData.ledgerRowData.cr)) {
                    maxLength = companyData.ledgerRowData.dr.length;
                    minLength = companyData.ledgerRowData.cr.length;
                    if (maxLength < companyData.ledgerRowData.cr.length) {
                        maxLength = companyData.ledgerRowData.cr.length;
                        minLength = companyData.ledgerRowData.dr.length
                    }
                    temp = {};
                    for (j=0; j<minLength; j++) {
                        temp.debitDate = companyData.ledgerRowData.dr[j].date;
                        temp.debitAmount = companyData.ledgerRowData.dr[j].dr;
                        temp.debitParticular = companyData.ledgerRowData.dr[j].particularText;
                        if (companyData.ledgerRowData.dr[j].ledgerText) {
                            temp.debitParticularLadger = companyData.ledgerRowData.dr[j].ledgerText;
                        }
                        temp.creditDate = companyData.ledgerRowData.cr[j].date;
                        temp.creditAmount = companyData.ledgerRowData.cr[j].cr;
                        temp.creditParticular = companyData.ledgerRowData.cr[j].particularText;
                        if (companyData.ledgerRowData.cr[j].ledgerText) {
                            temp.creditParticularLadger = companyData.ledgerRowData.cr[j].ledgerText;
                        }
                        ledgerRowTemplate = TemplateHandler.getTemplate("ledgerRow");
                        TemplateHelper.updateTemplateText(ledgerRowTemplate, temp);
                        ledgerRowFields.fields.push(ledgerRowTemplate);
                    }
                    temp = {};
                    for (j=minLength; j<maxLength; j++) {
                        if (companyData.ledgerRowData.cr.length > minLength) {
                            temp.creditDate = companyData.ledgerRowData.cr[j].date;
                            temp.creditAmount = companyData.ledgerRowData.cr[j].cr;
                            temp.creditParticular = companyData.ledgerRowData.cr[j].particularText;
                            if (companyData.ledgerRowData.cr[j].ledgerText) {
                                temp.creditParticularLadger = companyData.ledgerRowData.cr[j].ledgerText;
                            }
                        } else {
                            temp.debitDate = companyData.ledgerRowData.dr[j].date;
                            temp.debitAmount = companyData.ledgerRowData.dr[j].dr;
                            temp.debitParticular = companyData.ledgerRowData.dr[j].particularText;
                            if (companyData.ledgerRowData.dr[j].ledgerText) {
                                temp.debitParticularLadger = companyData.ledgerRowData.dr[j].ledgerText;
                            }
                        }
                        ledgerRowTemplate = TemplateHandler.getTemplate("ledgerRow");
                        TemplateHelper.updateTemplateText(ledgerRowTemplate, temp);
                        ledgerRowFields.fields.push(ledgerRowTemplate);
                    }
                }
                ledgerData.push(ledgerRowFields);
            }
        }
        var ledgerFields = [];
        for(i=0; i<ledgerData.length; i++) {
            ledgerRowTemplate = TemplateHandler.getTemplate("ledger");
            TemplateHelper.updateTemplateText(ledgerRowTemplate, ledgerData[i]);
            TemplateHelper.addItemInTextArray(ledgerRowTemplate, "ledgerFields", ledgerData[i]["fields"]);
            ledgerFields.push(ledgerRowTemplate);
        }
        return ledgerFields;
    }
});
//getTrialBalanceFields
Account.extend({
    getTrialBalanceFields: function(dataByCompany, accountData) {
        // var dataByCompany = DataHandler.getData("dataByCompany", {});
        // var accountData = DataHandler.getData("accounts", []);
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        if (!$S.isArray(accountData)) {
            accountData = [];
        }
        var trialBalanceFields = [];
        if (!$S.isObject(dataByCompany) || !$S.isArray(accountData)) {
            return trialBalanceFields;
        }
        Account._generateLedgerBalance(dataByCompany);
        var key, temp, template, count = 1, balanceBdField;
        var totalDebit = 0, totalCredit = 0, i;
        var accountDisplayName;
        trialBalanceFields.push(TemplateHandler.getTemplate("trialBalance1stRow"));
        for (i = 0; i < accountData.length; i++) {
            key = accountData[i].accountName;
            accountDisplayName = Account._getAccountDisplayName(accountData[i]);
            if ($S.isUndefined(dataByCompany[key])) {
                continue;
            }
            temp = {};
            temp["s.no"] = count++;
            balanceBdField = TemplateHelper(dataByCompany[key]).searchFieldV2("balanceBd");
            if (balanceBdField.name === "balanceBd") {
                temp.particular = accountDisplayName;
                temp.debitBalance = balanceBdField.dr;
                temp.creditBalance = balanceBdField.cr;
                if ($S.isNumeric(temp.debitBalance)) {
                    totalDebit = Account(totalDebit*1+temp.debitBalance*1).toFixed(2);
                }
                if ($S.isNumeric(temp.creditBalance)) {
                    totalCredit = Account(totalCredit*1+temp.creditBalance*1).toFixed(2);
                }
            } else {
                temp.particular = accountDisplayName;
                count--;
                continue;
            }
            template = TemplateHandler.getTemplate("trialBalanceRow");
            TemplateHelper.updateTemplateText(template, temp);
            trialBalanceFields.push(template);
        }
        temp = {};
        template = TemplateHandler.getTemplate("trialBalanceRow");
        temp.particular = {"tag":"div.b", "className": "text-right", "text":"Total"};
        temp.debitBalance = totalDebit;
        temp.creditBalance = totalCredit;
        if (totalDebit !== totalCredit) {
            DataHandler.addDataInArray("errorsData", "Trial balance mismatch: "+totalDebit +" !== "+ totalCredit);
        }
        TemplateHelper.updateTemplateText(template, temp);
        trialBalanceFields.push(template);
        template = TemplateHandler.getTemplate("trialBalance");
        temp = {"trialBalanceRows": trialBalanceFields};
        TemplateHelper.updateTemplateText(template, temp);
        return template;
    }
});
//partial
Account.extend({
    generateCurrentBalanaceTrs: function(currentBalRowData) {
        var trs = [];
        if (!$S.isArray(currentBalRowData)) {
            return trs;
        }
        var i, j, count = 1, prev = {}, current = {}, isTotalRow = false;
        var num, signCorrection = ["dr", "cr", "currentBal", "balance"], attr;
        var template, templateData;
        template = TemplateHandler.getTemplate("currentBal1stRowByDate", null);
        trs.push(template);
        for (j=0; j<signCorrection.length; j++) {
            prev[signCorrection[j]] = null;
            current[signCorrection[j]] = null;
        }
        for (i = 0; i < currentBalRowData.length; i++) {
            template = TemplateHandler.getTemplate("currentBalRowByDate", null);
            templateData = currentBalRowData[i];
            if ($S.isObject(templateData)) {
                templateData["s.no"] = count++;
            }
            if (templateData.name === "totalRow") {
                isTotalRow = true;
            }
            for (j=0; j<signCorrection.length; j++) {
                attr = signCorrection[j];
                if ($S.isNumeric(templateData[attr])) {
                    num = templateData[attr]*1;
                    if (num < 0) {
                        if (prev[attr] === null) {
                            prev[attr] = "neg";
                        } else {
                            prev[attr] = current[attr];
                        }
                        current[attr] = "neg";
                        num = "("+(-1*num)+")";
                    } else {
                        if (prev[attr] === null) {
                            prev[attr] = "pos";
                        } else {
                            prev[attr] = current[attr];
                        }
                        current[attr] = "pos";
                    }
                    if (prev[attr] !== current[attr] || isTotalRow) {
                        templateData[attr] = {"tag":"b", "className": "text-danger", "text": num};
                    } else {
                        templateData[attr] = num;
                    }
                }
            }
            TemplateHelper.updateTemplateText(template, templateData);
            trs.push(template);
        }
        return trs;
    }
});
//_getCurrentBalanceDataByDate
Account.extend({
    _getCurrentBalanceDataByDate: function(dataByCompany, accountData, dateSelection) {
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        var currentBalanceFieldsData = [];
        var i, j, k, accountName, accountDisplayName;
        var templateData, template2Data;

        var startDate, endDate, currentDate, currentBalRowData = [];
        if(!$S.isArray(accountData) || !$S.isArray(dateSelection)) {
            return currentBalanceFieldsData;
        }
        for (i = 0; i < accountData.length; i++) {
            accountName = accountData[i].accountName;
            accountDisplayName = AccountHelper._getAccountDisplayName(accountData[i]);
            if ($S.isUndefined(dataByCompany[accountName])) {
                continue;
            }
            templateData = {"accountName": accountName, "accountDisplayName": accountDisplayName, "currentBalByDateRow": []};
            for (j = 0; j < dateSelection.length; j++) {
                if ($S.isArray(dateSelection[j].dateRange) && dateSelection[j].dateRange.length >= 2) {
                    startDate = DT.getDateObj(dateSelection[j].dateRange[0]);
                    endDate = DT.getDateObj(dateSelection[j].dateRange[1]);
                    if (startDate === null || endDate === null) {
                        console.log("Invalid date range: " + JSON.stringify(dateSelection[j].dateRange));
                        continue;
                    }
                }
                if ($S.isString(dateSelection[j].dateHeading)) {
                    template2Data = {"dateHeading": dateSelection[j].dateHeading, "currentBalRowData": []};
                    if ($S.isArray(dataByCompany[accountName].currentBalRowData)) {
                        currentBalRowData = [];
                        for (k=0; k<dataByCompany[accountName].currentBalRowData.length; k++) {
                            currentDate = dataByCompany[accountName].currentBalRowData[k].date;
                            currentDate = DT.getDateObj(currentDate);
                            if (currentDate === null) {
                                continue;
                            }
                            if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
                                currentBalRowData.push(dataByCompany[accountName].currentBalRowData[k]);
                            } else {
                                continue;
                            }
                        }
                        if (currentBalRowData.length < 1) {
                            continue;
                        }
                        template2Data.currentBalRowData = template2Data.currentBalRowData.concat(currentBalRowData);
                        templateData.currentBalByDateRow.push(template2Data);
                    }
                }
            }
            currentBalanceFieldsData.push(templateData);
        }
        //Adding currentBal and balance
        var lastAmount, debitAmount, creditAmount, currentBalAmount, temp;
        lastAmount = 0;
        debitAmount = 0;
        creditAmount = 0;
        currentBalAmount = 0;
        var currentBalByDateRow = [];
        for (i = 0; i < currentBalanceFieldsData.length; i++) {
            currentBalByDateRow = currentBalanceFieldsData[i].currentBalByDateRow;
            lastAmount = 0;
            if ($S.isArray(currentBalByDateRow)) {
                for (j = 0; j < currentBalByDateRow.length; j++) {
                    currentBalRowData = currentBalByDateRow[j].currentBalRowData;
                    if ($S.isArray(currentBalRowData)) {
                        currentBalAmount = 0;
                        debitAmount = 0;
                        creditAmount = 0;
                        for(k=0; k<currentBalRowData.length; k++) {
                            if ($S.isNumeric(currentBalRowData[k].dr)) {
                                currentBalAmount += currentBalRowData[k].dr*1;
                                debitAmount += currentBalRowData[k].dr*1;
                                debitAmount = Account(debitAmount).toFixed(2);
                            } else if ($S.isNumeric(currentBalRowData[k].cr)) {
                                currentBalAmount -= currentBalRowData[k].cr*1;
                                creditAmount += currentBalRowData[k].cr*1;
                                creditAmount = Account(creditAmount).toFixed(2);
                            }
                            currentBalAmount = Account(currentBalAmount).toFixed(2);
                            currentBalRowData[k]["currentBal"] = currentBalAmount;
                            currentBalRowData[k]["balance"] = Account(lastAmount + currentBalAmount).toFixed(2);
                        }
                        temp = {"name": "totalRow", "particularText": {"tag":"div.b", "className": "text-right", "text":"Total"}};
                        temp.dr = debitAmount;
                        temp.cr = creditAmount;
                        temp.currentBal = currentBalAmount;
                        temp.balance = Account(lastAmount + currentBalAmount).toFixed(2);
                        currentBalRowData.push(temp);
                        lastAmount += currentBalAmount;
                        lastAmount = Account(lastAmount).toFixed(2);
                    }
                }
            }
        }
        return currentBalanceFieldsData;
    },
    _getCurrentBalanceDataByDateV2: function(dataByCompany, accountData, dateSelection) {
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        var currentBalanceFieldsData = [];
        var i, j, k, accountName, accountDisplayName;
        var templateData, template2Data;

        var startDate, endDate, currentDate, currentBalRowData = [];
        if(!$S.isArray(accountData) || !$S.isArray(dateSelection)) {
            return currentBalanceFieldsData;
        }
        for (i = 0; i < accountData.length; i++) {
            accountName = accountData[i].accountName;
            accountDisplayName = AccountHelper._getAccountDisplayName(accountData[i]);
            if ($S.isUndefined(dataByCompany[accountName])) {
                continue;
            }
            templateData = {"accountName": accountName, "accountDisplayName": accountDisplayName, "currentBalByDateRow": []};
            for (j = 0; j < dateSelection.length; j++) {
                if ($S.isArray(dateSelection[j].dateRange) && dateSelection[j].dateRange.length >= 2) {
                    startDate = DT.getDateObj(dateSelection[j].dateRange[0]);
                    endDate = DT.getDateObj(dateSelection[j].dateRange[1]);
                    if (startDate === null || endDate === null) {
                        console.log("Invalid date range: " + JSON.stringify(dateSelection[j].dateRange));
                        continue;
                    }
                }
                if ($S.isString(dateSelection[j].dateHeading)) {
                    template2Data = {"dateHeading": dateSelection[j].dateHeading, "currentBalRowData": []};
                    if ($S.isArray(dataByCompany[accountName].currentBalRowData)) {
                        currentBalRowData = [];
                        for (k=0; k<dataByCompany[accountName].currentBalRowData.length; k++) {
                            currentDate = dataByCompany[accountName].currentBalRowData[k].uiEntryTime;
                            currentDate = DT.getDateObj(currentDate);
                            if (currentDate === null) {
                                continue;
                            }
                            if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
                                currentBalRowData.push(dataByCompany[accountName].currentBalRowData[k]);
                            } else {
                                continue;
                            }
                        }
                        if (currentBalRowData.length < 1) {
                            continue;
                        }
                        template2Data.currentBalRowData = template2Data.currentBalRowData.concat(currentBalRowData);
                        templateData.currentBalByDateRow.push(template2Data);
                    }
                }
            }
            currentBalanceFieldsData.push(templateData);
        }
        //Adding currentBal and balance
        var lastAmount, debitAmount, creditAmount, currentBalAmount, temp;
        lastAmount = 0;
        debitAmount = 0;
        creditAmount = 0;
        currentBalAmount = 0;
        var currentBalByDateRow = [];
        for (i = 0; i < currentBalanceFieldsData.length; i++) {
            accountName = currentBalanceFieldsData[i].accountName;
            currentBalByDateRow = currentBalanceFieldsData[i].currentBalByDateRow;
            lastAmount = 0;
            if ($S.isArray(currentBalByDateRow)) {
                for (j = 0; j < currentBalByDateRow.length; j++) {
                    currentBalRowData = currentBalByDateRow[j].currentBalRowData;
                    if ($S.isArray(currentBalRowData)) {
                        currentBalAmount = 0;
                        debitAmount = 0;
                        creditAmount = 0;
                        for(k=0; k<currentBalRowData.length; k++) {
                            if (currentBalRowData[k]["dr_account"] === accountName) {
                                currentBalAmount += currentBalRowData[k].value*1;
                                debitAmount += currentBalRowData[k].value*1;
                                debitAmount = Account(debitAmount).toFixed(2);
                            } else if (currentBalRowData[k]["cr_account"] === accountName) {
                                currentBalAmount -= currentBalRowData[k].value*1;
                                creditAmount += currentBalRowData[k].value*1;
                                creditAmount = Account(creditAmount).toFixed(2);
                            }
                            currentBalAmount = Account(currentBalAmount).toFixed(2);
                            currentBalRowData[k]["currentBal"] = currentBalAmount;
                            currentBalRowData[k]["balance"] = Account(lastAmount + currentBalAmount).toFixed(2);
                        }
                        temp = {"name": "totalRow", "particularText": {"tag":"div.b", "className": "text-right", "text":"Total"}};
                        temp.dr = debitAmount;
                        temp.cr = creditAmount;
                        temp.currentBal = currentBalAmount;
                        temp.balance = Account(lastAmount + currentBalAmount).toFixed(2);
                        currentBalRowData.push(temp);
                        lastAmount += currentBalAmount;
                        lastAmount = Account(lastAmount).toFixed(2);
                    }
                }
            }
        }
        return currentBalanceFieldsData;
    }
});
//getCurrentBalByDateRowData
Account.extend({
    getCurrentBalByDateRowData: function(dataByCompany, accountData) {
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        if (!$S.isArray(accountData)) {
            accountData = [];
        }
        var dateSelection = DataHandler.getData("dateSelectionParameter", []);
        var currentBalanceFields = [], currentBalanceFieldsData = [];
        var i, j;
        // var debitAmount, creditAmount, currentAmount = 0;
        var template, templateData, template2, template2Data;
        currentBalanceFieldsData = AccountHelper._getCurrentBalanceDataByDate(dataByCompany, accountData, dateSelection);
        // Generating template data
        for (i = 0; i < currentBalanceFieldsData.length; i++) {
            template = TemplateHandler.getTemplate("currentBalByDate", null);
            templateData = {};
            templateData["accountDisplayName"] = currentBalanceFieldsData[i].accountDisplayName;
            templateData["currentBalByDateRow"] = [];
            for(j=currentBalanceFieldsData[i].currentBalByDateRow.length-1; j>=0; j--) {
                template2 = TemplateHandler.getTemplate("currentBalByDateRow", null);
                template2Data = {"dateHeading": "("+templateData["accountDisplayName"] + ") " + currentBalanceFieldsData[i].currentBalByDateRow[j].dateHeading};
                template2Data["currentBalRow"] = Account.generateCurrentBalanaceTrs(currentBalanceFieldsData[i].currentBalByDateRow[j].currentBalRowData);
                TemplateHelper.updateTemplateText(template2, template2Data);
                templateData["currentBalByDateRow"].push(template2);
            }
            TemplateHelper.updateTemplateText(template, templateData);
            currentBalanceFields.push(template);
        }
        return currentBalanceFields;
    }
});
//getCurrentBalByDateRowDataV2
Account.extend({
    getCurrentBalByDateRowDataV2: function(dataByCompany, accountData) {
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        if (!$S.isArray(accountData)) {
            accountData = [];
        }
        var dateSelection = DataHandler.getData("dateSelectionParameter", []);
        var currentBalanceFields = [], currentBalanceFieldsData = [];
        var i, j, k;
        // var debitAmount, creditAmount, currentAmount = 0;
        var template, templateData, template2, template2Data;
        currentBalanceFieldsData = AccountHelper._getCurrentBalanceDataByDate(dataByCompany, accountData, dateSelection);
        var currentBalanceFieldsDataV2 = [];
        var t1, t2;
        // Interchange dateHeading with accountDisplayName
        for (i = dateSelection.length-1; i >=0 ; i--) {
            t1 = {"accountDisplayName": dateSelection[i].dateHeading, "currentBalByDateRow": []};
            for (j=0; j<currentBalanceFieldsData.length; j++) {
                t2 = null;
                for (k=0; k<currentBalanceFieldsData[j]["currentBalByDateRow"].length; k++) {
                    if (dateSelection[i].dateHeading === currentBalanceFieldsData[j]["currentBalByDateRow"][k].dateHeading) {
                        t2 = {"accountName": currentBalanceFieldsData[j]["accountName"], "dateHeading": currentBalanceFieldsData[j]["accountDisplayName"], "currentBalRowData": currentBalanceFieldsData[j]["currentBalByDateRow"][k]["currentBalRowData"]};
                        break;
                    }
                }
                if ($S.isObject(t2)) {
                    t1["currentBalByDateRow"].push(t2);
                }
            }
            if (t1["currentBalByDateRow"].length > 0) {
                currentBalanceFieldsDataV2.push(t1);
            }
        }
        // Generating template data
        for (i = 0; i < currentBalanceFieldsDataV2.length; i++) {
            template = TemplateHandler.getTemplate("currentBalByDate", null);
            templateData = {};
            templateData["accountDisplayName"] = currentBalanceFieldsDataV2[i].accountDisplayName;
            templateData["currentBalByDateRow"] = [];
            for(j=0; j<currentBalanceFieldsDataV2[i].currentBalByDateRow.length; j++) {
                template2 = TemplateHandler.getTemplate("currentBalByDateRow", null);
                template2Data = {"dateHeading": "("+templateData["accountDisplayName"] + ") " + currentBalanceFieldsDataV2[i].currentBalByDateRow[j].dateHeading};
                template2Data["currentBalRow"] = Account.generateCurrentBalanaceTrs(currentBalanceFieldsDataV2[i].currentBalByDateRow[j].currentBalRowData);
                TemplateHelper.updateTemplateText(template2, template2Data);
                templateData["currentBalByDateRow"].push(template2);
            }
            TemplateHelper.updateTemplateText(template, templateData);
            currentBalanceFields.push(template);
        }
        return currentBalanceFields;
    }
});
//getAccountSummaryFields
Account.extend({
    getAccountSummaryFields: function(dataByCompany, accountData, dateSelection) {
        var currentBalanceFields = [], currentBalanceFieldsData = [];
        var i, j, count = 1, totalRow;
        var template, templateData, template2, template2Data, currentBalByDateRow = [];
        currentBalanceFieldsData = AccountHelper._getCurrentBalanceDataByDate(dataByCompany, accountData, dateSelection);
        // Generating template data
        for (i = 0; i < currentBalanceFieldsData.length; i++) {
            template = TemplateHandler.getTemplate("accountSummary", null);
            templateData = {};
            templateData["accountDisplayName"] = currentBalanceFieldsData[i].accountDisplayName;
            templateData["accountSummaryRow"] = [];

            currentBalByDateRow = currentBalanceFieldsData[i].currentBalByDateRow;
            if ($S.isArray(currentBalByDateRow) && currentBalByDateRow.length) {
                template2 = TemplateHandler.getTemplate("accountSummary1stRow", null);
                templateData["accountSummaryRow"].push(template2);
                count = 1;
                for (j=currentBalByDateRow.length-1; j>=0; j--) {
                    template2 = TemplateHandler.getTemplate("accountSummaryRow", null);
                    template2Data = {};
                    totalRow = TemplateHelper(currentBalByDateRow[j]).searchFieldV2("totalRow");
                    template2Data = $S.clone(totalRow);
                    template2Data.dateHeading = currentBalByDateRow[j].dateHeading;
                    template2Data["s.no"] = count++;
                    if (template2Data.name === "totalRow") {
                        AccountHelper.correctSign(template2Data);
                        TemplateHelper.updateTemplateText(template2, template2Data);
                        templateData["accountSummaryRow"].push(template2);
                    }
                }
            }
            TemplateHelper.updateTemplateText(template, templateData);
            currentBalanceFields.push(template);
        }
        return currentBalanceFields;
    }
});
//getAccountSummaryFieldsV2
Account.extend({
    getAccountSummaryFieldsV2: function(dataByCompany, accountData, dateSelection, renderField) {
        if (!$S.isArray(renderField)) {
            renderField = [];
        }
        if ($S.isArray(dataByCompany)) {
            for(var i=0; i<dataByCompany.length; i++) {
                if ($S.isObject(dataByCompany[i])) {
                    renderField.push(dataByCompany[i]);
                }
                if ($S.isArray(dataByCompany[i].text) && dataByCompany[i].text.length > 0 && $S.isArray(dataByCompany[i].text[0])) {
                    renderField.push(dataByCompany[i].text);
                } else {
                    this.getAccountSummaryFieldsV2(dataByCompany[i].text, accountData, dateSelection, renderField);
                }
            }
        }
        return renderField;
    },
    _generateTableSummary: function(tableData, accountData, dateSelection) {
        var tableField = [], i, j;
        var tableDataV2 = [], temp, totalRow;
        for (i=0; i<tableData.length; i++) {
            temp = {};
            for (j=0; j<tableData[i].length; j++) {
                temp[tableData[i][j]["name"]] = tableData[i][j]["value"];
            }
            tableDataV2.push(temp);
        }
        var currentList3Data = DataHandler.getCurrentList3Data();
        if ($S.isObject(currentList3Data) && $S.isArray(currentList3Data.value)) {
            currentList3Data.value.push({"key": "accountName"});
        } else {
            currentList3Data = {"value": [{"key": "accountName"}]};
        }
        var dataByCompany = this.getDataByCompanyV2(tableDataV2, accountData);
        var dataByCompanyV2 = AccountHelper._getCurrentBalanceDataByDateV2(dataByCompany, accountData, dateSelection);
        var dataByCompanyV3 = DataHandlerV2.applyAccountNameFilter(dataByCompanyV2);
        var accountSummary, accountSummaryRow, accountSummaryData;
        if ($S.isArray(dataByCompanyV3)) {
            for (i=0; i<dataByCompanyV3.length; i++) {
                tableField.push(DBViewTemplateHandler.generateHeading(dataByCompanyV3[i].accountDisplayName, "accountName", currentList3Data, false));
                accountSummary = TemplateHandler.getTemplate("accountSummary", []);
                TemplateHelper.addItemInTextArray(accountSummary, "accountSummaryRow", TemplateHandler.getTemplate("accountSummary1stRow", []));
                if ($S.isArray(dataByCompanyV3[i].currentBalByDateRow)) {
                    for (j=dataByCompanyV3[i].currentBalByDateRow.length-1; j>=0; j--) {
                        if ($S.isObject(dataByCompanyV3[i].currentBalByDateRow[j])) {
                            accountSummaryData = {"dateHeading": dataByCompanyV3[i].currentBalByDateRow[j]["dateHeading"], "s.no": j+1};
                            if ($S.isArray(dataByCompanyV3[i].currentBalByDateRow[j]["currentBalRowData"])) {
                                for (var k=0; k<dataByCompanyV3[i].currentBalByDateRow[j]["currentBalRowData"].length; k++) {
                                    totalRow = dataByCompanyV3[i].currentBalByDateRow[j]["currentBalRowData"][k];
                                    if ($S.isObject(totalRow) && totalRow["name"] === "totalRow") {
                                        accountSummaryRow = TemplateHandler.getTemplate("accountSummaryRow", []);
                                        accountSummaryData["dr"] = totalRow["dr"];
                                        accountSummaryData["cr"] = totalRow["cr"];
                                        accountSummaryData["currentBal"] = totalRow["currentBal"];
                                        accountSummaryData["balance"] = totalRow["balance"];
                                        this.correctSign(accountSummaryData);
                                        TemplateHelper.updateTemplateText(accountSummaryRow, accountSummaryData);
                                        TemplateHelper.addItemInTextArray(accountSummary, "accountSummaryRow", accountSummaryRow);
                                    }
                                }
                            }
                        }
                   }
                }
                tableField.push(accountSummary);
            }
        }
        return tableField;
    },
    getAccountSummaryFieldsV2_2: function(renderField, accountData, dateSelection) {
        var field = [];
        var currentList3Data = DataHandler.getCurrentList3Data();
        var temp;
        var keyIndex = [];
        var stackObj = {};
        if ($S.isArray(renderField)) {
            for (var i = 0; i<renderField.length; i++) {
                if ($S.isObject(renderField[i])) {
                    if ($S.isStringV2(renderField[i].key)) {
                        if (keyIndex.indexOf(renderField[i].key) < 0) {
                            keyIndex.push(renderField[i].key);
                            stackObj[renderField[i].key] = $S.getStack();
                        }
                        stackObj[renderField[i].key].reset();
                        stackObj[renderField[i].key].push(DBViewTemplateHandler.generateHeading(renderField[i].name, renderField[i].key, currentList3Data, true));
                    }
                } else if ($S.isArray(renderField[i])) {
                    temp = this._generateTableSummary(renderField[i], accountData, dateSelection);
                    if ($S.isArrayV2(temp)) {
                        for (var j=0; j<keyIndex.length; j++) {
                            field = field.concat(stackObj[keyIndex[j]].getAll());
                            stackObj[keyIndex[j]].reset();
                        }
                        field.push(temp);
                    }
                }
            }
        }
        return field;
    }
});
//getJournalFields
Account.extend({
    // getJournalFields: function(journalData) {
    //     var journalRowData = [], i, j, count = 1, templateData;
    //     var firstRowTemplate = TemplateHandler.getTemplate("journalEntry1stRow", null);;
    //     var template;
    //     var entry = [];
    //     for (i = 0; i < journalData.length; i++) {
    //         if ($S.isArray(journalData[i].entry)) {
    //             for (j = 0; j < journalData[i].entry.length; j++) {
    //                 if (i===0 && j===0 && firstRowTemplate !== null) {
    //                     journalRowData.push(firstRowTemplate);
    //                 }
    //                 entry = journalData[i].entry[j];
    //                 entry["s.no"] = count++;
    //                 template = TemplateHandler.getTemplate("journalEntry", null);
    //                 TemplateHelper.updateTemplateText(template, entry);
    //                 journalRowData.push(template);
    //             }
    //         }
    //     }
    //     template = TemplateHandler.getTemplate("journal", null);
    //     templateData = {"journalEntryTr": journalRowData};
    //     TemplateHelper.updateTemplateText(template, templateData);
    //     return template;
    // }
});
//getApiJournalDataByDate
Account.extend({
    getApiJournalDataByDate: function(apiJournalData) {
        var dataByDate = {}, apiJournalDataByDate = [];
        var i, j, k, entry;
        if (!$S.isArray(apiJournalData)) {
            return apiJournalDataByDate;
        }
        var debitAmount = 0, creditAmount = 0;
        var particularEntry;
        for (i=0; i<apiJournalData.length; i++) {
            if ($S.isArray(apiJournalData[i].entry)) {
                for (j = 0; j < apiJournalData[i].entry.length; j++) {
                    entry = apiJournalData[i].entry[j];
                    particularEntry = entry.particularEntry;
                    if ($S.isArray(particularEntry)) {
                        debitAmount = 0;
                        creditAmount = 0;
                        for (k=0; k<particularEntry.length; k++) {
                            if ($S.isNumeric(particularEntry[k].cr)) {
                                creditAmount += particularEntry[k].cr*1;
                                creditAmount = Account(creditAmount).toFixed(2);
                            }
                            if ($S.isNumeric(particularEntry[k].dr)) {
                                debitAmount += particularEntry[k].dr*1;
                                debitAmount = Account(debitAmount).toFixed(2);
                            }
                        }
                        if (debitAmount !== creditAmount && debitAmount > 0 && creditAmount > 0) {
                            DataHandler.addDataInArray("errorsData", {"code": "Total amount mismatch: " + JSON.stringify(entry)});
                            continue;
                        }
                    }
                    if (AccountHelper._isValidDateStr(entry.date)) {
                        if (!$S.isArray(dataByDate[entry.date])) {
                            dataByDate[entry.date] = [];
                        }
                    } else {
                        DataHandler.addDataInArray("errorsData", {"code": "Invalid date: " + JSON.stringify(entry)});
                        continue;
                    }
                    dataByDate[entry.date].push(entry);
                }
            }
        }
        var dateObj, node, temp;
        var BST = $S.getBST();
        for (var date in dataByDate) {
            dateObj = DT.getDateObj(date);
            if (dateObj) {
                node = BST.insertData(BST, dateObj.getTime());
                node.item = dataByDate[date];
            }
        }
        temp = BST.getInOrder(BST);
        for (i=0; i<temp.length; i++) {
            apiJournalDataByDate.push({entry: temp[i].item});
        }
        return apiJournalDataByDate;
    }
});
//getJournalDataByDateFields
Account.extend({
    // getJournalDataByDateFields: function(apiJournalDataByDate) {
    //     var journalDataByDateFields = [], template, templateData;
    //     var i, j, journalEntry;
    //     var startDate, endDate, currentDate;
    //     var journalDataByDateData = [];
    //     var dateSelection = DataHandler.getData("dateSelectionParameter", []);
    //     if (!$S.isArray(apiJournalDataByDate) || !$S.isArray(dateSelection)) {
    //         return journalDataByDateFields;
    //     }
    //     for (i = 0; i < dateSelection.length; i++) {
    //         if (!$S.isArray(dateSelection[i].dateRange) || dateSelection[i].dateRange.length < 2) {
    //             continue;
    //         }
    //         startDate = DT.getDateObj(dateSelection[i].dateRange[0]);
    //         endDate = DT.getDateObj(dateSelection[i].dateRange[1]);
    //         templateData = {"dateHeading": dateSelection[i].dateHeading, "journalEntryTable": []};
    //         if (startDate === null || endDate === null) {
    //             console.log("Invalid date range: " + JSON.stringify(dateSelection[j].dateRange));
    //             continue;
    //         }
    //         journalEntry = {"entry": []};
    //         for (j = apiJournalDataByDate.length-1; j >= 0 ; j--) {
    //             if ($S.isArray(apiJournalDataByDate[j].entry) && apiJournalDataByDate[j].entry.length) {
    //                 currentDate = DT.getDateObj(apiJournalDataByDate[j].entry[0].date);
    //                 if (currentDate === null) {
    //                     continue;
    //                 }
    //             }
    //             if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
    //                 if (apiJournalDataByDate[j].entry !== null) {
    //                     journalEntry.entry = $S.clone(journalEntry.entry.concat(apiJournalDataByDate[j].entry));
    //                     apiJournalDataByDate[j].entry = null;
    //                 } else {
    //                     continue;
    //                 }
    //             } else {
    //                 continue;
    //             }
    //         }
    //         templateData.journalEntryTable = templateData.journalEntryTable.concat(journalEntry);
    //         journalDataByDateData.push(templateData);
    //     }
    //     for(i=journalDataByDateData.length-1; i>=0; i--) {
    //         template = TemplateHandler.getTemplate("journalByDate", null);
    //         templateData = {};
    //         templateData["date"] = journalDataByDateData[i].dateHeading;
    //         templateData["journalEntryTable"] = AccountHelper.getJournalFields(journalDataByDateData[i].journalEntryTable);
    //         TemplateHelper.updateTemplateText(template, templateData);
    //         journalDataByDateFields.push(template);
    //     }
    //     return journalDataByDateFields;
    // }
});
// convertCSVToJsonJournalData
Account.extend({
    convertCSVToJsonJournalData: function(csvData) {
        var response = [];
        /**
        2020-06-03,To Coin A/C,dr,2000,coin,Daily voucher,cr,2000,bonus
        response.push({"entry": []});
        var e = {
            "date": "2020-06-05",
            "particularEntry": [
                {
                    "particularText": "Cash a/c",
                    "account": "cash",
                    "dr": "500000"
                },
                {
                    "particularText": "By Owner",
                    "account": "owner",
                    "cr": "500000"
                },
                {
                    "particularText": "(Being bussiness started with capital, by Owner)"
                }
            ]
        };
        response[0].entry.push(e);
        **/
        var i, j, k, csvFileTextArr, textLineArr, entry, particularEntry;
        if ($S.isArray(csvData)) {
            for (i = 0; i < csvData.length; i++) {
                response.push({"entry": []});
                csvFileTextArr = [];
                if ($S.isString(csvData[i])) {
                    csvFileTextArr = csvData[i].split("\n");
                }
                for(j=0; j<csvFileTextArr.length; j++) {
                    textLineArr = [];
                    entry = {"date": "", "particularEntry": []};
                    if ($S.isString(csvFileTextArr[j]) && csvFileTextArr[j].length > 1) {
                        textLineArr = csvFileTextArr[j].split(",");
                        for(k=0; k<textLineArr.length; k++) {
                            textLineArr[k] = textLineArr[k].trim();
                        }
                    } else {
                        continue;
                    }
                    if (textLineArr.length < 2) {
                        DataHandler.addDataInArray("errorsData", {"code": "Invalid csv text: " + csvFileTextArr[j]});
                        continue;
                    }
                    if (AccountHelper._isValidDateStr(textLineArr[0])) {
                        entry.date = textLineArr[0];
                    } else {
                        DataHandler.addDataInArray("errorsData", {"code": "Invalid date in csv text: " + csvFileTextArr[j]});
                        continue;
                    }
                    for(k=1; k<textLineArr.length; k++) {
                        particularEntry = {"particularText": textLineArr[k]};
                        k++;
                        if (k < textLineArr.length) {
                            if (["dr", "cr"].indexOf(textLineArr[k]) >= 0) {
                                k++;
                                if ($S.isNumeric(textLineArr[k])) {
                                    particularEntry[textLineArr[k-1]] = textLineArr[k];
                                } else {
                                    DataHandler.addDataInArray("errorsData", {"code": "Invalid amount '"+textLineArr[k]+"' in csv text: " + textLineArr.join(",")});
                                }
                                k++;
                                if (k < textLineArr.length) {
                                    particularEntry["account"] = textLineArr[k];
                                }
                            } else {
                                k--;
                            }
                        }
                        entry.particularEntry.push(particularEntry);
                    }
                    response[i].entry.push(entry);
                }
            }
        }
        return response;
    }
});
// getAccountSummaryByDateFields
Account.extend({
    getAccountSummaryByDateFields: function(dataByCompany, accountData) {
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        if (!$S.isArray(accountData)) {
            accountData = [];
        }
        var dateSelection = DataHandler.getData("dateSelectionParameter", []);
        var accountSummaryByDateFields = [], fieldsData;
        fieldsData = AccountHelper._getAccountSummaryByDateData(accountData, dateSelection, dataByCompany);
        var i, j, count = 1;
        var template1, template1Data, template2, template2Data;
        for (i = fieldsData.length-1; i >= 0; i--) {
            template1 = TemplateHandler.getTemplate("accountSummaryByDate", []);
            template1Data = {"dateHeading": fieldsData[i]["dateHeading"]};
            template1Data["accountSummaryByDateRow"] = [];
            if ($S.isArray(fieldsData[i]["accountSummaryByDateRow"])) {
                template2 = TemplateHandler.getTemplate("accountSummaryByDate1stRow", []);
                template1Data["accountSummaryByDateRow"].push(template2);
                count = 1;
                for (j = 0; j < fieldsData[i]["accountSummaryByDateRow"].length; j++) {
                    template2Data = fieldsData[i]["accountSummaryByDateRow"][j];
                    template2Data["s.no"] = count++;
                    template2 = TemplateHandler.getTemplate("accountSummaryByDateRow", {});
                    AccountHelper.correctSign(template2Data);
                    TemplateHelper.updateTemplateText(template2, template2Data);
                    template1Data["accountSummaryByDateRow"].push(template2);
                }
            }
            TemplateHelper.updateTemplateText(template1, template1Data);
            accountSummaryByDateFields.push(template1);
        }
        return accountSummaryByDateFields;
    }
});
// getAccountSummaryByCalenderFields
Account.extend({
    _getAccountSummaryByCalenderData: function(dataByCompany, accountData, yearlyDateSelection) {
        // var dataByCompany = DataHandler.getData("dataByCompany", {});
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        var fieldsData = [];
        var i, j, k, l, companyData, template1Data, template2Data, currentBalRowData;
        var key, monthlyData, year;
        var startDate, endDate, currentDate, isTemplate2DataValid, template2DataFinal;
        var endBal, sNo = 1;
        if (!$S.isArray(yearlyDateSelection)) {
            yearlyDateSelection = [];
        }
        for(i=yearlyDateSelection.length-1; i>=0; i--) {
            for (j=0; j<accountData.length; j++) {
                year = yearlyDateSelection[i].dateHeading;
                monthlyData = Account.getMonthTemplate(year);
                template1Data = {"accountDisplayName": "", "accountName": "", "year": year, "template2Data": []};
                if ($S.isDefined(dataByCompany[accountData[j]["accountName"]])) {
                    companyData = dataByCompany[accountData[j]["accountName"]];
                    template1Data["accountName"] = accountData[j]["accountName"];
                    template1Data["accountDisplayName"] = sNo+" "+Account._getAccountDisplayName(accountData[j]);
                    template2Data = {"janValue": {"Dr":0, "Cr": 0}, "febValue": {"Dr":0, "Cr": 0}, "marValue": {"Dr":0, "Cr": 0},
                                    "aprValue": {"Dr":0, "Cr": 0}, "mayValue": {"Dr":0, "Cr": 0}, "junValue": {"Dr":0, "Cr": 0},
                                    "julValue": {"Dr":0, "Cr": 0}, "augValue": {"Dr":0, "Cr": 0}, "sepValue": {"Dr":0, "Cr": 0},
                                    "octValue": {"Dr":0, "Cr": 0}, "novValue": {"Dr":0, "Cr": 0}, "decValue": {"Dr":0, "Cr": 0}};
                    currentBalRowData = companyData.currentBalRowData;
                    isTemplate2DataValid = false;
                    for(k=0; k<currentBalRowData.length; k++) {
                        if (!Account._isValidDateStr(currentBalRowData[k].date)) {
                            continue;
                        }
                        for(l=0; l<monthlyData.length; l++) {
                            key = monthlyData[l].key;
                            startDate = DT.getDateObj(year+monthlyData[l]["dateRange"][0]+" 00:00");
                            endDate = DT.getDateObj(year+monthlyData[l]["dateRange"][1]+" 23:59");
                            currentDate = DT.getDateObj(currentBalRowData[k].date);
                            if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
                                if ($S.isNumeric(currentBalRowData[k].cr)) {
                                    isTemplate2DataValid = true;
                                    template2Data[key]["Cr"] += currentBalRowData[k].cr*1;
                                    template2Data[key]["Cr"] = Account(template2Data[key]["Cr"]).toFixed(2);
                                } else if ($S.isNumeric(currentBalRowData[k].dr)) {
                                    isTemplate2DataValid = true;
                                    template2Data[key]["Dr"] += currentBalRowData[k].dr*1;
                                    template2Data[key]["Dr"] = Account(template2Data[key]["Dr"]).toFixed(2);
                                }
                            }
                        }
                    }
                    if(isTemplate2DataValid) {
                        template2DataFinal = {};
                        for(key in template2Data) {
                            if (template2Data[key]["Dr"] > 0 && template2Data[key]["Cr"] > 0) {
                                template2DataFinal[key + "Dr"] = template2Data[key]["Dr"];
                                template2DataFinal[key + "Cr"] = template2Data[key]["Cr"];
                                template2DataFinal[key + "Bal"] = Account(template2Data[key]["Dr"]-template2Data[key]["Cr"]).toFixed(2);
                            } else if (template2Data[key]["Dr"] > 0) {
                                template2DataFinal[key + "Dr"] = template2Data[key]["Dr"];
                                template2DataFinal[key + "Bal"] = template2Data[key]["Dr"]
                            } else if (template2Data[key]["Cr"] > 0) {
                                template2DataFinal[key + "Cr"] = template2Data[key]["Cr"];
                                template2DataFinal[key + "Bal"] = -template2Data[key]["Cr"];
                            }
                        }
                        sNo++;
                        template1Data.template2Data.push(template2DataFinal);
                        fieldsData.push(template1Data);
                    }
                }
            }
        }
        for(j=0; j<fieldsData.length; j++) {
            template2Data = fieldsData[j].template2Data;
            endBal = 0;
            for (k=0; k<template2Data.length; k++) {
                template2Data[k]["totalValueDr"] = 0;
                template2Data[k]["totalValueCr"] = 0;
            }
            for(i=0; i<monthlyData.length; i++) {
                key = monthlyData[i].key;
                for (k=0; k<template2Data.length; k++) {
                    if ($S.isNumber(template2Data[k][key+"Dr"])) {
                        template2Data[k]["totalValueDr"] += template2Data[k][key+"Dr"];
                        template2Data[k]["totalValueDr"] = Account(template2Data[k]["totalValueDr"]).toFixed(2);
                    }
                    if ($S.isNumber(template2Data[k][key+"Cr"])) {
                        template2Data[k]["totalValueCr"] += template2Data[k][key+"Cr"];
                        template2Data[k]["totalValueCr"] = Account(template2Data[k]["totalValueCr"]).toFixed(2);
                    }
                    if ($S.isNumber(template2Data[k][key+"Bal"])) {
                        template2Data[k][key+"EndBal"] = Account(endBal*1 + template2Data[k][key+"Bal"]*1).toFixed(2);
                        endBal = template2Data[k][key+"EndBal"];
                        template2Data[k]["totalValueBal"] = endBal;
                        if (endBal < 0) {
                            template2Data[k][key+"EndBal"] = {"tag":"div.b", "className": "text-danger", "text": "("+(-1)*endBal+")"};
                            template2Data[k]["totalValueBal"] = template2Data[k][key+"EndBal"];
                        }
                        if (template2Data[k][key+"Bal"] < 0) {
                            template2Data[k][key+"Bal"] = {"tag":"div.b", "className": "text-danger", "text": "("+(-1)*template2Data[k][key+"Bal"]+")"};
                        } else {
                            template2Data[k][key+"Bal"] = template2Data[k][key+"Bal"];
                        }
                    }
                }
            }
        }
        return fieldsData;
    },
    getAccountSummaryByCalenderFields: function(dataByCompany, accountData, yearlyDateSelection) {
        if (!$S.isArray(yearlyDateSelection)) {
            yearlyDateSelection = [];
        }
        var accountSummaryByCalenderFields = [], fieldsData;
        fieldsData = AccountHelper._getAccountSummaryByCalenderData(dataByCompany, accountData, yearlyDateSelection);
        var i, j, template1, template2, template1Data, template2Data;
        for (i = 0; i < fieldsData.length; i++) {
            template1 = TemplateHandler.getTemplate("accountSummaryByCalender", []);
            template1Data = {"accountDisplayName": fieldsData[i].accountDisplayName,
                            "year": fieldsData[i].year,
                            "accountSummaryByCalenderRow": []};
            if (fieldsData[i].template2Data) {
                template2 = TemplateHandler.getTemplate("accountSummaryByCalender1stRow", []);
                template1Data.accountSummaryByCalenderRow.push(template2);
                for(j=0; j<fieldsData[i].template2Data.length; j++) {
                    template2Data = fieldsData[i].template2Data[j];
                    template2 = TemplateHandler.getTemplate("accountSummaryByCalenderRow", []);
                    TemplateHelper.updateTemplateText(template2, template2Data);
                    template1Data.accountSummaryByCalenderRow.push(template2);
                }
            }
            TemplateHelper.updateTemplateText(template1, template1Data);
            accountSummaryByCalenderFields.push(template1);
        }
        return accountSummaryByCalenderFields;
    },
    _getCustomisedAccountSummaryByCalenderData: function(dataByCompany, customiseAccountData, yearlyDateSelection, customiseType) {
        customiseType = customiseType === "Cr" ? "Cr" : "Dr";
        var fieldsData, response = [];
        var i, j, k, l, m, n, heading, tempAccountData;
        var template1Data, template2Data, monthlyData, count, monthKey, year;
        if (!$S.isArray(yearlyDateSelection)) {
            yearlyDateSelection = [];
        }
        for(i=yearlyDateSelection.length-1; i>=0; i--) {
            for(n=0; n<customiseAccountData.length; n++) {
                tempAccountData = customiseAccountData[n].accounts;
                heading = customiseAccountData[n].heading;
                fieldsData = AccountHelper._getAccountSummaryByCalenderData(dataByCompany, tempAccountData, yearlyDateSelection);
                if (!$S.isString(heading)) {
                    heading = customiseType === "Dr" ? "Debit" : "Credit";
                }
                template1Data = {"heading": heading, "year": "", "template2Data": []};
                template1Data.year = yearlyDateSelection[i].dateHeading;
                monthlyData = Account.getMonthTemplate(template1Data.year);
                for(j=0; j<tempAccountData.length; j++) {
                    for(k=0; k<fieldsData.length; k++) {
                        if (template1Data.year === fieldsData[k].year && tempAccountData[j].accountName === fieldsData[k].accountName) {
                            template2Data = {"accountDisplayName": "", "s.no": ""};
                            template2Data.accountDisplayName = Account._getAccountDisplayName(tempAccountData[j]);
                            for(l=0; l<monthlyData.length; l++) {
                                monthKey = monthlyData[l]["key"];
                                for(m=0; m<fieldsData[k].template2Data.length; m++) {
                                    if (fieldsData[k].template2Data[m][monthKey+customiseType]) {
                                        template2Data[monthKey] = fieldsData[k].template2Data[m][monthKey+customiseType];
                                    }
                                    monthKey = "totalValue";
                                    if (fieldsData[k].template2Data[m][monthKey+customiseType]) {
                                        template2Data[monthKey] = fieldsData[k].template2Data[m][monthKey+customiseType];
                                    }
                                }
                            }
                            template1Data.template2Data.push(template2Data);
                        }
                    }
                }
                if (template1Data.template2Data.length) {
                    response.push(template1Data);
                }
            }
        }
        var totalRowData, key;
        for(i=0; i<response.length; i++) {
            count = 1;
            year = response[i].year;
            monthlyData = $S.clone(Account.getMonthTemplate(year));
            monthlyData.push({"key": "totalValue"});
            totalRowData = {};
            for(j=0; j<response[i].template2Data.length; j++) {
                response[i].template2Data[j]["s.no"] = count++;
                for(k=0; k<monthlyData.length; k++) {
                    monthKey = monthlyData[k]["key"];
                    if (response[i].template2Data[j][monthKey]) {
                        if (totalRowData[monthKey]) {
                            totalRowData[monthKey] += response[i].template2Data[j][monthKey];
                            totalRowData[monthKey] = Account(totalRowData[monthKey]).toFixed(2);
                        } else {
                            totalRowData[monthKey] = response[i].template2Data[j][monthKey];
                        }
                    }
                }
            }
            if (response[i].template2Data.length) {
                template2Data = {"accountDisplayName": {"tag":"b","className": "text-danger", "text":"Total"}, "s.no": count};
                for(key in totalRowData) {
                    totalRowData[key] = {"tag":"b", "text":totalRowData[key]};
                }
                Object.assign(template2Data, totalRowData);
                response[i].template2Data.push(template2Data);
            }
        }
        return response;
    },
    getCustomisedAccountSummaryByCalenderFields: function(dataByCompany, customiseAccountData, yearlyDateSelection, customiseType, ignoreIfDataNotFound) {
        var accountSummaryByCalenderFields = [], fieldsData = [];
        var i,j;
        fieldsData = AccountHelper._getCustomisedAccountSummaryByCalenderData(dataByCompany, customiseAccountData, yearlyDateSelection, customiseType);
        var template1, template2, template1Data, template2Data;
        for (i = 0; i < fieldsData.length; i++) {
            template1 = TemplateHandler.getTemplate("customisedAccountSummary", []);
            template1Data = {"heading": fieldsData[i].heading,
                            "year": fieldsData[i].year,
                            "customisedAccountSummaryRow": []};
            if (fieldsData[i].template2Data.length) {
                template2 = TemplateHandler.getTemplate("customisedAccountSummary1stRow", []);
                template1Data.customisedAccountSummaryRow.push(template2);
                for(j=0; j<fieldsData[i].template2Data.length; j++) {
                    template2Data = fieldsData[i].template2Data[j];
                    template2 = TemplateHandler.getTemplate("customisedAccountSummaryRow", []);
                    TemplateHelper.updateTemplateText(template2, template2Data);
                    template1Data.customisedAccountSummaryRow.push(template2);
                }
                TemplateHelper.updateTemplateText(template1, template1Data);
                accountSummaryByCalenderFields.push(template1);
            }
        }
        if (fieldsData.length === 0 && !$S.isBooleanTrue(ignoreIfDataNotFound)) {
            accountSummaryByCalenderFields.push(TemplateHandler.getTemplate("noDataFound", []));
        }
        return accountSummaryByCalenderFields;
    }
});
// getCustomiseAccountSummaryFields
Account.extend({
    _getCustomisedAccountSummaryByCalenderFields2: function(dataByCompany, customeAccountData, customYearlyDateSelection) {
        var response = [], tempResponse;
        for(var i=0; i<customeAccountData.length; i++) {
            tempResponse = Account.getAccountSummaryByCalenderFields(dataByCompany, customeAccountData[i].accounts, customYearlyDateSelection);
            // tempResponse = Account.getCustomisedAccountSummaryByCalenderFields2();
            response.push(tempResponse);
        }
        return response;
    },
    getCustomiseAccountSummaryFields: function(dataByCompany, customeAccountData, yearlyDateSelection) {
        if (!$S.isObject(dataByCompany)) {
            dataByCompany = {};
        }
        if (!$S.isArray(customeAccountData)) {
            customeAccountData = [];
        }
        if (!$S.isArray(yearlyDateSelection)) {
            yearlyDateSelection = [];
        }
        var customiseAccountSummaryFields = [];
        var keys = ["customiseDebitAccount", "customiseCreditAccount", "customiseCalenderAccount"];
        var key, tempYearlyDateSelection, i, j, k, tempResponse;
        // var customeAccountData = DataHandler.getData("customeAccountData", []);
        // var yearlyDateSelection = DataHandler.getData("combinedDateSelectionParameter", {})["yearly"];
        if (!$S.isArray(yearlyDateSelection)) {
            yearlyDateSelection = [];
        }
        for(k=yearlyDateSelection.length-1; k>=0; k--) {
            tempYearlyDateSelection = [yearlyDateSelection[k]];
            for(i=0; i<customeAccountData.length; i++) {
                for(j=0; j<keys.length; j++) {
                    key = keys[j];
                    if (customeAccountData[i][key]) {
                        if (key === "customiseDebitAccount") {
                            tempResponse = Account.getCustomisedAccountSummaryByCalenderFields(dataByCompany, customeAccountData[i][key], tempYearlyDateSelection, "Dr", true);
                            customiseAccountSummaryFields.push(tempResponse);
                        }
                        if (key === "customiseCreditAccount") {
                            tempResponse = Account.getCustomisedAccountSummaryByCalenderFields(dataByCompany, customeAccountData[i][key], tempYearlyDateSelection, "Cr", true);
                            customiseAccountSummaryFields.push(tempResponse);
                        }
                        if (key === "customiseCalenderAccount") {
                            tempResponse = Account._getCustomisedAccountSummaryByCalenderFields2(dataByCompany, customeAccountData[i][key], tempYearlyDateSelection);
                            customiseAccountSummaryFields.push(tempResponse);
                        }
                    }
                }
            }
        }
        if (customiseAccountSummaryFields.length === 0) {
            customiseAccountSummaryFields.push(TemplateHandler.getTemplate("noDataFound", []));
        }
        return customiseAccountSummaryFields;
    }
});

AccountHelper = Account;
})($S);

export default AccountHelper;
