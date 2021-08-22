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

import java.util.ArrayList;
import java.util.Arrays;

public class PdfApplication extends Application<PdfConfiguration> {
    private static final Logger LOGGER = LoggerFactory.getLogger(PdfApplication.class);
    private static final ArrayList<String> arguments = new ArrayList<String>();
    public void initialize(Bootstrap<PdfConfiguration> bootstrap) {
        super.initialize(bootstrap);
    }
    @Override
    public void run(PdfConfiguration pdfConfiguration, Environment environment) throws Exception {
        LOGGER.info("commandLineArguments: "+arguments.toString());
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new PdfResource(pdfConfiguration));
        LOGGER.info("Start application config: {}", pdfConfiguration);
    }
    public static void main(String[] args) throws Exception {
        arguments.addAll(Arrays.asList(args));
        new PdfApplication().run(AppConstant.server, args[0]);
    }
}
