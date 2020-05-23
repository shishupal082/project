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
    generateLedgerBalance: function(dataByCompany) {
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

Account.extend({
    getDataByCompany: function(journalData, validAccountName) {
        var i, j, k, particularEntry, accountName, entry;
        var dataByCompany = {};
        if (!$S.isArray(journalData)) {
            return dataByCompany;
        }
        if (!$S.isArray(validAccountName)) {
            validAccountName = [];
        }
        for (i=0; i<journalData.length; i++) {
            if ($S.isArray(journalData[i].entry)) {
                for (j = 0; j < journalData[i].entry.length; j++) {
                    entry = journalData[i].entry[j];
                    if ($S.isArray(entry.particularEntry)) {
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            accountName = entry.particularEntry[k].account;
                            if (validAccountName.indexOf(accountName) < 0) {
                                console.log("Invalid accountName: " + accountName);
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
        Account.generateLedgerBalance(dataByCompany);
        return dataByCompany;
    }
});

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
                ledgerRowFields.accountName = accountData[i].accountName;
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
                            temp.debitParticular = companyData.ledgerRowData.dr[j].ledgerText;
                        }
                        temp.creditDate = companyData.ledgerRowData.cr[j].date;
                        temp.creditAmount = companyData.ledgerRowData.cr[j].cr;
                        temp.creditParticular = companyData.ledgerRowData.cr[j].particularText;
                        if (companyData.ledgerRowData.cr[j].ledgerText) {
                            temp.debitParticular = companyData.ledgerRowData.cr[j].ledgerText;
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
                                temp.creditParticular = companyData.ledgerRowData.cr[j].ledgerText;
                            }
                        } else {
                            temp.debitDate = companyData.ledgerRowData.dr[j].date;
                            temp.debitAmount = companyData.ledgerRowData.dr[j].dr;
                            temp.debitParticular = companyData.ledgerRowData.dr[j].particularText;
                            if (companyData.ledgerRowData.dr[j].ledgerText) {
                                temp.debitParticular = companyData.ledgerRowData.dr[j].ledgerText;
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
AccountHelper = Account;
})($S);

export default AccountHelper;
