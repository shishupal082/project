import $S from '../../interface/stack.js';
import TemplateHelper from '../../common/TemplateHelper';
import AccountHelper from './AccountHelper';

var AccountHelper2;

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
    getCustomAccountsData: function(currentUserControlData, accountData, key, response) {
        var i,j,k;
        var accountDataMapping = {};
        var accountAddCount = {}, tempAccountAddCount, accountName;

        for(i=0; i<accountData.length; i++) {
            accountDataMapping[accountData[i]["accountName"]] = accountData[i];
            accountAddCount[accountData[i]["accountName"]] = 0;
        }
        var tempData, customData;
        if (!$S.isArray(response)) {
            response = [];
        }
        if (!$S.isString(key)) {
            return response;
        }
        if (key === "customeAccount") {
            var finalResponse = [];
            var temp;
            if ($S.isArray(currentUserControlData[key])) {
                for (i=0; i<currentUserControlData[key].length; i++) {
                    temp = {};
                    if ($S.isObject(currentUserControlData[key][i])) {
                        for(var key2 in currentUserControlData[key][i]) {
                            temp[key2] = Account.getCustomAccountsData(currentUserControlData[key][i], accountData, key2, []);
                        }
                    }
                    finalResponse.push(temp);
                }
            }
            return finalResponse;
        } else {
            if ($S.isArray(currentUserControlData[key])) {
                for (j=0; j<currentUserControlData[key].length; j++) {
                    customData = currentUserControlData[key][j];
                    tempData = {"heading": customData.heading, "name": key, "accounts": []};
                    if ($S.isArray(customData.accountNames)) {
                        tempAccountAddCount = $S.clone(accountAddCount);
                        for(k=0; k<customData.accountNames.length; k++) {
                            accountName = customData.accountNames[k];
                            if (accountDataMapping[accountName]) {
                                if (tempAccountAddCount[accountName] >= 1) {
                                    continue;
                                }
                                tempAccountAddCount[accountName]++;
                                tempData.accounts.push(accountDataMapping[accountName]);
                            }
                        }
                    } else if ($S.isArray(customData.accountNamesExcept)) {
                        for(k=0; k<accountData.length; k++) {
                            accountName = accountData[k].accountName;
                            if (customData.accountNamesExcept.indexOf(accountName) < 0) {
                                tempData.accounts.push(accountData[k]);
                            }
                        }
                    }
                    if (tempData.accounts.length) {
                        response.push(tempData);
                    }
                }
            }
        }
        return response;
    }
});

