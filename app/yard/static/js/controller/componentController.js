(function(window, $M) {
$M.enableProcessingCount();
$M.extend({
    "S1-RECR": function(name) {
        var newValue = 0;
        if ($M.isDown("S1-HR")) {
            newValue = 1;
        }
        $M.setValue(name, newValue);
    },
    documentLoaded: function() {
        var possibleValues = $M.getPossibleValuesFromComponentModel();
        var currentValues = $M.getCurrentValuesFromComponentModel();
        $M().setPossibleValues(possibleValues);
        $M().initializeCurrentValues(currentValues);
        var allExpressions = [], exps = {};
        allExpressions.push($M.getSignalExpressionsFromComponentModel());
        allExpressions.push($M.getPointExpressionsFromComponentModel());
        for (var i = 0; i < allExpressions.length; i++) {
            exps = allExpressions[i];
            for (var key in exps) {
                if ($M.isArray(exps[key])) {
                    for (var j = 0; j < exps[key].length; j++) {
                        if ($M.isObject(exps[key][j])) {
                            $M(key).addExp($M.generateExpression(exps[key][j]));
                        } else {
                            $M(key).addExp(exps[key][j]);
                        }
                    }
                } else if ($M.isObject(exps[key])) {
                    $M(key).addExp($M.generateExpression(exps[key]));
                }
            }
        }
        // $M("S4-NNR").addDebug();
        return 0;
    }
});
$M.extend({
    "setValueChangedCallback": function(name, oldValue, newValue) {
        return $M.reCheckAllValues();
    }
});
})(window, $M);
