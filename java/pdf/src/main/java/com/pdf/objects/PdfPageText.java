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
                response += "<div>*** Page Number: " + pageNumber + " Start ***</div>";
            }
            response += "<div>";
            for (int i=0; i<pageText.length; i++) {
                response += "<p>" + pageText[i] + "</p>";
            }
            response += "</div>";
            if (pageText.length > 4) {
                response += "<div>*** Page Number: " + pageNumber + " End ***</div>";
            } else {
                response += "<div>-- Page Number: " + pageNumber + " End --</div>";
            }
        } else {
            response += "<div>Page Number: " + pageNumber + "</div>";
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
