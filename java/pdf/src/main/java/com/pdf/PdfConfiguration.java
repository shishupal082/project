package com.pdf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.dropwizard.Configuration;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PdfConfiguration extends Configuration {
    private String pdfSaveDir;
    private String icoFilePath;

    public String getPdfSaveDir() {
        if (pdfSaveDir == null) {
            return "";
        }
        return pdfSaveDir.trim();
    }

    public void setPdfSaveDir(String pdfSaveDir) {
        this.pdfSaveDir = pdfSaveDir;
    }

    public String getIcoFilePath() {
        return icoFilePath;
    }

    public void setIcoFilePath(String icoFilePath) {
        this.icoFilePath = icoFilePath;
    }

    @Override
    public String toString() {
        return "PdfConfiguration{" +
                "pdfSaveDir='" + pdfSaveDir + '\'' +
                ", icoFilePath='" + icoFilePath + '\'' +
                '}';
    }
}
