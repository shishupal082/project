import $S from '../../interface/stack.js';
import TemplateHelper from '../../common/TemplateHelper';

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
    }
};
$S.extendObject(Account);

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
                    }
                }
            } else {
                ledgerRowData.dr = [];
            }
            if ($S.isArray(ledgerRowData.cr)) {
                for (i = 0; i < ledgerRowData.cr.length; i++) {
                    if ($S.isNumeric(ledgerRowData.cr[i].cr)) {
                        creditAmount += ledgerRowData.cr[i].cr *1;
                    }
                }
            } else {
                ledgerRowData.cr = [];
            }
            totalAmount = creditAmount;
            if (debitAmount > creditAmount) {
                totalAmount = debitAmount;
                particularEntry = {"cr": debitAmount - creditAmount};
                particularEntry.particularText = {"tag":"b", "text":"By Balance C/D"};
                ledgerRowData.cr.push(particularEntry);
            } else if (debitAmount < creditAmount) {
                totalAmount = creditAmount;
                particularEntry = {"dr": creditAmount - debitAmount};
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
                particularEntry = {"dr": debitAmount - creditAmount, name: "balanceBd"};
                particularEntry.particularText = {"tag":"b", "text":"By Balance B/D"};
                ledgerRowData.dr.push(particularEntry);
            } else if (debitAmount < creditAmount) {
                totalAmount = creditAmount;
                particularEntry = {"cr": creditAmount - debitAmount, name: "balanceBd"};
                particularEntry.particularText = {"tag":"b", "text":"By Balance B/D"};
                ledgerRowData.cr.push(particularEntry);
            }
        }
        return dataByCompany;
    }
});
//getDataByCompany
Account.extend({
    getDataByCompany: function(Data, finalJournalData, accountData) {
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
                                if ($S.isDefined(accountName)) {
                                    Data.addError("Invalid accountName: " + accountName);
                                    console.log("Invalid accountName: " + accountName);
                                }
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
        // Minute more than 59 handle at date obj (but not 24:00)

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
        return true;
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

//getLedgerBookFields
Account.extend({
    getLedgerBookFields: function(self, accountData, dataByCompany) {
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
                ledgerRowFields.fields.push(self.getTemplate("ledgerHeading"));
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
                        ledgerRowTemplate = self.getTemplate("ledgerRow");
                        TemplateHelper.setTemplateTextByFormValues(ledgerRowTemplate, temp);
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
                        ledgerRowTemplate = self.getTemplate("ledgerRow");
                        TemplateHelper.setTemplateTextByFormValues(ledgerRowTemplate, temp);
                        ledgerRowFields.fields.push(ledgerRowTemplate);
                    }
                }
                ledgerData.push(ledgerRowFields);
            }
        }
        return ledgerData;
    }
});
//getTrialBalanceFields
Account.extend({
    getTrialBalanceFields: function(self, dataByCompany, accountData) {
        var trialBalanceFields = [];
        if (!$S.isObject(dataByCompany) || !$S.isArray(accountData)) {
            return trialBalanceFields;
        }
        Account._generateLedgerBalance(dataByCompany);
        var key, temp, template, count = 1, balanceBdField;
        var totalDebit = 0, totalCredit = 0, i;
        var accountDisplayName;
        trialBalanceFields.push(self.getTemplate("trialBalance1stRow"));
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
                    totalDebit += temp.debitBalance*1;
                }
                if ($S.isNumeric(temp.creditBalance)) {
                    totalCredit += temp.creditBalance*1;
                }
            } else {
                temp.particular = accountDisplayName;
                count--;
                continue;
            }
            template = self.getTemplate("trialBalanceRow");
            TemplateHelper.setTemplateTextByFormValues(template, temp);
            trialBalanceFields.push(template);
        }
        temp = {};
        template = self.getTemplate("trialBalanceRow");
        temp.particular = {"tag":"div.b", "className": "text-right", "text":"Total"};
        temp.debitBalance = totalDebit;
        temp.creditBalance = totalCredit;
        TemplateHelper.setTemplateTextByFormValues(template, temp);
        trialBalanceFields.push(template);
        return trialBalanceFields;
    }
});
//partial
Account.extend({
    generateCurrentBalanaceTrs: function(Data, currentBalRowData) {
        var trs = [];
        if (!$S.isArray(currentBalRowData)) {
            return trs;
        }
        var i, j, count = 1, prev = {}, current = {}, isTotalRow = false;
        var num, signCorrection = ["dr", "cr", "currentBal", "balance"], attr;
        var template, templateData;
        template = Data.getTemplate("currentBal1stRowByDate", null);
        trs.push(template);
        for (j=0; j<signCorrection.length; j++) {
            prev[signCorrection[j]] = null;
            current[signCorrection[j]] = null;
        }
        for (i = 0; i < currentBalRowData.length; i++) {
            template = Data.getTemplate("currentBalRowByDate", null);
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
            TemplateHelper.setTemplateTextByFormValues(template, templateData);
            trs.push(template);
        }
        return trs;
    }
});
//getCurrentBalanceFields
Account.extend({
    getCurrentBalanceFields: function(self, dataByCompany, accountData) {
        var currentBalanceFields = [], currentBalanceData = [];
        var i, j, key, lastAmount, temp, count;
        var debitAmount, creditAmount, currentAmount = 0;
        if(!$S.isArray(accountData)) {
            return currentBalanceFields;
        }
        for (i = 0; i < accountData.length; i++) {
            key = accountData[i].accountName;
            if ($S.isUndefined(dataByCompany[key])) {
                continue;
            }
            lastAmount = 0;
            debitAmount = 0;
            creditAmount = 0;
            if ($S.isArray(dataByCompany[key].currentBalRowData)) {
                for (j = 0; j < dataByCompany[key].currentBalRowData.length; j++) {
                    if ($S.isNumeric(dataByCompany[key].currentBalRowData[j].dr)) {
                        currentAmount = dataByCompany[key].currentBalRowData[j].dr * 1;
                        debitAmount += currentAmount;
                    }
                    if ($S.isNumeric(dataByCompany[key].currentBalRowData[j].cr)) {
                        currentAmount = (-1)* dataByCompany[key].currentBalRowData[j].cr * 1;
                        creditAmount += (-1)* currentAmount;
                    }
                    dataByCompany[key].currentBalRowData[j].balance = lastAmount + currentAmount;
                    if (j === dataByCompany[key].currentBalRowData.length-1) {
                        temp = lastAmount + currentAmount;
                        if (lastAmount + currentAmount < 0) {
                            temp = "("+(-1)*temp+")";
                        }
                        dataByCompany[key].currentBalRowData[j].balanceText = {"tag":"b", "className": "text-danger", "text": temp};
                    }
                    lastAmount = dataByCompany[key].currentBalRowData[j].balance;
                }
                if (j > 0) {
                    temp = {};
                    if (lastAmount > 0) {
                        temp.cr = lastAmount;
                        creditAmount += lastAmount;
                        temp.particularText = {"tag":"b", "text":"By Balance C/D"};
                        dataByCompany[key].currentBalRowData.push(temp);
                    } else if (lastAmount < 0) {
                        temp.dr = (-1)*lastAmount;
                        debitAmount += temp.dr;
                        temp.particularText = {"tag":"b", "text":"By Balance C/D"};
                        dataByCompany[key].currentBalRowData.push(temp);
                    }
                    temp = {};
                    temp.particularText = {"tag":"div.b", "className": "text-right", "text":"Total"};
                    temp.dr = debitAmount;
                    temp.cr = creditAmount;
                    dataByCompany[key].currentBalRowData.push(temp);
                    temp = {};
                    temp.particularText = {"tag":"b", "text":"By Balance B/D"};
                    if (lastAmount > 0) {
                        temp.dr = lastAmount;
                        dataByCompany[key].currentBalRowData.push(temp);
                    } else if (lastAmount < 0) {
                        temp.cr = (-1)*lastAmount;
                        debitAmount += temp.cr;
                        dataByCompany[key].currentBalRowData.push(temp);
                    }
                }
            }
            currentBalanceData.push(dataByCompany[key]);
        }
        var template = {accountDisplayName:"", fields: []}, fieldTemplate, rowData;
        var fieldHeaderTemplate = self.getTemplate("currentBal1stRow");
        for (i = 0; i < currentBalanceData.length; i++) {
            currentBalanceFields.push($S.clone(template));
            currentBalanceFields[i].accountDisplayName = currentBalanceData[i].accountDisplayName;
            currentBalanceFields[i].fields.push(fieldHeaderTemplate);
            if ($S.isArray(currentBalanceData[i].currentBalRowData)) {
                count = 1;
                for (j = 0; j < currentBalanceData[i].currentBalRowData.length; j++) {
                    rowData = currentBalanceData[i].currentBalRowData[j];
                    if ($S.isNumber(rowData.balance) && rowData.balance < 0) {
                        rowData.balance = "("+(-1*rowData.balance)+")";
                    }
                    if (rowData.balanceText) {
                        rowData.balance = rowData.balanceText;
                    }
                    fieldTemplate = self.getTemplate("currentBalRow");
                    rowData["s.no"] = count++;
                    TemplateHelper.setTemplateTextByFormValues(fieldTemplate, rowData);
                    currentBalanceFields[i].fields.push(fieldTemplate);
                }
            }
        }
        return currentBalanceFields;
    }
});
//_getCurrentBalanceDataByDate
Account.extend({
    _getCurrentBalanceDataByDate: function(Data, dataByCompany, accountData, dateSelection) {
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
            templateData = {"accountDisplayName": accountDisplayName, "currentBalByDateRow": []};
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
                            } else if ($S.isNumeric(currentBalRowData[k].cr)) {
                                currentBalAmount -= currentBalRowData[k].cr*1;
                                creditAmount += currentBalRowData[k].cr*1;
                            }
                            currentBalRowData[k]["currentBal"] = currentBalAmount;
                            currentBalRowData[k]["balance"] = lastAmount + currentBalAmount;
                        }
                        temp = {"name": "totalRow", "particularText": {"tag":"div.b", "className": "text-right", "text":"Total"}};
                        temp.dr = debitAmount;
                        temp.cr = creditAmount;
                        temp.currentBal = currentBalAmount;
                        temp.balance = lastAmount + currentBalAmount;
                        currentBalRowData.push(temp);
                        lastAmount += currentBalAmount;
                    }
                }
            }
        }
        return currentBalanceFieldsData;
    }
});
//getCurrentBalByDateRowData
Account.extend({
    getCurrentBalByDateRowData: function(Data, dataByCompany, accountData, dateSelection) {
        var currentBalanceFields = [], currentBalanceFieldsData = [];
        var i, j;
        // var debitAmount, creditAmount, currentAmount = 0;
        var template, templateData, template2, template2Data;
        currentBalanceFieldsData = AccountHelper._getCurrentBalanceDataByDate(Data, dataByCompany, accountData, dateSelection);
        // Generating template data
        for (i = 0; i < currentBalanceFieldsData.length; i++) {
            template = Data.getTemplate("currentBalByDate", null);
            templateData = {};
            templateData["accountDisplayName"] = currentBalanceFieldsData[i].accountDisplayName;
            templateData["currentBalByDateRow"] = [];
            for(j=0; j<currentBalanceFieldsData[i].currentBalByDateRow.length; j++) {
                template2 = Data.getTemplate("currentBalByDateRow", null);
                template2Data = {"dateHeading": "("+templateData["accountDisplayName"] + ") " + currentBalanceFieldsData[i].currentBalByDateRow[j].dateHeading};
                template2Data["currentBalRow"] = Account.generateCurrentBalanaceTrs(Data, currentBalanceFieldsData[i].currentBalByDateRow[j].currentBalRowData);
                TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
                templateData["currentBalByDateRow"].push(template2);
            }
            TemplateHelper.setTemplateTextByFormValues(template, templateData);
            currentBalanceFields.push(template);
        }
        return currentBalanceFields;
    }
});
//getAccountSummaryFields
Account.extend({
    getAccountSummaryFields: function(Data, dataByCompany, accountData, dateSelection) {
        var currentBalanceFields = [], currentBalanceFieldsData = [];
        var i, j, count = 1, totalRow;
        var template, templateData, template2, template2Data, currentBalByDateRow = [];
        currentBalanceFieldsData = AccountHelper._getCurrentBalanceDataByDate(Data, dataByCompany, accountData, dateSelection);
        // Generating template data
        for (i = 0; i < currentBalanceFieldsData.length; i++) {
            template = Data.getTemplate("accountSummary", null);
            templateData = {};
            templateData["accountDisplayName"] = currentBalanceFieldsData[i].accountDisplayName;
            templateData["accountSummaryRow"] = [];

            currentBalByDateRow = currentBalanceFieldsData[i].currentBalByDateRow;
            if ($S.isArray(currentBalByDateRow) && currentBalByDateRow.length) {
                template2 = Data.getTemplate("accountSummary1stRow", null);
                templateData["accountSummaryRow"].push(template2);
                count = 1;
                for (j=0; j<currentBalByDateRow.length; j++) {
                    template2 = Data.getTemplate("accountSummaryRow", null);
                    template2Data = {};
                    totalRow = TemplateHelper(currentBalByDateRow[j]).searchFieldV2("totalRow");
                    template2Data = $S.clone(totalRow);
                    template2Data.dateHeading = currentBalByDateRow[j].dateHeading;
                    template2Data["s.no"] = count++;
                    if (template2Data.name === "totalRow") {
                        AccountHelper.correctSign(template2Data);
                        TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
                        templateData["accountSummaryRow"].push(template2);
                    }
                }
            }
            TemplateHelper.setTemplateTextByFormValues(template, templateData);
            currentBalanceFields.push(template);
        }
        return currentBalanceFields;
    }
});
//getJournalFields
Account.extend({
    getJournalFields: function(Data, journalData) {
        var journalRowData = [], i, j, k, count = 1;
        var template = Data.getTemplate("journalEntry1stRow", null);
        if (template) {
            journalRowData.push(template);
        }
        var entry = [], particularFieldTemplate = {}, temp;
        for (i = 0; i < journalData.length; i++) {
            if ($S.isArray(journalData[i].entry)) {
                for (j = 0; j < journalData[i].entry.length; j++) {
                    entry = journalData[i].entry[j];
                    entry["s.no"] = count++;
                    template = Data.getTemplate("journalEntry", null);
                    temp = TemplateHelper(template).searchField("particular");
                    if (temp.name === "particular") {
                        temp.text = [];
                    }
                    TemplateHelper.setTemplateTextByFormValues(template, entry);
                    if ($S.isArray(entry.particularEntry)) {
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            particularFieldTemplate = Data.getTemplate("journalEntryParticular", null);
                            TemplateHelper.setTemplateTextByFormValues(particularFieldTemplate, entry.particularEntry[k]);
                            temp.text.push(particularFieldTemplate);
                        }
                    }
                    journalRowData.push(template);
                }
            }
        }
        return journalRowData;
    }
});
//getApiJournalDataByDate
Account.extend({
    getApiJournalDataByDate: function(Data, apiJournalData) {
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
                            }
                            if ($S.isNumeric(particularEntry[k].dr)) {
                                debitAmount += particularEntry[k].dr*1;
                            }
                        }
                        if (debitAmount !== creditAmount && debitAmount > 0 && creditAmount > 0) {
                            Data.addError({"code": "Total amount mismatch: " + JSON.stringify(entry)});
                            continue;
                        }
                    }
                    if (AccountHelper._isValidDateStr(entry.date)) {
                        if (!$S.isArray(dataByDate[entry.date])) {
                            dataByDate[entry.date] = [];
                        }
                    } else {
                        Data.addError({"code": "Invalid date: " + JSON.stringify(entry)});
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
    getJournalDataByDateFields: function(Data, apiJournalDataByDate, dateSelection) {
        var journalDataByDateFields = [], template, templateData;
        var i, j, journalEntry;
        var startDate, endDate, currentDate;
        var journalDataByDateData = [];
        if (!$S.isArray(apiJournalDataByDate) || !$S.isArray(dateSelection)) {
            return journalDataByDateFields;
        }
        for (i = 0; i < dateSelection.length; i++) {
            if (!$S.isArray(dateSelection[i].dateRange) || dateSelection[i].dateRange.length < 2) {
                continue;
            }
            startDate = DT.getDateObj(dateSelection[i].dateRange[0]);
            endDate = DT.getDateObj(dateSelection[i].dateRange[1]);
            templateData = {"dateHeading": dateSelection[i].dateHeading, "journalEntryTable": []};
            if (startDate === null || endDate === null) {
                console.log("Invalid date range: " + JSON.stringify(dateSelection[j].dateRange));
                continue;
            }
            journalEntry = {"entry": []};
            for (j = 0; j < apiJournalDataByDate.length; j++) {
                if ($S.isArray(apiJournalDataByDate[j].entry) && apiJournalDataByDate[j].entry.length) {
                    currentDate = DT.getDateObj(apiJournalDataByDate[j].entry[0].date);
                    if (currentDate === null) {
                        continue;
                    }
                }
                if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
                    if (apiJournalDataByDate[j].entry !== null) {
                        journalEntry.entry = $S.clone(journalEntry.entry.concat(apiJournalDataByDate[j].entry));
                        apiJournalDataByDate[j].entry = null;
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            templateData.journalEntryTable = templateData.journalEntryTable.concat(journalEntry);
            journalDataByDateData.push(templateData);
        }
        for(i=0; i<journalDataByDateData.length; i++) {
            template = Data.getTemplate("journalByDate", null);
            templateData = {};
            templateData["date"] = journalDataByDateData[i].dateHeading;
            templateData["journalEntryTable"] = AccountHelper.getJournalFields(Data,journalDataByDateData[i].journalEntryTable);
            TemplateHelper.setTemplateTextByFormValues(template, templateData);
            journalDataByDateFields.push(template);
        }
        return journalDataByDateFields;
    }
});
AccountHelper = Account;
})($S);

export default AccountHelper;
