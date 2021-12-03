(function(window, $S) {

/**
 * Steps
 * 1) getTokenRequest
 * 2) DSC/ListToken from step1 response
 * 3) getTokenData from step2 response --> select Token
 * 4) getCertificateEncryptData from step3 tokenName: mToken-IN<actualId>(mToken CryptoID)
 * 5) DSC/ListCertificate from step1 response
 * 6) getCertificate from step5 response --> Select sertificate and enter password
 * 7) getSignedPdf
 *      - filePath: <pdfFilePath>
 *      - tokenName: same as step 4
 *      - password: Entered in step 6
 *      - key: <key>
 *      - certificateName: Selected in step 6
 * 8) DSC/PKCSBulkSign
 * 9) generatetSignedPdf
 * */

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
        if ($S.isObject(tokenRequest)) {
            this.ListToken(tokenRequest.encryptionKeyID, tokenRequest.encryptedData, callback);
        } else {
            $S.callMethod(callback);
        }
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
        if ($S.isObject(tokenRequest)) {
            this.ListCertificate(tokenRequest.encryptionKeyID, tokenRequest.encryptedData, callback);
        } else {
            $S.callMethod(callback);
        }
    },
    PkcsSign: function() {
    },
    PkcBulkSign: function() {

    }
});

window.$EMadhura = EMadhura;

})(window, $S);
