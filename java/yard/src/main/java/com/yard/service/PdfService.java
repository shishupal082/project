package com.yard.service;

import com.yard.constants.AppConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

public class PdfService {
    private static Logger logger = LoggerFactory.getLogger(PdfService.class);

    public static void convertReadmeToPdf() {
        String pdfTitle = "Readme PDF";
        String pdfSubject = "Help to start application.";
        TextToPdfService textToPdfService = new TextToPdfService(pdfTitle, pdfSubject);

        String textFileName = "readme.txt";
        String pdfFileName = "readme.pdf";
        ArrayList<String> fileData = textToPdfService.readTextFile(textFileName);
        fileData.add("");
        fileData.add("AppVersion: " + AppConstant.AppVersion);
        textToPdfService.convertTextToPdf(pdfFileName, fileData);
        logger.info("File conversion complete from '{}' to '{}'", textFileName, pdfFileName);
    }
}
