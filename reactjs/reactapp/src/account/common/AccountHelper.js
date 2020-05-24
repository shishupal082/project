import $S from '../../interface/stack.js';
import TemplateHelper from '../../common/TemplateHelper';

var AccountHelper;

(function($S){
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
    getDataByCompany: function(finalJournalData, validAccountName) {
        var i, j, k, particularEntry, accountName, entry, temp;
        var dataByCompany = {};
        if (!$S.isArray(finalJournalData)) {
            return dataByCompany;
        }
        if (!$S.isArray(validAccountName)) {
            validAccountName = [];
        }
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
                                entry.particularEntry[1].particularText = "By " + temp;
                            } else if ($S.isDefined(entry.particularEntry[1].dr) && $S.isDefined(entry.particularEntry[0].cr)) {
                                entry.particularEntry[0].particularText = "By " + entry.particularEntry[1].particularText;
                                entry.particularEntry[1].particularText = temp;
                            }
                        }
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            accountName = entry.particularEntry[k].account;
                            if (validAccountName.indexOf(accountName) < 0) {
                                console.log("Invalid accountName: " + accountName);
                                continue;
                            }
                            if ($S.isString(accountName) && accountName.length) {
                                if ($S.isUndefined(dataByCompany[accountName])) {
                                    dataByCompany[accountName] = {"accountName": accountName, ledgerRowData: {"dr": [], "cr": []}};
                                }
                                particularEntry = $S.clone(entry.particularEntry[k]);
                                particularEntry.date = entry.date;
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
        Account._generateLedgerBalance(dataByCompany);
        return dataByCompany;
    }
});

Account.extend({
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
    getFinalJournalData: function(journalData) {
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

//getLeaderBookFields
Account.extend({
    getLeaderBookFields: function(self, accountData, dataByCompany) {
        var ledgerData = [];
        if (!$S.isArray(accountData) || !$S.isObject(dataByCompany)) {
            return ledgerData;
        }
        var ledgerRowTemplate = {};
        var i, j, minLength, maxLength, temp, companyData, ledgerRowFields;
        for (i=0; i<accountData.length; i++) {
            if (dataByCompany[accountData[i].accountName]) {
                companyData = dataByCompany[accountData[i].accountName];
                ledgerRowFields = {accountName: "", fields: []};
                ledgerRowFields.accountName = $S.capitalize(accountData[i].accountName) + " A/C";
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
    getTrialBalanceFields: function(self, dataByCompany, validAccountName) {
        var trialBalanceFields = [];
        if (!$S.isObject(dataByCompany) || !$S.isArray(validAccountName)) {
            return trialBalanceFields;
        }
        var key, temp, template, count = 1, balanceBdField;
        var totalDebit = 0, totalCredit = 0, i;
        trialBalanceFields.push(self.getTemplate("trialBalance1stRow"));
        for (i = 0; i < validAccountName.length; i++) {
            key = validAccountName[i];
            if ($S.isUndefined(dataByCompany[key])) {
                continue;
            }
            temp = {};
            temp["s.no"] = count++;
            balanceBdField = TemplateHelper(dataByCompany[key]).searchFieldV2("balanceBd");
            if (balanceBdField.name === "balanceBd") {
                temp.particular = $S.capitalize(key) + " A/C";
                temp.debitBalance = balanceBdField.dr;
                temp.creditBalance = balanceBdField.cr;
                if ($S.isNumeric(temp.debitBalance)) {
                    totalDebit += temp.debitBalance*1;
                }
                if ($S.isNumeric(temp.creditBalance)) {
                    totalCredit += temp.creditBalance*1;
                }
            } else {
                temp.particular = $S.capitalize(key) + " A/C";
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
AccountHelper = Account;
})($S);

export default AccountHelper;
