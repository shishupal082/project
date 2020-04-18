package com.pdf.service;

import com.pdf.PdfConfiguration;
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
    private String pdfDir;
    public PdfService(PdfConfiguration pdfConfiguration) {
        pdfDir = pdfConfiguration.getPdfSaveDir();
    }
    private void createPdf(String[] args) {
        JavaPdfHelloWorld.main(args);
        SetPDFAttributes.main(args);

        String pdfTitle = "Readme PDF";
        String pdfSubject = "Help to start application.";
        TextToPdfService textToPdfService = new TextToPdfService(pdfTitle, pdfSubject);

        String textFileName = "readme.txt";
        String pdfFileName = pdfDir + "readme.pdf";
        Map<String, String> response = textToPdfService.convertTextFileToPdf(textFileName, pdfFileName);
        logger.info("Create pdf completed: {}", response.toString());
    }
    public ArrayList<PdfPageText> readPdf(String pdfFileName) {
        PdfToTextService pdfToTextService = new PdfToTextService();
        ArrayList<PdfPageText> response = pdfToTextService.readPdf(pdfFileName);
        logger.info("Read pdf completed:");
        for (PdfPageText pdfPageText : response) {
            System.out.println(pdfPageText.toString());
        }
        return response;
    }
    public void checkPdfUtilities() {
        String[] args = new String [1];
        createPdf(args);
        ReadModifyPdfExample.main(args);

        String pdfFileName = pdfDir + "S17-Final-PDF_14-11-2018.pdf";
        readPdf(pdfFileName);

//        AddImageExample.main(args);
        CreateListExample.main(args);
        CreateTableExample.main(args);
//        FilePermissionsExample.main(args);
//        PasswordProtectedPdfExample.main(args);
        PdfStyingExample.main(args);

    }
}
