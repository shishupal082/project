package com.project.ftp.session;

import com.project.ftp.config.AppConstant;
import com.project.ftp.service.StaticService;

public class SessionData {
    private String sessionId;
    private Long updatedTime;
    private String username;
    private String visibleDate;
    public SessionData(String sessionId, Long updatedTime) {
        this.sessionId = sessionId;
        this.updatedTime = updatedTime;
        visibleDate = StaticService.getDateFromInMs(AppConstant.DateTimeFormat2, updatedTime);
    }
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Long getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(Long updatedTime) {
        this.updatedTime = updatedTime;
        visibleDate = StaticService.getDateFromInMs(AppConstant.DateTimeFormat2, updatedTime);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getVisibleDate() {
        return visibleDate;
    }

    public void setVisibleDate(String visibleDate) {
        this.visibleDate = visibleDate;
    }

    @Override
    public String toString() {
        return "SessionData{" +
                "sessionId='" + sessionId + '\'' +
                ", updatedTime=" + updatedTime +
                ", username='" + username + '\'' +
                ", visibleDate=" + visibleDate +
                '}';
    }
}
