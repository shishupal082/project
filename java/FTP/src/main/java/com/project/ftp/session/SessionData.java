package com.project.ftp.session;

import java.util.HashMap;

public class SessionData {
    private HashMap<String, SessionUserInfo> sessionMapping;

    public HashMap<String, SessionUserInfo> getSessionMapping() {
        return sessionMapping;
    }

    public void setSessionMapping(HashMap<String, SessionUserInfo> sessionMapping) {
        this.sessionMapping = sessionMapping;
    }
    public void destroySession(String sessionId) {
        if (sessionId != null) {
            if (sessionMapping.containsKey(sessionId)) {
                sessionMapping.remove(sessionId);
            }
        }
    }
    public void updateSession(String sessionId, SessionUserInfo sessionUserInfo) {
        if (sessionId != null) {
            if (sessionMapping.containsKey(sessionId)) {
                sessionMapping.put(sessionId, sessionUserInfo);
            } else {
                sessionMapping.put(sessionId, sessionUserInfo);
            }
        }
    }
    public void updateUserName(String sessionId, String userName) {
        if (sessionId != null) {
            SessionUserInfo sessionUserInfo = sessionMapping.get(sessionId);
            if (sessionUserInfo == null) {
                sessionUserInfo = new SessionUserInfo();
            }
            sessionUserInfo.setUserName(userName);
            sessionMapping.put(sessionId, sessionUserInfo);
        }
    }
    @Override
    public String toString() {
        return "SessionData{" +
                "sessionMapping=" + sessionMapping +
                '}';
    }
}
