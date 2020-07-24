package com.project.ftp.exceptions;

/**
 * Created by shishupalkumar on 10/02/17.
 */

public enum ErrorCodes {
    REDIRECTION_ERROR("REDIRECTION_ERROR", "Routing error", 300),
    UNABLE_TO_PARSE_JSON("Unable to parse Json", "Unable to parse Json", 400),
    BAD_REQUEST_ERROR("BAD_REQUEST_ERROR", "Bad request error", 401),
    UNAUTHORIZED_ORIGIN("UNAUTHORIZED_ORIGIN", "UnAuthorized Origin", 401),
    UNAUTHORIZED_USER("UNAUTHORIZED_USER", "UnAuthorized Access", 401),
    FILE_NOT_FOUND("FILE_NOT_FOUND", "File not found", 402),
    INVALID_QUERY_PARAMS("Invalid query params", "Invalid query params", 403),
    INVALID_SESSION("INVALID_SESSION", "Invalid session", 403),
    INVALID_USER_NAME("INVALID_USER_NAME", "Invalid user name", 403),
    // Login, Register
    USER_NAME_REQUIRED("USER_NAME_REQUIRED", "Username required.", 403),
    // Login
    PASSWORD_NOT_MATCHING("PASSWORD_NOT_MATCHING", "Username password not matching.", 403),
    // Login
    PASSWORD_REQUIRED("PASSWORD_REQUIRED", "Password required.", 403),
    // Login, Change password, Register
    USER_NOT_FOUND("USER_NOT_FOUND", "User not found.", 403),
    // Change password
    PASSWORD_CHANGE_OLD_REQUIRED("PASSWORD_CHANGE_OLD_REQUIRED", "Old password required.", 403),
    // Change password, Register
    PASSWORD_NEW_REQUIRED("PASSWORD_CHANGE_NEW_REQUIRED", "New password required.", 403),
    // Change password
    PASSWORD_CHANGE_NOT_MATCHING("PASSWORD_CHANGE_NOT_MATCHING", "New password and confirm password are not matching.", 403),
    PASSWORD_CHANGE_COUNT_EXCEED("PASSWORD_CHANGE_COUNT_EXCEED", "Password change count exceed limit.", 403),
    PASSWORD_CHANGE_OLD_NOT_MATCHING("PASSWORD_CHANGE_OLD_NOT_MATCHING", "Old password not matching.", 403),
    // Change password, Register
    PASSWORD_LENGTH_MISMATCH("PASSWORD_LENGTH_MISMATCH", "New password length should between 8 to 14.", 403),
    // Register
    REGISTER_PASSCODE_REQUIRED("REGISTER_PASSCODE_REQUIRED", "Passcode required.", 403),
    REGISTER_NAME_REQUIRED("REGISTER_NAME_REQUIRED", "Name required.", 403),
    REGISTER_PASSCODE_NOT_MATCHING("REGISTER_PASSCODE_NOT_MATCHING", "Passcode not matching.", 403),
    INVALID_FILE_DATA("INVALID_FILE_DATA", "Invalid file data", 403),
    INVALID_FILE_SAVE_PATH("INVALID_FILE_SAVE_PATH", "Invalid final save file path", 403),
    INVALID_SERVICE_NAME_EMPTY("Invalid service name Empty", "Invalid service name Empty", 403),
    INVALID_SERVICE_NAME("Invalid service name", "Invalid service name", 403),
    TASK_COMPONENT_NOT_FOUND("Component not found", "Component not found", 403),
    TASK_APPLICATION_NOT_FOUND("Application not found", "Application not found", 403),
    COMMAND_ID_NULL("Invalid commandId", "Invalid commandId", 403),
    COMMAND_NOT_FOUND("Command not found", "Command not found", 403),
    CONFIG_ERROR_INVALID_SAVE_MSG_PATH("Invalid save message path", "Invalid save message path", 403),
    CONFIG_ERROR_INVALID_PATH("Invalid path", "Invalid path", 403),
    CONFIG_ERROR_INVALID_STORAGE_TYPE("Invalid storage type", "Invalid storage type", 403),
    UNSUPPORTED_FILE_TYPE("UNSUPPORTED_FILE_TYPE", "Unsupported file type", 403),
    SERVER_ERROR("SERVER_ERROR", "Server error", 500),
    CONFIG_ERROR("CONFIG_ERROR", "Configuration error", 500),
    FILE_SIZE_EXCEEDED("FILE_SIZE_EXCEEDED", "File size exceeded", 500),
    RUNTIME_ERROR("RUN_TIME_ERROR", "Run time error", 599);

    final String errorCode;
    final String errorString;
    final Integer statusCode;

    ErrorCodes(String errorCode, String errorString, Integer statusCode) {
        this.errorCode = errorCode;
        this.errorString = errorString;
        this.statusCode = statusCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getErrorString() {
        return errorString;
    }

    public Integer getStatusCode() {
        return statusCode;
    }
}
