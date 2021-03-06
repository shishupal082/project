package com.pdf.service;

import com.pdf.PdfConfiguration;
import com.pdf.constants.AppConstant;
import com.pdf.objects.PdfPageText;
import com.pdf.pdfApp.*;
import com.pdf.pdfService.PdfToTextService;
import com.pdf.pdfService.TextToPdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Map;

public class PdfService {
    private static Logger logger = LoggerFactory.getLogger(PdfService.class);
    private final PdfConfiguration pdfConfiguration;
    private final String pdfDir;
    private PdfToTextService pdfToTextService = new PdfToTextService();
    public PdfService(final PdfConfiguration pdfConfiguration) {
        this.pdfConfiguration = pdfConfiguration;
        pdfDir = pdfConfiguration.getPdfSaveDir();
    }
    private void createPdf(String [] args) {
        String textFileName = "meta-data/test.txt";
        String pdfTitle = "Test PDF";
        String pdfSubject = "Test PDF application.";
        TextToPdfService textToPdfService = new TextToPdfService(pdfTitle, pdfSubject);

        String pdfFileName = pdfDir + "test.pdf";
        Map<String, String> response = textToPdfService.convertTextFileToPdf(textFileName, pdfFileName);
        logger.info("Create pdf completed: {}", response.toString());
    }
    public void convertReadmeTextToPdf(String pdfFileName) {
        String textFileName = "readme.txt";
        String pdfTitle = "Readme PDF";
        String pdfSubject = "Help to start application.";
        TextToPdfService textToPdfService = new TextToPdfService(pdfTitle, pdfSubject);

        ArrayList<String> fileData = textToPdfService.readTextFile(textFileName);
        fileData.add("");
        fileData.add("AppVersion: " + AppConstant.AppVersion);
        textToPdfService.convertTextToPdf(pdfFileName, fileData);
        logger.info("File conversion complete from '{}' to '{}'", textFileName, pdfFileName);

    }
    public Map<String, Object> readPdf(String pdfFileName) {
        Map<String, Object> pdfReadResponse = pdfToTextService.readPdf(pdfFileName);
        Object r = pdfReadResponse.get(AppConstant.RESPONSE);
        ArrayList<PdfPageText> response = (ArrayList<PdfPageText>) r;
        logger.info("Read pdf completed:");
        for (PdfPageText pdfPageText : response) {
            logger.info(pdfPageText.toString());
        }
        return pdfReadResponse;
    }
    public String convertPdfToText(final String pdfFileName) {
        String response = "";
//        response += "<style type='text/css'>";
//        response += "div{margin: 2px;}";
//        response += "</style>";

        String[] pageText = new String[1];
        pageText[0] = "File not found.";
        PdfPageText pdfPageText = new PdfPageText();
        pdfPageText.setPageNumber(0);
        pdfPageText.setPageText(pageText);

        String pdfFilePath = pdfDir + pdfFileName;
        Map<String, Object> pdfReadResponse = readPdf(pdfFilePath);
        Object r = pdfReadResponse.get(AppConstant.RESPONSE);
        ArrayList<PdfPageText> pdfData = (ArrayList<PdfPageText>) r;
        if (pdfReadResponse.get(AppConstant.STATUS).equals(AppConstant.SUCCESS)) {
            if (pdfData.size() == 0) {
                pdfData.add(pdfPageText);
                response += "<center>File not found.</center>";
            } else {
                for (PdfPageText pdfPageText2 : pdfData) {
                    response += pdfPageText2.getPageHtml() + "<hr style='border-style: dashed;'>";
                }
            }
        } else {
            response += "<center>" + pdfReadResponse.get(AppConstant.REASON) + "</center>";
        }
        pdfToTextService.createTextFile(pdfData, pdfFilePath+".txt");
        return response;
    }
    public void checkPdfUtilities() {
        String[] args = new String [1];

        /*
         * Create pdf from text file
         * */
        JavaPdfHelloWorld.main(args);
        SetPDFAttributes.main(args);
        createPdf(args);

        /*
         * Read text from pdf and save in text file
         * */
        ReadModifyPdfExample.main(args);
        String pdfFileName = "S17-Final-PDF_14-11-2018.pdf";
        convertPdfToText(pdfFileName);

//        AddImageExample.main(args);
        CreateListExample.main(args);
        CreateTableExample.main(args);
//        FilePermissionsExample.main(args);
//        PasswordProtectedPdfExample.main(args);
        PdfStyingExample.main(args);
    }
    public void createReadmePdf() {
        String pdfFileName = "readme.pdf";
        convertReadmeTextToPdf(pdfFileName);
        pdfFileName = pdfDir + pdfFileName;
        convertReadmeTextToPdf(pdfFileName);
    }
}
