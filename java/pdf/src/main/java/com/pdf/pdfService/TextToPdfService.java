package com.pdf.pdfService;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.pdf.constants.AppConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class TextToPdfService {
    private static Logger logger = LoggerFactory.getLogger(TextToPdfService.class);
    private String pdfTitle;
    private String pdfSubject;
    public TextToPdfService() {}
    public TextToPdfService(String pdfTitle, String pdfSubject) {
        this.pdfTitle = pdfTitle;
        this.pdfSubject = pdfSubject;
    }
    public ArrayList<String> readTextFile(String textFileName) {
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
        } catch (DocumentException e) {
            logger.info("DocumentException error, {}, {}", pdfFileName, e.getMessage());
        } catch (FileNotFoundException e) {
            logger.info("FileNotFoundException error, {}, {}", pdfFileName, e.getMessage());
        }
    }
    public Map<String, String> convertTextFileToPdf(String textFileName, String pdfFileName) {
        Map<String, String> response = new HashMap<String, String>();
        ArrayList<String> fileData = readTextFile(textFileName);
        if (fileData.isEmpty()) {
            response.put(AppConstant.STATUS, AppConstant.FAILURE);
            logger.info("Unable to read data from textFileName: '{}'", textFileName);
        } else {
            convertTextToPdf(pdfFileName, fileData);
            response.put(AppConstant.STATUS, AppConstant.SUCCESS);
            logger.info("File conversion complete from '{}' to '{}'", textFileName, pdfFileName);
        }
        return  response;
    }
}
