package com.yard.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.yard.YardConfiguration;
import com.yard.constants.AppConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;

public class PdfService {
    private static Logger logger = LoggerFactory.getLogger(PdfService.class);
    private YardConfiguration yardConfiguration;
    public PdfService(YardConfiguration yardConfiguration) {
        this.yardConfiguration = yardConfiguration;
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
            logger.info("FileNotFoundException, fileName: " + textFileName);
        } catch (Exception e) {
            logger.info("Unknown Exception");
            e.printStackTrace();
        }
        return  response;
    }
    private void createPdfUsingText(String pdfFileName, ArrayList<String> fileData) {
        Document document = new Document();
        String paragraphText;
        try {
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFileName));
            document.open();
            Iterator i = fileData.iterator();
            while (i.hasNext()) {
                paragraphText = i.next().toString();
                if (paragraphText.equals("")) {
                    paragraphText = " ";
                }
                document.add(new Paragraph(paragraphText));
            }
            if (fileData.isEmpty()) {
                document.add(new Paragraph(" "));
            }
            document.addAuthor("Project Author");
            document.addCreationDate();
            document.addCreator("Project Creator");
            document.addTitle("Readme PDF");
            document.addSubject("Help to start application.");
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
    public void convertTextToPdf(String textFileName, String pdfFileName) {
        ArrayList<String> fileData = readTextFile(textFileName);
        if (fileData.isEmpty()) {
            logger.info("Unable to read data from textFileName: " +textFileName);
        } else {
            createPdfUsingText(pdfFileName, fileData);
        }
        logger.info("File conversion complete.");
    }
}
