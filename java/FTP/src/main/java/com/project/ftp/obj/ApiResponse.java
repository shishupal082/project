package com.project.ftp.obj;

import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.ErrorCodes;

public class ApiResponse {
    private String status;
    private String failureCode;
    private String reason;
    private Object data;
    public ApiResponse(String status) {
        this.status = status;
    }
    public ApiResponse(ErrorCodes errorCodes) {
        this.status = AppConstant.FAILURE;
        this.failureCode = errorCodes.getErrorCode();
        this.reason = errorCodes.getErrorString();
    }
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFailureCode() {
        return failureCode;
    }

    public void setFailureCode(String failureCode) {
        this.failureCode = failureCode;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ApiResponse{" +
                "status='" + status + '\'' +
                ", failureCode='" + failureCode + '\'' +
                ", reason='" + reason + '\'' +
                ", data=" + data +
                '}';
    }
}
