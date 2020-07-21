package com.project.ftp.pdf;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.project.ftp.config.AppConstant;
import com.project.ftp.service.StaticService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;

public class TextToPdfService {
    final static Logger logger = LoggerFactory.getLogger(TextToPdfService.class);
    private String pdfTitle;
    private String pdfSubject;
    public TextToPdfService() {}
    public TextToPdfService(String pdfTitle, String pdfSubject) {
        this.pdfTitle = pdfTitle;
        this.pdfSubject = pdfSubject;
    }
    private ArrayList<String> readTextFile(String textFileName) {
        ArrayList<String> response = new ArrayList<String>();
        File file = new File(textFileName);
        try {
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(
                            new FileInputStream(file), AppConstant.UTF8));
            String str;
            while ((str = in.readLine()) != null) {
                response.add(str);
            }
            in.close();
        } catch (FileNotFoundException e) {
            logger.info("FileNotFoundException, fileName: {}, {}", textFileName, e.getMessage());
        } catch (Exception e) {
            logger.info("Unknown Exception, fileName: {}, {}", textFileName, e.getMessage());
        }
        return  response;
    }
    public void convertTextToPdf(String pdfFileName, ArrayList<String> fileData) {
        Document document = new Document();
        try {
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFileName));
            document.open();
            Paragraph paragraph;
            for (String paragraphText : fileData) {
                if (paragraphText.equals("")) {
                    paragraphText = AppConstant.EmptyParagraph;
                }
                paragraph = new Paragraph(paragraphText);
                document.add(paragraph);
            }
            if (fileData.isEmpty()) {
                document.add(new Paragraph(AppConstant.EmptyParagraph));
            }
            document.addCreationDate();
            document.addAuthor(AppConstant.PdfAuther);
            document.addCreator(AppConstant.PdfCreator);
            if (pdfTitle != null) {
                document.addTitle(pdfTitle);
            }
            if (pdfSubject != null) {
                document.addSubject(pdfSubject);
            }
            document.close();
            writer.close();
            logger.info("Pdf file created: {}", pdfFileName);
        } catch (DocumentException e) {
            logger.info("DocumentException error, {}, {}", pdfFileName, e.getMessage());
        } catch (FileNotFoundException e) {
            logger.info("FileNotFoundException error, {}, {}", pdfFileName, e.getMessage());
        }
    }
    public void convertReadmeTextToPdf() {
        String textFileName = "readme.txt";
        String pdfFileName = "readme.pdf";
        String pdfTitle = "Readme PDF";
        String pdfSubject = "Help to start application.";
        TextToPdfService textToPdfService = new TextToPdfService(pdfTitle, pdfSubject);
        ArrayList<String> fileData = textToPdfService.readTextFile(textFileName);
        fileData.add("");
        fileData.add("AppVersion: " + AppConstant.AppVersion +
                ", Dated:" + StaticService.getDateStrFromPattern(AppConstant.DateTimeFormat3));
        textToPdfService.convertTextToPdf(pdfFileName, fileData);
        logger.info("convertReadmeTextToPdf, request completed. '{}' to '{}'", textFileName, pdfFileName);
    }
}
