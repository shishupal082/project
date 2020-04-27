package com.pdf;

import com.pdf.constants.AppConstant;
import com.pdf.resource.FaviconResource;
import com.pdf.resource.PdfResource;
import com.pdf.service.PdfService;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.eclipse.jetty.server.session.SessionHandler;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

public class PdfApplication extends Application<PdfConfiguration> {
    private static Logger LOGGER = LoggerFactory.getLogger(PdfApplication.class);
    private static ArrayList<String> arguments = new ArrayList<String>();
    public void initialize(Bootstrap<PdfConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<PdfConfiguration>());
        String resourcePath = "/assets/";
        bootstrap.addBundle(new AssetsBundle(resourcePath, resourcePath));
    }
    @Override
    public void run(PdfConfiguration pdfConfiguration, Environment environment) throws Exception {
        LOGGER.info("commandLineArguments: "+arguments.toString());
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new FaviconResource(pdfConfiguration));
        environment.jersey().register(new PdfResource(pdfConfiguration));
        if (arguments.size() > 1 && arguments.get(1).equals("createReadmePdf")) {
            PdfService pdfService = new PdfService(pdfConfiguration);
            pdfService.createReadmePdf();
        } else {
            LOGGER.info("'createReadmePdf' not configured.");
        }

        LOGGER.info("Start application config: {}", pdfConfiguration);
    }
    public static void main(String[] args) throws Exception {
        for (int i=0; i<args.length; i++) {
            arguments.add(args[i]);
        }
        new PdfApplication().run(AppConstant.server, args[0]);
    }
}
