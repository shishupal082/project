package com.project.ftp.obj;

import com.project.ftp.config.AppConstant;
import com.project.ftp.config.FileMimeType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PathInfo {
    final static Logger logger = LoggerFactory.getLogger(PathInfo.class);
    private String path;
    private String type;
    private String parentFolder; // In case of file only
    private String fileName;
    private String filenameWithoutExt;
    private String extension;
    private String mediaType;
    public PathInfo() {}
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

    public String getParentFolder() {
        return parentFolder;
    }

    public void setParentFolder(String parentFolder) {
        this.parentFolder = parentFolder;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilenameWithoutExt() {
        return filenameWithoutExt;
    }

    public void setFilenameWithoutExt(String filenameWithoutExt) {
        this.filenameWithoutExt = filenameWithoutExt;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }
    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public void findExtension() {
        if (AppConstant.FILE.equals(this.type) && fileName != null) {
            String[] fileNameArr = fileName.split("\\.");
            String filenameWithoutExt = "";
            if (fileNameArr.length > 0) {
                if (fileNameArr.length == 1) {
                    extension = "";
                } else {
                    extension = fileNameArr[fileNameArr.length-1];
                }
            }
            for (int i=0; i<fileNameArr.length-1; i++) {
                if (i==0) {
                    filenameWithoutExt = fileNameArr[i];
                } else {
                    filenameWithoutExt += "." + fileNameArr[i];
                }
            }
            if (filenameWithoutExt.isEmpty()) {
                filenameWithoutExt = fileName;
            }
            this.filenameWithoutExt = filenameWithoutExt;
        }
    }
    public void findMimeType() {
        if (extension == null) {
            return;
        }
        String mimeType = FileMimeType.getValue(extension);
        if (mimeType == null) {
            // Can be search in ftpConfiguration, but as of now not required
            logger.info("directoryConfig:mimeType not configured in env_config");
        }
        this.mediaType = mimeType;
    }

    @Override
    public String toString() {
        return "PathInfo{" +
                "path='" + path + '\'' +
                ", type='" + type + '\'' +
                ", parentFolder='" + parentFolder + '\'' +
                ", fileName='" + fileName + '\'' +
                ", filenameWithoutExt='" + filenameWithoutExt + '\'' +
                ", extension='" + extension + '\'' +
                ", mediaType='" + mediaType + '\'' +
                '}';
    }
}
