(function(window, $M) {
// Can programmed
// NWLR/RWLR (with WFK) (3)
// NCR,RCR,WNKR,WRKR,NWKR,RWKR (6)
// ASWR (1)
// Can be programmed with partially (i.e. set of NRR required as input)
// NLR,RLR (2)
// WNR (1)
/**
CWKR, OWKR  --
WCKR, WOKR  --
CWLR, OWLR  --
CLR, OLR    --
CCR, OCR    --
ASWR        --
WFR         --
WNR
**/
var addExpression = {
    "CLR": function(pName, requiredInClose, requiredInOpen) {
        var val = [];
        var requiredInCloseVal = [];
        if (requiredInClose && requiredInClose.length) {
            for (var i = 0; i < requiredInClose.length; i++) {
                requiredInCloseVal.push("(~"+requiredInClose[i]+"-NNR&&"+requiredInClose[i]+"-NRR)");
            }
        }
        val.push({"op":"||", "val": requiredInCloseVal});
        if (requiredInOpen && requiredInOpen.length) {
            for (var i = 0; i < requiredInOpen.length; i++) {
                val.push("~"+requiredInOpen[i]+"-NRR");
            }
        }
        val.push("(~"+pName+"-CWKR&&~"+pName+"-OLR)");
        var e1 = {
            "op": "&&",
            "val": val
        };
        var exp = $M.generateExpression(e1);
        $M(pName+"-CLR").addExp(exp);
    },
    "OLR": function(pName, requiredInOpen, requiredInClose) {
        var val = [], requiredInOpenVal = [];
        if (requiredInOpen && requiredInOpen.length) {
            for (var i = 0; i < requiredInOpen.length; i++) {
                requiredInOpenVal.push("(~"+requiredInOpen[i]+"-NNR&&"+requiredInOpen[i]+"-NRR)");
            }
        }
        val.push({"op":"||", "val": requiredInOpenVal});
        if (requiredInClose && requiredInClose.length) {
            for (var i = 0; i < requiredInClose.length; i++) {
                val.push("~"+requiredInClose[i]+"-NRR");
            }
        }
        val.push("(~"+pName+"-OWKR&&~"+pName+"-CLR)");
        var e1 = {
            "op": "&&",
            "val": val
        };
        var exp = $M.generateExpression(e1);
        $M(pName+"-OLR").addExp(exp);
    }
};
function setValueFromPointName(pName) {
    var options = {
        "U1-12-25": {
            requiredInClose: ["1D-E2-U1-25","1D-E2-U2-25"],
            requiredInOpen: ["1D-E2-U1-26","1D-E2-U2-26"]
        },
        "U1-12-26": {
            requiredInClose: ["1D-E2-U1-26","1D-E2-U2-26"],
            requiredInOpen: ["1D-E2-U1-25","1D-E2-U2-25"]
        },
        "U2-19-13" : {
            requiredInClose: ["1D-E1-U1"],
            requiredInOpen: ["1D-E1-U2"]
        },
        "U2-19-14" : {
            requiredInClose: ["1D-E1-U2"],
            requiredInOpen: ["1D-E1-U1"]
        },
        "U2-25-13": {
            requiredInClose: ["1D-E2-U1-25"],
            requiredInOpen: ["1D-E2-U2-25", "1D-E1-U1"]
        },
        "U2-26-13": {
            requiredInClose: ["1D-E2-U1-26"],
            requiredInOpen: ["1D-E2-U2-26", "1D-E1-U1"]
        },
        "U2-25-14": {
            requiredInClose: ["1D-E2-U2-25"],
            requiredInOpen: ["1D-E2-U1-25", "1D-E1-U2"]
        },
        "U2-26-14": {
            requiredInClose: ["1D-E2-U2-26"],
            requiredInOpen: ["1D-E2-U1-25", "1D-E1-U2"]
        }
    };
    if (options[pName]) {
        addExpression["CLR"](pName, options[pName].requiredInClose, options[pName].requiredInOpen);
        addExpression["OLR"](pName, options[pName].requiredInOpen, options[pName].requiredInClose);
    }
}
$M.extend({
    setPointVariables: function(pName, pVariable) {
        if (["CLR"].indexOf(pVariable) >= 0) {
            setValueFromPointName(pName);
        }
    }
});
})(window, $M);
