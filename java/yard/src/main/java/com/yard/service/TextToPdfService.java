package com.yard.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.yard.constants.AppConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
            logger.info("FileNotFoundException, fileName: " + textFileName);
        } catch (Exception e) {
            logger.info("Unknown Exception");
            e.printStackTrace();
        }
        return  response;
    }
    public void convertTextToPdf(String pdfFileName, ArrayList<String> fileData) {
        Document document = new Document();
        String paragraphText;
        try {
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFileName));
            document.open();
            Iterator i = fileData.iterator();
            Paragraph paragraph;
            while (i.hasNext()) {
                paragraphText = i.next().toString();
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
            logger.info("DocumentException error.");
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            logger.info("FileNotFoundException error.");
            e.printStackTrace();
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
