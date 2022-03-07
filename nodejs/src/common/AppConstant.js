const AppConstant = {
    VERSION: "1.0.2",
    CONTENT_TYPE: "Content-Type",
    APPLICATION_JSON: "application/json",
    TEXT_JS: "application/javascript",
    TEXT_HTML: "text/html",
    TEXT_CSS: "text/css",
    TEXT_XML: "text/xml",
    TEXT_PLAIN: "text/plain",
    TEXT_CSV: "text/plain",
    IMAGE_PNG: "image/png",
    IMAGE_X_ICON: "image/x-icon",
    IMAGE_JPG: "image/jpg",
    IMAGE_JPEG: "image/jpeg",
    PUBLIC_DIR: __dirname,
    UNDEFINED: undefined
};

AppConstant["fileMediaType"] = {
    ".html": AppConstant.TEXT_HTML,
    ".svg": AppConstant.TEXT_XML,
    ".csv": AppConstant.TEXT_CSV,
    ".js": AppConstant.TEXT_JS,
    ".css": AppConstant.TEXT_CSS,
    ".json": AppConstant.APPLICATION_JSON,
    ".ico": AppConstant.IMAGE_X_ICON,
    ".jpg": AppConstant.IMAGE_JPG,
    ".png": AppConstant.IMAGE_PNG,
    ".jpeg": AppConstant.IMAGE_JPEG
};
module.exports = AppConstant;


/**

The most common type are:

Type application
----------------
application/java-archive
application/EDI-X12   
application/EDIFACT   
application/javascript             ---------------
application/octet-stream   
application/ogg   
application/pdf  
application/xhtml+xml   
application/x-shockwave-flash    
application/json                    ---------------
application/ld+json  
application/xml   
application/zip  
application/x-www-form-urlencoded  


Type audio
----------------
audio/mpeg   
audio/x-ms-wma   
audio/vnd.rn-realaudio   
audio/x-wav   

Type image
----------------
image/gif   
image/jpeg   
image/png   
image/tiff    
image/vnd.microsoft.icon    
image/x-icon                       ------------------
image/vnd.djvu   
image/svg+xml    

Type multipart
----------------
multipart/mixed    
multipart/alternative   
multipart/related (using by MHTML (HTML mail).)  
multipart/form-data  


Type text
----------------
text/css    
text/csv    
text/html                 ---------------
text/javascript (obsolete)    
text/plain    
text/xml                  ---------------

Type video
----------------
video/mpeg    
video/mp4    
video/quicktime    
video/x-ms-wmv    
video/x-msvideo    
video/x-flv   
video/webm   


Type vnd :
----------------
application/vnd.android.package-archive
application/vnd.oasis.opendocument.text    
application/vnd.oasis.opendocument.spreadsheet  
application/vnd.oasis.opendocument.presentation   
application/vnd.oasis.opendocument.graphics   
application/vnd.ms-excel    
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet   
application/vnd.ms-powerpoint    
application/vnd.openxmlformats-officedocument.presentationml.presentation    
application/msword   
application/vnd.openxmlformats-officedocument.wordprocessingml.document   
application/vnd.mozilla.xul+xml  

*/