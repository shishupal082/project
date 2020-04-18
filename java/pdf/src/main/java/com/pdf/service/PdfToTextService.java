package com.pdf.service;

import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.parser.PdfTextExtractor;
import com.pdf.objects.PdfPageText;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
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
            logger.info("IOException in reading file: {}", pdfFileName);
        }
        return response;
    }
}
