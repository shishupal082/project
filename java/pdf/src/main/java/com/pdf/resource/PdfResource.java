package com.pdf.resource;


import com.pdf.PdfConfiguration;
import com.pdf.objects.PdfPageText;
import com.pdf.service.PdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.net.URISyntaxException;
import java.util.ArrayList;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PdfResource {
    private static Logger logger = LoggerFactory.getLogger(PdfResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private PdfConfiguration pdfConfiguration;
    private String pdfDir;
    public PdfResource(PdfConfiguration pdfConfiguration) {
        this.pdfConfiguration = pdfConfiguration;
        pdfDir = pdfConfiguration.getPdfSaveDir();
    }
    @GET
    public ArrayList<String> indexPage() {
        logger.info("loadingPdfResource : In");
        ArrayList<String> response = new ArrayList<String>();
        PdfService pdfService = new PdfService(pdfConfiguration);
        pdfService.checkPdfUtilities();
        response.add("PdfGenerated");
        logger.info("loadingPdfResource : Out : {}", response);
        return response;
    }
    @GET
    @Path("/read/{pdfFileName}")
    @Produces(MediaType.TEXT_HTML)
    public String readPdfFile(@PathParam("pdfFileName") String pdfFileName) throws URISyntaxException {
        logger.info("readPdfFile: In, pdfFileName: {}", pdfFileName);
        PdfService pdfService = new PdfService(pdfConfiguration);
        String pdfFilePath = pdfDir + pdfFileName;
        ArrayList<PdfPageText> pdfData = pdfService.readPdf(pdfFilePath);
        String response = "";
        for (PdfPageText pdfPageText : pdfData) {
            response += pdfPageText.getPageHtml() + "<hr style='border-style: dashed;'>";
        }
        if (pdfData.size() == 0) {
            response += "<div>File not found.</div>";
        }
        logger.info("readPdfFile: Out");
        return response;
    }
}