import $S from '../../interface/stack.js';
var AccountHelper2;

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

AccountHelper2 = Account;
})($S);

export default AccountHelper2;

