package com.pdf.objects;

import java.util.Arrays;

public class PdfPageText {
    private int pageNumber;
    private String[] pageText;
    public PdfPageText() {}
    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public String[] getPageText() {
        return pageText;
    }

    public void setPageText(String[] pageText) {
        this.pageText = pageText;
    }

    public String getPageHtml() {
        String response = "";
        response += "<section>";
        if (pageText != null) {
            if (pageText.length > 4) {
                response += "<p>*** Page Number: " + pageNumber + " Start ***</p>";
            }
            response += "<p>";
            for (int i=0; i<pageText.length; i++) {
                String displayText = pageText[i];
                if (displayText == " ") {
                    displayText = "&nbsp;";
                }
                response += "<div>" + displayText + "</div>";
            }
            response += "</p>";
            if (pageText.length > 4) {
                response += "<p>*** Page Number: " + pageNumber + " End ***</p>";
            } else {
                response += "<p>-- Page Number: " + pageNumber + " End --</p>";
            }
        } else {
            response += "<p>Page Number: " + pageNumber + "</p>";
        }
        response += "</section>";
        return response;
    }

    @Override
    public String toString() {
        return "PdfPageText{" +
                "pageNumber=" + pageNumber +
                ", pageText=" + Arrays.toString(pageText) +
                '}';
    }
}
