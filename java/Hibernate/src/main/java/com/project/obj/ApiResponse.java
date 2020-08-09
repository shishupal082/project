package com.project.obj;

import com.project.config.AppConstant;

public class ApiResponse {
    private String status;
    private String failureCode;
    private String reason;
    private Object data;
    public ApiResponse() {}
    public ApiResponse(Object data) {
        if (data != null) {
            this.status = AppConstant.SUCCESS;
        } else {
            this.status = AppConstant.FAILURE;
        }
        this.data = data;
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
        return "DaoApiResponse{" +
                "status='" + status + '\'' +
                ", failureCode='" + failureCode + '\'' +
                ", reason='" + reason + '\'' +
                ", data=" + data +
                '}';
    }
}
