package com.project.ftp.session;

public class SessionData {
    private String sessionId;
    private Long updatedTime;
    private String username;
    public SessionData(String sessionId, Long updatedTime) {
        this.sessionId = sessionId;
        this.updatedTime = updatedTime;
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
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "SessionData{" +
                "sessionId='" + sessionId + '\'' +
                ", updatedTime='" + updatedTime + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
