(function($M) {
$M.extend({
    setValueChangedCallback: function(key, oldValue, newValue, callback) {
        $M.reCheckAllValues(callback);
        return 0;
    }
});
})($M);
