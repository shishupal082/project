package com.pdf.pdfApp;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.FileOutputStream;

public class SetPDFAttributes {
	public static void main(String[] args) {
		Document document = new Document();
		try
		{
			PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream("meta-data/pdf-dir/SetAttributeExample.pdf"));
			document.open();
			document.add(new Paragraph("Some content here"));

			//Set attributes here
			document.addAuthor("Lokesh Gupta");
			document.addCreationDate();
			document.addCreator("HowToDoInJava.com");
			document.addTitle("Set Attribute Example");
			document.addSubject("An example to show how attrinutes can be added to pdf files.");

			document.close();
			writer.close();
		} catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
