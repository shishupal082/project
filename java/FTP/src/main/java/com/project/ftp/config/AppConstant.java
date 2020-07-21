package com.project.ftp.config;

public class AppConstant {
    public static final String X_SESSION_ID = "X-Session-Id";
    public static final String X_REQUEST_ID = "X-Request-Id";
    public static final String COOKIE_NAME = "ftp-cookie";
    public static final String SESSION_COOKIE_DATA = "SESSION_COOKIE_DATA";
    public static final Long SESSION_TTL = (long) (10*60*1000); // 10min = 10*60*1000 ms
    public static final int ALLOWED_PASS_CHANGE_COUNT = 5;
    public static final String STATUS = "STATUS";
    public static final String SUCCESS = "SUCCESS";
    public static final String FAILURE = "FAILURE";
    public static final String REASON = "REASON";
    public static final String RESPONSE = "RESPONSE";
    public static final String ContentType = "Content-Type";
    public static final String ALLOWED_ACCESS= "Access-Control-Allow-Origin";
    public static final String ALLOWED_HEADERS= "Access-Control-Allow-Headers";
    public static final String FILE = "FILE";
    public static final String FOLDER = "FOLDER";
    public static final String AppVersion = "1.0.1";
    public static final String server = "server";
    public static final String DateTimeFormat = "YYYYMMdd'T'HHmmssSSS";
    public static final String DateTimeFormat2 = "YYYY-MM-dd'-'HH-mm-ss-SSS";
    public static final String DateTimeFormat3 = " YYYY-MM-dd' 'HH:mm";
    public static final String FileFormate = "YYYY-MM-dd'-'HH-mm-ss-SSS";
    public static final String UTF8 = "UTF-8";
    public static final String FAVICON_ICO_PATH = "favicon.ico";
    public static final String APP_STATIC_DATA_FILENAME = "app_static_data.json";
    public static final String USER_DATA_FILENAME = "user_data.csv";
    public static final String APP_VIEW_FTL_FILENAME = "app_view-1.0.0.ftl";
    public static final String INDEX_PAGE_RE_ROUTE = "/dashboard";
    public static final String ORIGIN = "origin";
    public static final String PUBLIC = "public";
    public static final String PdfAuther = "Project Author";
    public static final String PdfCreator = "Project Creator";
    public static final String EmptyParagraph = " ";
}
