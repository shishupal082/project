const $S = require("../../static/js/stack.js");
const $M = require("../../reactjs/reactapp/src/libs/nodejs/modelV2.js");
const Logger = require("../static/logger.js");
const File = require("../static/apis/file.js");

const FS = require("../static/fsmodule.js");

$M().setBinaryOperators(["*","+","~"]);
$M.changeSetValueCountLimit(5000);
$M.enableUpdateBinaryValue();
var DbConnection = null;
var tempCount = 0;

(function() {
var Script = function(config) {
    return new Script.fn.init(config);
};
Script.fn = Script.prototype = {
    constructor: Script,
    init: function(config) {
        return this;
    }
};
Script.fn.init.prototype = Script.fn;
$S.extendObject(Script);

$M.extend({
    setValueChangedCallback: function(key, newValue, oldValue, callback) {
        DbConnection.updateResult(function() {
            // console.log($M.getBinaryPossibleValue());
            $S.callMethod(callback);
        }, $M.getBinaryPossibleValue());
        return 0;
    },
    timerBitChange: function(key, newValue, oldValue, pendingTimerBits) {
        tempCount++;
        console.log("Timer bit change: " + tempCount + ", pendingTimerBitsCount: " + pendingTimerBits.length);
    }
});

var InitialValues = {};
var TimerBits = {};
var PossibleValues = [];
var InputKeys = [];
var AllExpressions = [];
var ExpressionsAdded = [];

var response = "";

function addExp(key, exp) {
    return $M(key).addExp(exp);
}
function expressionLoadComplete() {
    var allExpressions = AllExpressions, exps;
    for (var i = 0; i < allExpressions.length; i++) {
        exps = allExpressions[i];
        for (var key in exps) {
            if (ExpressionsAdded.indexOf(key) < 0) {
                ExpressionsAdded.push(key);
            } else {
                $S.log("Expressions for '" + key + "' already added.");
            }
            if ($M.isArray(exps[key])) {
                for (var j = 0; j < exps[key].length; j++) {
                    if ($M.isObject(exps[key][j])) {
                        addExp(key, $M.generateExpression(exps[key][j]));
                        // $M(key).addExp($M.generateExpression(exps[key][j]));
                    } else {
                        addExp(key, exps[key][j]);
                        // $M(key).addExp(exps[key][j]);
                    }
                }
            } else if ($M.isObject(exps[key])) {
                addExp(key, $M.generateExpression(exps[key]));
                // $M(key).addExp($M.generateExpression(exps[key]));
            }
        }
    }
}


Script.extend({
    getCurrentValues: function() {
        return $M.getCurrentValues();
    },
    startCheckingBits: function() {
        $M.reCheckAllValues(function() {
            var pendingTimer = $M.getPendingTimerBits();
            if (pendingTimer.length === 0) {
                console.log("Rechecking complete: pending timer: 0");
                Script.startCheckingBits();
            } else {
                console.log("Rechecking complete: pending timer: ");
                console.log(pendingTimer);
            }
        });
    },
    dataLoadComplete: function() {
        if ($S.isString(response)) {
            var t = response.split("\n");
            var temp = {}, t2;
            for (var j=0; j<t.length; j++) {
                if (!$S.isStringV2(t[j])) {
                    continue;
                }
                t[j] = t[j].split(" ").join("");
                t[j] = t[j].split("\r").join("");
                t2 = t[j].split("=");
                if (t2.length != 2) {
                    console.log("Invalid expression: " + t[j]);
                    continue;
                }
                if (temp[t2[0]]) {
                    // console.log("Duplicate entry: " + t[j] + ":::" + temp[t2[0]]);
                    continue;
                }
                temp[t2[0]] = [t2[1]];
            }
        }
        if ($M.isObject(temp)) {
            AllExpressions.push(temp);
        }
        $M().setPossibleKeys(PossibleValues);
        $M().setInputKeys(InputKeys);
        $M().setTimerBits(TimerBits);
        $M().setCurrentValues(InitialValues);
        Logger.log("Expression generation start...");
        expressionLoadComplete();
        $M.setVariableDependencies();
        Logger.log("Expression generation complete!");
        Script.startCheckingBits();
    },
    start: function(dbConnection) {
        DbConnection = dbConnection;
        var f1 = File.getFile("/pvt/app-data/ml2/ml2_s05/s05_expression.txt");
        var f2 = File.getFile("/app/yard_s05/data/items.json");
        var f3 = File.getFile("/app/yard_s05/data/initial-value.json");
        var f4 = File.getFile("/app/yard_s05/data/timer_bits.json");
        FS.readTextFile(f1.getPath(), "", function(textData) {
            response = textData;
            FS.readJsonFile(f2.getPath(), {}, function(jsonData1) {
                if ($S.isObject(jsonData1)) {
                    if ($S.isArray(jsonData1["all_bits"])) {
                        PossibleValues = jsonData1["all_bits"];
                    }
                    if ($S.isArray(jsonData1["input_bits"])) {
                        InputKeys = jsonData1["input_bits"];
                    }
                }
                FS.readJsonFile(f3.getPath(), {}, function(jsonData2) {
                    InitialValues = jsonData2;
                    FS.readJsonFile(f4.getPath(), {}, function(jsonData3) {
                        TimerBits = jsonData3;
                        Logger.log("File loading complete!");
                        Script.dataLoadComplete();
                    });
                });
            });
        });
    }
});

module.exports = Script;
})();
