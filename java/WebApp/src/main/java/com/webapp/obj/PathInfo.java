package com.webapp.obj;

import com.webapp.config.DirectoryConfig;
import com.webapp.config.WebAppConfig;
import com.webapp.constants.AppConstant;
import com.webapp.constants.FileMimeType;

public class PathInfo {
    private String path;
    private String filePath;
    private String type;
    private String mediaType;
    private String extention;

    public PathInfo(final String path) {
        this.path = path;
    }
    public String getPath() {
        return path;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getExtention() {
        return extention;
    }

    public void setExtention(String extention) {
        this.extention = extention;
    }
    public void findExtention() {
        if (AppConstant.FILE.equals(this.type)) {
            String[] pathArr = path.split("\\.");
            if (pathArr.length > 0) {
                extention = pathArr[pathArr.length-1];
            }
        }
    }
    public void findMimeType(WebAppConfig webAppConfig) {
        if (extention == null) {
            return;
        }
        String mimeType = FileMimeType.getValue(extention);
        if (mimeType == null) {
            DirectoryConfig directoryConfig = webAppConfig.getWebAppConfiguration().getDirectoryConfig();
            if (directoryConfig != null && extention != null) {
                mimeType = directoryConfig.getMimeType().get(extention);
            } else {
                mimeType = FileMimeType.getValue("txt");
            }
        }
        this.mediaType = mimeType;
    }

    @Override
    public String toString() {
        return "PathInfo{" +
                "path='" + path + '\'' +
                ", filePath='" + filePath + '\'' +
                ", type='" + type + '\'' +
                ", mediaType='" + mediaType + '\'' +
                ", extention='" + extention + '\'' +
                '}';
    }
}
