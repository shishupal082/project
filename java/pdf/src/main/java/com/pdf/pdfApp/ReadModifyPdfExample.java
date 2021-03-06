package com.pdf.pdfApp;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;

import java.io.FileOutputStream;
import java.io.IOException;

public class ReadModifyPdfExample {
	public static void main(String[] args) {
		  try
		  {
			//Read file using PdfReader
			PdfReader pdfReader = new PdfReader("meta-data/pdf-dir/HelloWorld.pdf");

			//Modify file using PdfReader
			PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileOutputStream("meta-data/pdf-dir/HelloWorld-modified.pdf"));

			Image image = Image.getInstance("meta-data/temp.png");
			image.scaleAbsolute(100, 50);
			image.setAbsolutePosition(100f, 700f);

			for(int i=1; i<= pdfReader.getNumberOfPages(); i++)
			{
				PdfContentByte content = pdfStamper.getUnderContent(i);
				content.addImage(image);
			}

			pdfStamper.close();

		  } catch (IOException e) {
			e.printStackTrace();
		  } catch (DocumentException e) {
			e.printStackTrace();
		  }
		}
}
