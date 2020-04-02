(function(global, $M) {
var LoggerInfo = $M.getScriptFileNameRef();
var RoutingModel = function(config) {
    return new RoutingModel.fn.init(config);
};
RoutingModel.fn = RoutingModel.prototype = {
    constructor: RoutingModel,
    init: function(config) {
        this.config = config;
        return this;
    }
};
ExtendObject(RoutingModel);

var possibleValues = [], exps = {};

/*
U2-19-13-WFR => 1D-E1-ASR||U2-19-14-CWKR
U2-19-14-WFR => 1D-E1-ASR||U2-19-13-CWKR
U1-12-25-WFR => 1D-E2-ASR||U1-12-26-CWKR
U1-12-26-WFR => 1D-E2-ASR||U1-12-25-CWKR
U2-25-13-WFR => 1D-E2-ASR||U1-12-26-CWKR&&U2-26-14-CWKR
U2-25-14-WFR => 1D-E2-ASR||U1-12-26-CWKR&&U2-26-13-CWKR
U2-26-13-WFR => 1D-E2-ASR||U1-12-25-CWKR&&U2-25-14-CWKR
U2-26-14-WFR => 1D-E2-ASR||U1-12-25-CWKR&&U2-25-13-CWKR
*/
var pointsExp = {
    "U2-19-13-WFR": ["(1D-E1-ASR||U2-19-14-CWKR)"],
    "U2-19-14-WFR": ["(1D-E1-ASR||U2-19-13-CWKR)"],
    "U1-12-25-WFR": ["(1D-E2-ASR||U1-12-26-CWKR)"],
    "U1-12-26-WFR": ["(1D-E2-ASR||U1-12-25-CWKR)"],
    "U2-25-13-WFR": ["(1D-E2-ASR||(U1-12-26-CWKR&&U2-26-14-CWKR)"],
    "U2-25-14-WFR": ["(1D-E2-ASR||(U1-12-26-CWKR&&U2-26-13-CWKR)"],
    "U2-26-13-WFR": ["(1D-E2-ASR||(U1-12-25-CWKR&&U2-25-14-CWKR)"],
    "U2-26-14-WFR": ["(1D-E2-ASR||(U1-12-25-CWKR&&U2-25-13-CWKR)"]
};
var pointLockExp = {
    "1D-1-2": ["(~1D-E1-ASR&&(U2-19-13-CWKR||U2-19-14-CWKR))"],
    "1D-1-3": ["(~1D-E1-ASR&&U2-19-13-CWKR)"],
    "1D-1-4": ["(~1D-E1-ASR&&U2-19-13-CWKR)"],
    "1D-1-5": ["(~1D-E1-ASR&&U2-19-13-CWKR)"],
    "1D-1-6": ["(~1D-E1-ASR&&U2-19-13-CWKR)"],
    "1D-2-1": ["(~1D-E2-ASR&&(U1-12-26-CWKR||U1-12-25-CWKR))"],
    "1D-1-7": ["((~1D-E1-ASR&&U2-19-13-CWKR)||(~1D-E2-ASR&&(U2-25-13-CWKR||U2-26-13-CWKR)))"],
    "1D-2-5": ["(~1D-E1-ASR&&U2-19-14-CWKR)"],
    "1D-2-6": ["(~1D-E1-ASR&&U2-19-14-CWKR)"],
    "1D-2-7": ["(~1D-E1-ASR&&U2-19-14-CWKR)"],
    "1D-2-8": {
        "op": "||",
        "val": ["(~1D-E1-ASR&&U2-19-14-CWKR)",
                "(~1D-E2-ASR&&(U2-26-13-CWKR||U2-25-13-CWKR))"],
    },
    "1D-2-9": ["((~1D-E1-ASR&&U2-19-14-CWKR)||(~1D-E2-ASR&&(U2-25-14-CWKR||U2-26-14-CWKR)))"],
    "1D-3-2": ["(~1D-E2-ASR&&(U1-12-25-CWKR||U1-12-26-CWKR))"],
    "1D-3-3": ["(~1D-E2-ASR&&U1-12-25-CWKR)"],
    "1D-3-4": ["(~1D-E2-ASR&&U1-12-25-CWKR)"],
    "1D-3-5": ["(~1D-E2-ASR&&U1-12-25-CWKR)"],
    "1D-3-6": ["(~1D-E2-ASR&&(U2-25-14-CWKR||U2-26-13-CWKR||U2-25-13-CWKR))"],
    "1D-3-7": ["(~1D-E2-ASR&&(U2-25-14-CWKR||U2-26-14-CWKR))"],
    "1D-4-3": ["(~1D-E2-ASR&&U1-12-26-CWKR)"],
    "1D-4-4": ["(~1D-E2-ASR&&U1-12-26-CWKR)"],
    "1D-4-5": ["(~1D-E2-ASR&&U1-12-26-CWKR)"],
    "1D-4-6": ["(~1D-E2-ASR&&U2-26-14-CWKR)"]
};
/*
-----------------------------------------------------------------------
*/
var possibleValues = [], expsV2 = {}, ignoreRecheckPossibleValues = [];
var i1DCommon = ["1D-E1","1D-E2","1D-U1","1D-U2","1D-25","1D-26"];
var i1D = ["1D-E1-U1-NNR","1D-E1-U2-NNR",
            "1D-E1-U1-NRR","1D-E1-U2-NRR",
            "1D-E2-U1-25-NNR","1D-E2-U1-26-NNR","1D-E2-U2-25-NNR","1D-E2-U2-26-NNR",
            "1D-E2-U1-25-NRR","1D-E2-U1-26-NRR","1D-E2-U2-25-NRR","1D-E2-U2-26-NRR",
            "1D-E1-HR","1D-E2-HR",
            "1D-E1-ASR","1D-E2-ASR",
            "1D-E1-UCR","1D-E2-UCR"];
var localPoints = ["1D-1-2","1D-1-3","1D-1-4","1D-1-5","1D-1-6","1D-1-7",
                "1D-2-1", "1D-2-2","1D-2-3","1D-2-4","1D-2-5","1D-2-6","1D-2-7","1D-2-8","1D-2-9",
                "1D-3-1", "1D-3-2","1D-3-3","1D-3-4","1D-3-5","1D-3-6","1D-3-7","1D-3-8",
                "1D-4-1", "1D-4-2","1D-4-3","1D-4-4","1D-4-5","1D-4-6","1D-4-7","1D-4-8"];

var currentValues = {
    "1D-E1-ASR":1,
    "1D-E2-ASR":1,
    // "U2-19-13-WCKR": 1
};
var asrExp = {
    "1D-E1-ASR": ["~1D-E1-UCR"],
    "1D-E2-ASR": ["~1D-E2-UCR"]
};
var ucrExp = {
    "1D-E1-UCR": [
        "((1D-E1-U1-NRR&&U2-19-13-CWKR)||(1D-E1-U2-NRR&&U2-19-14-CWKR))"
    ],
    "1D-E2-UCR": {
        "op": "||",
        "val": [
            "(1D-E2-U1-25-NRR&&(U1-12-25-CWKR&&U2-25-13-CWKR))",
            "(1D-E2-U1-26-NRR&&(U1-12-26-CWKR&&U2-26-13-CWKR))",
            "(1D-E2-U2-25-NRR&&(U1-12-25-CWKR&&U2-25-14-CWKR))",
            "(1D-E2-U2-26-NRR&&(U1-12-26-CWKR&&U2-26-14-CWKR))"
        ]
    }
};
var hrExp = {
    "1D-E1-HR": ["(~1D-E1-ASR&&1D-E1-UCR)",
                "((1D-E1-U1-NRR&&U2-19-13-CWKR)||(1D-E1-U2-NRR&&U2-19-14-CWKR))",
                "(~1D-E1||1D-E1-HR)"],
    "1D-E2-HR": ["(~1D-E2-ASR&&1D-E2-UCR)",
                {
                    "op": "||",
                    "val": [
                        "(1D-E2-U1-25-NRR&&(U1-12-25-CWKR&&U2-25-13-CWKR))",
                        "(1D-E2-U1-26-NRR&&(U1-12-26-CWKR&&U2-26-13-CWKR))",
                        "(1D-E2-U2-25-NRR&&(U1-12-25-CWKR&&U2-25-14-CWKR))",
                        "(1D-E2-U2-26-NRR&&(U1-12-26-CWKR&&U2-26-14-CWKR))"
                    ]
                },
                "(~1D-E2||1D-E2-HR)"
            ]
};
var nnrExp = {
    "1D-E1-U1-NNR": ["(~1D-E1-U1-NRR&&(1D-E1-U1-NNR||1D-E1-ASR))"],
    "1D-E1-U2-NNR": ["(~1D-E1-U2-NRR&&(1D-E1-U2-NNR||1D-E1-ASR))"],
    "1D-E2-U1-25-NNR": ["(~1D-E2-U1-25-NRR&&(1D-E2-U1-25-NNR||1D-E2-ASR))"],
    "1D-E2-U1-26-NNR": ["(~1D-E2-U1-26-NRR&&(1D-E2-U1-26-NNR||1D-E2-ASR))"],
    "1D-E2-U2-25-NNR": ["(~1D-E2-U2-25-NRR&&(1D-E2-U2-25-NNR||1D-E2-ASR))"],
    "1D-E2-U2-26-NNR": ["(~1D-E2-U2-26-NRR&&(1D-E2-U2-26-NNR||1D-E2-ASR))"]
};
var nrrExp = {
    "1D-E1-U1-NRR": [
        "1D-E1-U2-NNR","1D-E2-U1-25-NNR","1D-E2-U1-26-NNR",
        "(1D-E1-U1-NRR||((1D-E1&&1D-U1)&&1D-E1-ASR))"
    ],
    "1D-E1-U2-NRR": [
        "1D-E1-U1-NNR","1D-E2-U2-25-NNR","1D-E2-U2-26-NNR",
        "(1D-E1-U2-NRR||((1D-E1&&1D-U2)&&1D-E1-ASR))"
    ],
    "1D-E2-U1-25-NRR": [
        "1D-E2-U1-26-NNR","1D-E2-U2-25-NNR","1D-E2-U2-26-NNR",
        "1D-E1-U1-NNR",
        "(1D-E2-U1-25-NRR||((1D-E2&&1D-U1&&1D-25)&&1D-E2-ASR))"
    ],
    "1D-E2-U1-26-NRR": [
        "1D-E2-U1-25-NNR","1D-E2-U2-25-NNR","1D-E2-U2-26-NNR",
        "1D-E1-U1-NNR",
        "(1D-E2-U1-26-NRR||((1D-E2&&1D-U1&&1D-26)&&1D-E2-ASR))"
    ],
    "1D-E2-U2-25-NRR": [
        "1D-E2-U1-25-NNR","1D-E2-U1-26-NNR","1D-E2-U2-26-NNR",
        "1D-E1-U2-NNR",
        "(1D-E2-U2-25-NRR||((1D-E2&&1D-U2&&1D-25)&&1D-E2-ASR))"
    ],
    "1D-E2-U2-26-NRR": [
        "1D-E2-U1-25-NNR","1D-E2-U1-26-NNR","1D-E2-U2-25-NNR",
        "1D-E1-U2-NNR",
        "(1D-E2-U2-26-NRR||((1D-E2&&1D-U2&&1D-26)&&1D-E2-ASR))"
    ]
};

possibleValues = possibleValues.concat(i1D);
possibleValues = possibleValues.concat(i1DCommon);
possibleValues = possibleValues.concat(localPoints);
// ignoreRecheckPossibleValues = ignoreRecheckPossibleValues.concat(i1DIgorableChecking);
// ignoreRecheckPossibleValues = ignoreRecheckPossibleValues.concat(localPoints);
Object.assign(expsV2, asrExp);
Object.assign(expsV2, nnrExp);
Object.assign(expsV2, nrrExp);
Object.assign(expsV2, ucrExp);
Object.assign(expsV2, hrExp);

RoutingModel.extend({
    getPointExpressions: function() {
        return exps;
    },
    getPointLockExpressions: function() {
        return pointLockExp;
    },
    getPossibleValuesLocal: function(name) {
        return possibleValues;
    },
    getCurrentValuesLocal: function() {
        return currentValues;
    },
    getExpressionsLocal: function() {
        return expsV2;
    }
});

RoutingModel.extend({
    getPossibleValues: function(callBack) {
        var ajax = {};
        ajax.type = "json";
        ajax.url = "/pvt/app-data/routing/json/pointPossibleValues.json";
        ajax.dataType = "json";
        $.ajax({url: ajax.url,
            success: function(response, textStatus) {
                if (response && response.length) {
                    callBack(response);
                } else {
                    callBack([]);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error in loading pointPossibleValues...");
                callBack([]);
            }
        });
        return [];
    },
    getCurrentValues: function(callBack) {
        var ajax = {};
        ajax.type = "json";
        ajax.url = "/pvt/app-data/routing/json/currentValues.json";
        ajax.dataType = "json";
        $.ajax({url: ajax.url,
            success: function(response, textStatus) {
                if (response) {
                    callBack(response);
                } else {
                    callBack({});
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error in loading currentValues...");
                callBack({});
            }
        });
        return {};
    },
    getExpressions: function(callBack) {
        var ajax = {};
        ajax.type = "json";
        ajax.url = "/pvt/app-data/routing/json/pointExpression.json";
        ajax.dataType = "json";
        $.ajax({url: ajax.url,
            success: function(response, textStatus) {
                if ($M.isObject(response)) {
                    callBack(response);
                } else {
                    callBack({});
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error in loading pointExpression...");
                callBack({});
            }
        });
        return {};
    }
});

window.$RM = RoutingModel;

})(window, $M);
