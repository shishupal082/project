import $S from "../../interface/stack.js";
// import Api from "../../common/Api";
import Config from "./Config";

var PageData;

(function($S){
var CurrentFormData = $S.getDataObj();
var keys = ["upload_file.file"];
keys.push("page");
CurrentFormData.setKeys(keys);

PageData = function(arg) {
    return new PageData.fn.init(arg);
};

PageData.fn = PageData.prototype = {
    constructor: PageData,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(PageData);

PageData.extend({
    setData: function(key, value) {
        return CurrentFormData.setData(key, value);
    }
});
PageData.extend({
    handleInputChange: function(e) {
        var currentTarget = e.currentTarget;
        var fieldName = currentTarget.name;
        if (fieldName === "upload_file.file") {
            var file = currentTarget.files[0];
            CurrentFormData.setData(fieldName, file, true);
        }
    }
});
PageData.extend({
    handleFormSubmit: function(e, Data, callBack) {
        var pageName = CurrentFormData.getData("page");
        var url = Config.apiMapping[pageName];
        if ($S.isString(url)) {
            if (pageName === "upload_file") {
                var formData = new FormData();
                formData.append("file", CurrentFormData.getData("upload_file.file", {}, true));
                $S.uploadFile(Config.JQ, url, formData, function(ajax, status, response) {
                    console.log(response);
                    if (status === "FAILURE") {
                        alert("Error in uploading file, Try again.");
                    } else {
                        PageData.handleApiResponse(Data, callBack, pageName, ajax, response);
                    }
                });
            }
        }
    }
});
PageData.extend({
    handleApiResponse: function(Data, callBack, pageName, ajax, response) {
        // var template;
        if (pageName === "upload_file") {
            if (response.status === "FAILURE") {
                alert(Config.getAleartMessage(response.failureCode));
            } else {
                alert("File saved as: " + response.data.fileName);
                Config.location.href = "/dashboard";
            }
        }
    }
});
})($S);

export default PageData;