// getProfitAndLossFields
Account.extend({
    _getMonthlyDataByAccountName: function(dataByCompany, year, accountName) {
        var monthlyData = AccountHelper.getMonthTemplateV2(year);
        var response = {"janValue": {"Dr":0, "Cr": 0}, "febValue": {"Dr":0, "Cr": 0}, "marValue": {"Dr":0, "Cr": 0},
                "aprValue": {"Dr":0, "Cr": 0}, "mayValue": {"Dr":0, "Cr": 0}, "junValue": {"Dr":0, "Cr": 0},
                "julValue": {"Dr":0, "Cr": 0}, "augValue": {"Dr":0, "Cr": 0}, "sepValue": {"Dr":0, "Cr": 0},
                "octValue": {"Dr":0, "Cr": 0}, "novValue": {"Dr":0, "Cr": 0}, "decValue": {"Dr":0, "Cr": 0},
                "totalValue": {"Dr":0, "Cr": 0}}; // Dr - Cr
        var i,k,key, currentBalRowData, startDate, endDate, currentDate;
        if ($S.isObject(dataByCompany) && dataByCompany[accountName]) {
            for(i=0; i<monthlyData.length; i++) {
                key = monthlyData[i].key;
                startDate = DT.getDateObj(monthlyData[i]["dateRange"][0]);
                endDate = DT.getDateObj(monthlyData[i]["dateRange"][1]);
                currentBalRowData = dataByCompany[accountName].currentBalRowData;
                for(k=0; k<currentBalRowData.length; k++) {
                    if (!AccountHelper._isValidDateStr(currentBalRowData[k].date)) {
                        continue;
                    }
                    currentDate = DT.getDateObj(currentBalRowData[k].date);
                    if (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime()) {
                        if ($S.isNumeric(currentBalRowData[k].cr)) {
                            response[key]["Cr"] = AccountHelper(response[key]["Cr"] + currentBalRowData[k].cr*1).toFixed(2);
                            response["totalValue"]["Cr"] = AccountHelper(response["totalValue"]["Cr"] + currentBalRowData[k].cr*1).toFixed(2);
                        } else if ($S.isNumeric(currentBalRowData[k].dr)) {
                            response[key]["Dr"] = AccountHelper(response[key]["Dr"] + currentBalRowData[k].dr*1).toFixed(2);
                            response["totalValue"]["Dr"] = AccountHelper(response["totalValue"]["Dr"] + currentBalRowData[k].dr*1).toFixed(2);
                        }
                    }
                }
            }
        }
        return response;
    },
    _getProfitAndLossData: function(Data, year, dataByCompany, revenueConfig, cogsConfig, expenseConfig) {
        var response = {"revenue": [], "costOfSales": [], "expense": [], "grossMargin": {}, "totalProfit": {}};
        var revenueAccounts = [], cogsAccounts = [], expenseAccounts = [];
        var revenueConfigAccount = $S.isArray(revenueConfig.accounts) ? revenueConfig.accounts : [];
        var cogsConfigAccount = $S.isArray(cogsConfig.accounts) ? cogsConfig.accounts : [];
        var expenseConfigAccount = $S.isArray(expenseConfig.accounts) ? expenseConfig.accounts : [];
        var accountsData = Data.getData("accountData", []);
        var revenueTotalRowHeading = "Total sales";
        if ($S.isString(revenueConfig.totalRowHeading)) {
            revenueTotalRowHeading = revenueConfig.totalRowHeading;
        }
        var cogsTotalRowHeading = "Total cost of sales";
        if ($S.isString(cogsConfig.totalRowHeading)) {
            cogsTotalRowHeading = cogsConfig.totalRowHeading;
        }
        var expenseTotalRowHeading = "Total expenses";
        if ($S.isString(expenseConfig.totalRowHeading)) {
            expenseTotalRowHeading = expenseConfig.totalRowHeading;
        }
        var i, j;
        var accountsDataMapping = {};
        for (i=0; i<accountsData.length; i++) {
            if (!$S.isString(accountsData[i].accountName)) {
                continue;
            }
            accountsDataMapping[accountsData[i].accountName] = accountsData[i];
        }
        for(i=0; i<revenueConfigAccount.length; i++) {
            if ($S.isObject(accountsDataMapping[revenueConfigAccount[i]])) {
                revenueAccounts.push(accountsDataMapping[revenueConfigAccount[i]]);
            }
        }
        for(i=0; i<cogsConfigAccount.length; i++) {
            if ($S.isObject(accountsDataMapping[cogsConfigAccount[i]])) {
                cogsAccounts.push(accountsDataMapping[cogsConfigAccount[i]]);
            }
        }
        for(i=0; i<expenseConfigAccount.length; i++) {
            if ($S.isObject(accountsDataMapping[expenseConfigAccount[i]])) {
                expenseAccounts.push(accountsDataMapping[expenseConfigAccount[i]]);
            }
        }
        var tempData, key;
        var monthTemplate = AccountHelper.getMonthTemplate(year);
        var tempMonthTemplate = $S.clone(monthTemplate);
        tempMonthTemplate.push({"key": "totalValue"});
        function generateRowData(accountName, type) {
            var monthlyData;
            var r = {};
            monthlyData = Account._getMonthlyDataByAccountName(dataByCompany, year, accountName);
            for(j=0; j<tempMonthTemplate.length; j++) {
                key = tempMonthTemplate[j]["key"];
                if ($S.isNumber(monthlyData[key][type]) && monthlyData[key][type] > 0) {
                    r[key] = monthlyData[key][type];
                }
            }
            return r;
        }
        function generateTotalRow(arr, heading3) {
            var r = {"isTotalRow": true, "heading3": heading3};
            for(i=0; i<tempMonthTemplate.length; i++) {
                key = tempMonthTemplate[i]["key"];
                for(j=0; j<arr.length; j++) {
                    if ($S.isNumber(arr[j][key])) {
                        if ($S.isNumber(r[key])) {
                            r[key] = AccountHelper(r[key] + arr[j][key]).toFixed(2);
                        } else {
                            r[key] = arr[j][key];
                        }
                    }
                }
            }
            return r;
        }
        var revenueTotalRow, costOfSalesTotalRow, expenseTotalRow;
        for (i=0; i<revenueAccounts.length; i++) {
            tempData = generateRowData(revenueAccounts[i].accountName, "Cr");
            tempData["heading3"] = AccountHelper._getAccountDisplayName(revenueAccounts[i]);
            response.revenue.push(tempData);
        }
        revenueTotalRow = generateTotalRow(response.revenue, revenueTotalRowHeading);
        response.revenue.push(AccountHelper.makeTextBold(revenueTotalRow));
        for (i=0; i<cogsAccounts.length; i++) {
            tempData = generateRowData(cogsAccounts[i].accountName, "Dr");
            tempData["heading3"] = AccountHelper._getAccountDisplayName(cogsAccounts[i]);
            response.costOfSales.push(tempData);
        }
        costOfSalesTotalRow = generateTotalRow(response.costOfSales, cogsTotalRowHeading);
        response.costOfSales.push(AccountHelper.makeTextBold(costOfSalesTotalRow));
        for (i=0; i<expenseAccounts.length; i++) {
            tempData = generateRowData(expenseAccounts[i].accountName, "Dr");
            tempData["heading3"] = AccountHelper._getAccountDisplayName(expenseAccounts[i]);
            response.expense.push(tempData);
        }
        expenseTotalRow = generateTotalRow(response.expense, expenseTotalRowHeading);
        response.expense.push(AccountHelper.makeTextBold(expenseTotalRow));
        for(i=0; i<tempMonthTemplate.length; i++) {
            key = tempMonthTemplate[i].key;
            if ($S.isNumber(revenueTotalRow[key]) && $S.isNumber(costOfSalesTotalRow[key])) {
                response.grossMargin[key] = AccountHelper(revenueTotalRow[key] - costOfSalesTotalRow[key]).toFixed(2);
            } else if ($S.isNumber(revenueTotalRow[key])) {
                response.grossMargin[key] = revenueTotalRow[key];
            } else if (costOfSalesTotalRow[key]) {
                response.grossMargin[key] = costOfSalesTotalRow[key] * (-1);
            }
            if ($S.isNumber(response.grossMargin[key]) && $S.isNumber(expenseTotalRow[key])) {
                response.totalProfit[key] = AccountHelper(response.grossMargin[key] - expenseTotalRow[key]).toFixed(2);
            } else if ($S.isNumber(response.grossMargin[key])) {
                response.totalProfit[key] = response.grossMargin[key];
            } else if (expenseTotalRow[key]) {
                response.totalProfit[key] = expenseTotalRow[key] * (-1);
            }
        }
        return response;
    },
    getProfitAndLossFields: function(Data, dataByCompany, yearlyDateSelection, financialStatementConfig) {
        var profitAndLossFields = [], fieldsData, year;
        var revenueConfig = {}, cogsConfig = {}, expenseConfig = {};
        var incomeHeading = "Income", grossMarginHeading = "Gross Margin", totalProfitHeading = "Total profit (loss)";
        var expenseConfigHeading = "Expenses", cogsConfigHeading = "Cost of Goods Sold";
        var revenueConfigHeading = "Revenue";
        if ($S.isObject(financialStatementConfig)) {
            if ($S.isString(financialStatementConfig.incomeHeading)) {
                incomeHeading = financialStatementConfig.incomeHeading;
            }
            if ($S.isString(financialStatementConfig.grossMarginHeading)) {
                grossMarginHeading = financialStatementConfig.grossMarginHeading;
            }
            if ($S.isString(financialStatementConfig.totalProfitHeading)) {
                totalProfitHeading = financialStatementConfig.totalProfitHeading;
            }
            if ($S.isObject(financialStatementConfig["categories"])) {
                if ($S.isObject(financialStatementConfig["categories"]["revenue"])) {
                    revenueConfig = financialStatementConfig["categories"]["revenue"];
                    if ($S.isString(revenueConfig.heading)) {
                        revenueConfigHeading = revenueConfig.heading;
                    }
                }
                if ($S.isObject(financialStatementConfig["categories"]["cogs"])) {
                    cogsConfig = financialStatementConfig["categories"]["cogs"];
                    if ($S.isString(cogsConfig.heading)) {
                        cogsConfigHeading = cogsConfig.heading;
                    }
                }
                if ($S.isObject(financialStatementConfig["categories"]["expense"])) {
                    expenseConfig = financialStatementConfig["categories"]["expense"];
                    if ($S.isString(expenseConfig.heading)) {
                        expenseConfigHeading = expenseConfig.heading;
                    }
                }
            }
        }
        var i, j;
        var template1, template2, template1Data, template2Data;

        var tempMonthTemplate = AccountHelper.getMonthTemplate();
        tempMonthTemplate.push({"key": "totalValue"});
        var signCorrectionKeys = tempMonthTemplate.map(function(el, i, arr) {
            return el.key;
        });
        for(i=yearlyDateSelection.length-1; i>=0; i--) {
            year = yearlyDateSelection[i].dateHeading;
            fieldsData = Account._getProfitAndLossData(Data, year, dataByCompany, revenueConfig, cogsConfig, expenseConfig);

            template1 = Data.getTemplate("profitandloss", []);
            template1Data = {"profitandlossRow": []};

            template2 = Data.getTemplate("profitandloss1stRow", []);
            template2Data = {"heading1": year};
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            template1Data.profitandlossRow.push(template2);

            template2 = Data.getTemplate("profitandlossRow", []);
            template2Data = {"heading1": incomeHeading};
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            template1Data.profitandlossRow.push(template2);

            template2 = Data.getTemplate("profitandlossRow", []);
            template2Data = {"heading2": revenueConfigHeading};
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            template1Data.profitandlossRow.push(template2);

            if ($S.isArray(fieldsData.revenue)) {
                for (j=0; j<fieldsData.revenue.length; j++) {
                    template2 = Data.getTemplate("profitandlossRow", []);
                    TemplateHelper.setTemplateTextByFormValues(template2, fieldsData.revenue[j]);
                    template1Data.profitandlossRow.push(template2);
                }
            }

            template2 = Data.getTemplate("profitandlossRow", []);
            template2Data = {"heading2": cogsConfigHeading};
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            template1Data.profitandlossRow.push(template2);

            if ($S.isArray(fieldsData.costOfSales)) {
                for (j=0; j<fieldsData.costOfSales.length; j++) {
                    template2 = Data.getTemplate("profitandlossRow", []);
                    TemplateHelper.setTemplateTextByFormValues(template2, fieldsData.costOfSales[j]);
                    template1Data.profitandlossRow.push(template2);
                }
            }

            if ($S.isObject(fieldsData.grossMargin)) {
                fieldsData.grossMargin["heading2"] = grossMarginHeading;
                template2 = Data.getTemplate("profitandlossRow", []);
                fieldsData.grossMargin = AccountHelper.correctSignV2(fieldsData.grossMargin, signCorrectionKeys);
                TemplateHelper.setTemplateTextByFormValues(template2, AccountHelper.makeTextBold(fieldsData.grossMargin, "text-danger"));
                template1Data.profitandlossRow.push(template2);
            }

            template2 = Data.getTemplate("profitandlossRow", []);
            template2Data = {"heading1": expenseConfigHeading};
            TemplateHelper.setTemplateTextByFormValues(template2, template2Data);
            template1Data.profitandlossRow.push(template2);

            if ($S.isArray(fieldsData.expense)) {
                for (j=0; j<fieldsData.expense.length; j++) {
                    template2 = Data.getTemplate("profitandlossRow", []);
                    TemplateHelper.setTemplateTextByFormValues(template2, fieldsData.expense[j]);
                    template1Data.profitandlossRow.push(template2);
                }
            }
            if ($S.isObject(fieldsData.totalProfit)) {
                fieldsData.totalProfit["heading2"] = totalProfitHeading;
                template2 = Data.getTemplate("profitandlossRow", []);
                fieldsData.totalProfit = AccountHelper.correctSignV2(fieldsData.totalProfit, signCorrectionKeys);
                TemplateHelper.setTemplateTextByFormValues(template2, AccountHelper.makeTextBold(fieldsData.totalProfit, "text-danger"));
                template1Data.profitandlossRow.push(template2);
            }
            TemplateHelper.setTemplateTextByFormValues(template1, template1Data);
            profitAndLossFields.push(template1);
        }
        if (profitAndLossFields.length === 0) {
            profitAndLossFields.push(Data.getTemplate("noDataFound", {}));
        }
        return profitAndLossFields;
    }
});

AccountHelper2 = Account;
})($S);

export default AccountHelper2;

