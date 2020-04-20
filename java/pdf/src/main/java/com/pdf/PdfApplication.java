package com.pdf;

import com.pdf.constants.AppConstant;
import com.pdf.resource.FaviconResource;
import com.pdf.resource.PdfResource;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.eclipse.jetty.server.session.SessionHandler;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PdfApplication extends Application<PdfConfiguration> {
    private static Logger LOGGER = LoggerFactory.getLogger(PdfApplication.class);
    public void initialize(Bootstrap<PdfConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<PdfConfiguration>());
        String resourcePath = "/assets/";
        bootstrap.addBundle(new AssetsBundle(resourcePath, resourcePath));
    }
    @Override
    public void run(PdfConfiguration pdfConfiguration, Environment environment) throws Exception {
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new FaviconResource());
        environment.jersey().register(new PdfResource(pdfConfiguration));
    }
    public static void main(String[] args) throws Exception {
        new PdfApplication().run(AppConstant.server, args[0]);
    }
}
