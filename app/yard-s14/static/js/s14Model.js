(function($M) {
$M.extend({
    setValueChangedCallback: function(key, oldValue, newValue) {
        $M.reCheckAllValues();
        return 0;
    }
});
})($M);
