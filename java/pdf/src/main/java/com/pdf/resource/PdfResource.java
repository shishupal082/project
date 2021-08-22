package com.pdf.resource;


import com.pdf.PdfConfiguration;
import com.pdf.constants.AppConstant;
import com.pdf.file.ScanDir;
import com.pdf.file.ScanResult;
import com.pdf.service.PdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PdfResource {
    private static final Logger logger = LoggerFactory.getLogger(PdfResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private final PdfConfiguration pdfConfiguration;
    private final PdfService pdfService;
    private final String pdfDir;
    public PdfResource(PdfConfiguration pdfConfiguration) {
        this.pdfConfiguration = pdfConfiguration;
        pdfService = new PdfService(pdfConfiguration);
        pdfDir = pdfConfiguration.getPdfSaveDir();
    }
    @GET
    public Map<String, String> indexPage() {
        logger.info("IndexView: in");
        Map<String, String> response = new HashMap<String, String>();
        response.put("appVersion", AppConstant.AppVersion);
        logger.info("IndexView: out");
        return response;
    }
    @GET
    @Path("check-utilities")
    public Map<String, String> checkUtilities() {
        logger.info("checkUtilities: in");
        Map<String, String> response = new HashMap<String, String>();
        pdfService.checkPdfUtilities();
        response.put(AppConstant.STATUS, AppConstant.SUCCESS);
        logger.info("checkUtilities: out");
        return response;
    }
    @GET
    @Path("scan/pdf-dir")
    public ScanResult scanPdfDir() throws URISyntaxException {
        logger.info("scanPdfDir: In, {}", pdfConfiguration.getPdfSaveDir());
        ScanDir scanDir = new ScanDir();
        ScanResult response = scanDir.scanResult(pdfDir, false);
        logger.info("scanPdfDir: Out");
        return response;
    }
    @GET
    @Path("read/{pdfFileName}")
    @Produces(MediaType.TEXT_HTML)
    public String readPdfFile(@PathParam("pdfFileName") String pdfFileName) throws URISyntaxException {
        logger.info("readPdfFile: In, pdfFileName: {}", pdfFileName);
        String response = pdfService.convertPdfToText(pdfFileName);
        logger.info("readPdfFile: Out");
        return response;
    }
}
