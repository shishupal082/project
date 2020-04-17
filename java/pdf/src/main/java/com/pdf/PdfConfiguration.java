package com.pdf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.dropwizard.Configuration;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PdfConfiguration extends Configuration {
    private String pdfSaveDir;

    public String getPdfSaveDir() {
        return pdfSaveDir;
    }

    public void setPdfSaveDir(String pdfSaveDir) {
        this.pdfSaveDir = pdfSaveDir;
    }

    @Override
    public String toString() {
        return "PdfConfiguration{" +
                "pdfSaveDir='" + pdfSaveDir + '\'' +
                '}';
    }
}
