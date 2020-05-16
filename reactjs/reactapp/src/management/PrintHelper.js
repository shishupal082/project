import $S from "../interface/stack.js";
var PrintHelper;
(function($S) {
var UserData = {};
var RowData = [];
var Print = function(formValues) {
    return new Print.fn.init(formValues);
};
Print.fn = Print.prototype = {
    constructor: Print,
    init: function(formValues) {
        this.formValues = formValues;
        return this;
    }
};
$S.extendObject(Print);
Print.extend({
    setUserData: function() {
        if ($S.isArray(this.formValues) && this.formValues.length) {
            UserData = this.formValues[0];
        }
        return true;
    },
    getDetails: function(print) {
        return {userData: UserData, rowData: RowData};
    }
});
PrintHelper = Print;
})($S);
export default PrintHelper;
