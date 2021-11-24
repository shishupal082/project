(function(window, $S) {

var baseUrl = "https://localhost.emudhra.com:26769";
var path = {
    ListToken: "/DSC/ListToken",
    ListCertificate: "/DSC/ListCertificate",
    PkcBulkSign: "/DSC/PKCSBulkSign",
    PkcsSign: "/DSC/PKCSSign"
};
var accessControlHeader = {
    "AppID": "", //Provide App ID for Request Reference
    "Access-Control-Allow-Origin": "*",
    "X-Requested-With": "XMLHttpRequest"
};

var EMadhura = function(fileData, context) {
    return new EMadhura.fn.init(fileData, context);
};

EMadhura.fn = EMadhura.prototype = {
    constructor: EMadhura,
    init: function(fileData, context) {
        return this;
    }
};

$S.extendObject(EMadhura);

EMadhura.extend({
    ListToken: function(encryptionKeyID, encryptedRequest , callback) {
        var data = {"encryptedRequest": encryptedRequest, encryptionKeyID: encryptionKeyID};
        $S.sendPostRequest($, baseUrl + path.ListToken, data, function(req, status, res) {
            console.log(req);
            console.log(status);
            console.log(res);
        });
    },
    ListTokenV2: function(tokenRequest, callback) {
        this.ListToken(tokenRequest.encryptionKeyID, tokenRequest.encryptedData, callback);
    },
    ListCertificate: function(encryptionKeyID, encryptedRequest , callback) {
        var data = {"encryptedRequest": encryptedRequest, encryptionKeyID: encryptionKeyID};
        $S.sendPostRequest($, baseUrl + path.ListCertificate, data, function(req, status, res) {
            console.log(req);
            console.log(status);
            console.log(res);
        });
    },
    ListCertificateV2: function(tokenRequest, callback) {
        this.ListCertificate(tokenRequest.encryptionKeyID, tokenRequest.encryptedData, callback);
    },
    PkcsSign: function() {
    },
    PkcBulkSign: function() {

    }
});

window.$EMadhura = EMadhura;

})(window, $S);
