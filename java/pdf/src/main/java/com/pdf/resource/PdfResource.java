package com.pdf.resource;


import com.pdf.PdfConfiguration;
import com.pdf.service.PdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PdfResource {
    private static Logger logger = LoggerFactory.getLogger(PdfResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private PdfConfiguration pdfConfiguration;
    public PdfResource(PdfConfiguration pdfConfiguration) {
        this.pdfConfiguration = pdfConfiguration;
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
}
