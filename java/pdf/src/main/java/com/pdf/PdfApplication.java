package com.pdf;

import com.pdf.constants.AppConstant;
import com.pdf.resource.PdfResource;
import com.pdf.service.PdfService;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.server.session.SessionHandler;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PdfApplication extends Application<PdfConfiguration> {
    private static Logger LOGGER = LoggerFactory.getLogger(PdfApplication.class);
    public void initialize(Bootstrap<PdfConfiguration> bootstrap) {
        super.initialize(bootstrap);
    }
    @Override
    public void run(PdfConfiguration pdfConfiguration, Environment environment) throws Exception {
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new PdfResource(pdfConfiguration));
        PdfService pdfService = new PdfService(pdfConfiguration);
        pdfService.checkPdfUtilities();
    }
    public static void main(String[] args) throws Exception {
        new PdfApplication().run(AppConstant.server, args[0]);
    }
}
