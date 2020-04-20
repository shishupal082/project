package com.pdf.pdfService;

import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.parser.PdfTextExtractor;
import com.pdf.objects.PdfPageText;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;

public class PdfToTextService {
    private static Logger logger = LoggerFactory.getLogger(PdfToTextService.class);

    public ArrayList<PdfPageText> readPdf(String pdfFileName) {

        ArrayList<PdfPageText> response = new ArrayList<PdfPageText>();
        PdfReader reader;
        PdfPageText pdfPageText;

        try {
            reader = new PdfReader(pdfFileName);
            Integer numberOfPages = reader.getNumberOfPages();
            for (int i=1; i<=numberOfPages; i++) {
                String textFromPage = PdfTextExtractor.getTextFromPage(reader, i);
                pdfPageText = new PdfPageText();
                pdfPageText.setPageNumber(i);
                pdfPageText.setPageText(textFromPage.split("\n"));
                response.add(pdfPageText);
            }
            reader.close();
        } catch (IOException e) {
            logger.info("IOException in reading file: {}, {}", pdfFileName, e.getMessage());
        }
        return response;
    }
    public void createTextFile(ArrayList<PdfPageText> pdfData, String textFilePath) {
        try {
            File file = new File(textFilePath);
            boolean fileDeleteStatus, fileCreatedStatus;
            if (file.isFile()) {
                logger.info("File already exist and it will be overwritten : {}", textFilePath);
                fileDeleteStatus = file.delete();
            } else {
                fileDeleteStatus = true;
            }
            fileCreatedStatus = file.createNewFile();
            if (fileDeleteStatus && fileCreatedStatus) {
                FileWriter writer = new FileWriter(file);
                for (PdfPageText pdfPageText : pdfData) {
                    String[] pageTextData = pdfPageText.getPageText();
                    if (pageTextData != null) {
                        for (int i=0; i<pageTextData.length; i++) {
                            writer.write(pageTextData[i] + "\n");
                        }
                    }
                }
                writer.close();
                logger.info("pdfData saved in : {}", file);
            } else {
                logger.info("Error in file create: {}", textFilePath);
            }
        } catch (Exception e) {
            logger.info("Error saving pdfTextData : {}, {}", e.getMessage(), pdfData.toString());
        }
    }
}
