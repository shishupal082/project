package com.webapp.obj;

import com.webapp.config.DirectoryConfig;
import com.webapp.config.WebAppConfig;
import com.webapp.constants.AppConstant;
import com.webapp.constants.FileMimeType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PathInfo {
    private static Logger logger = LoggerFactory.getLogger(PathInfo.class);
    private String path;
    private String type;
    private String fileName;
    private String extention;
    private String mediaType;

    public PathInfo(final String path) {
        this.path = path;
    }
    public String getPath() {
        return path;
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getExtention() {
        return extention;
    }

    public void setExtention(String extention) {
        this.extention = extention;
    }
    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public void findExtention() {
        if (AppConstant.FILE.equals(this.type) && fileName != null) {
            String[] fileNameArr = fileName.split("\\.");
            if (fileNameArr.length > 0) {
                extention = fileNameArr[fileNameArr.length-1];
            }
        }
    }
    public void findMimeType(final WebAppConfig webAppConfig) {
        if (extention == null) {
            return;
        }
        String mimeType = FileMimeType.getValue(extention);
        if (mimeType == null) {
            DirectoryConfig directoryConfig = webAppConfig.getWebAppConfiguration().getDirectoryConfig();
            if (directoryConfig != null && directoryConfig.getMimeType() != null) {
                mimeType = directoryConfig.getMimeType().get(extention);
                logger.info("fileMimeType searching ({}) in directoryConfig:mimeType: {}",
                        extention, directoryConfig.getMimeType().toString());
            } else {
                logger.info("directoryConfig:mimeType not configured in env_config");
            }
        }
        this.mediaType = mimeType;
    }

    @Override
    public String toString() {
        return "PathInfo{" +
                "path='" + path + '\'' +
                ", type='" + type + '\'' +
                ", fileName='" + fileName + '\'' +
                ", extention='" + extention + '\'' +
                ", mediaType='" + mediaType + '\'' +
                '}';
    }
}
