package com.pdf.service;

import com.pdf.PdfConfiguration;
import com.pdf.pdfApp.*;

public class PdfService {
    private PdfConfiguration pdfConfiguration;
    public PdfService(PdfConfiguration pdfConfiguration) {
        this.pdfConfiguration = pdfConfiguration;
    }
    public void checkPdfUtilities() {
        String[] args = null;
        JavaPdfHelloWorld.main(args);
        AddImageExample.main(args);
        CreateListExample.main(args);
        CreateTableExample.main(args);
//        FilePermissionsExample.main(args);
//        PasswordProtectedPdfExample.main(args);
        PdfStyingExample.main(args);
        ReadModifyPdfExample.main(args);
        SetPDFAttributes.main(args);

    }
}
