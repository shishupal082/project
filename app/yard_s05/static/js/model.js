(function($M) {
$M.extend({
    setValueChangedCallback: function(key, oldValue, newValue, callback) {
        // $M.reCheckAllValues(callback);
        $M.addInMStack($M.getVariableDependenciesByKey(key));
        $M.reCheckAllValuesV2(callback);
        return 0;
    }
});
})($M);
