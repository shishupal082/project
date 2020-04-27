package com.yard;

import com.yard.constants.AppConstant;
import com.yard.exceptions.YardExceptionMapper;
import com.yard.filters.LogFilter;
import com.yard.filters.RequestFilter;
import com.yard.filters.ResponseFilter;
import com.yard.resources.FaviconResource;
import com.yard.resources.ViewResource;
import com.yard.service.ConfigService;
import com.yard.service.PdfService;
import com.yard.utils.SystemUtils;
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

public class YardApplication extends Application<YardConfiguration> {

    private static Logger LOGGER = LoggerFactory.getLogger(YardApplication.class);
    private static ArrayList<String> arguments = new ArrayList<String>();
    public void initialize(Bootstrap<YardConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<YardConfiguration>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets"));
    }
    @Override
    public void run(YardConfiguration yardConfiguration, Environment environment) throws Exception {
        LOGGER.info("commandLineArguments: "+arguments.toString());
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        if (arguments.size() > 1 && arguments.get(1).equals("createReadmePdf")) {
            PdfService.convertReadmeToPdf();
        } else {
            LOGGER.info("'createReadmePdf' not configured.");
        }
        environment.jersey().register(new FaviconResource());
        environment.jersey().register(new LogFilter());
        environment.jersey().register(new RequestFilter());
        environment.jersey().register(new ResponseFilter());
        environment.jersey().register(new YardExceptionMapper());
        environment.jersey().register(new ConfigService(yardConfiguration));
        environment.jersey().register(new ViewResource(yardConfiguration));
    }
    public static void main(String[] args) throws Exception {
        for (int i=0; i<args.length; i++) {
            arguments.add(args[i]);
        }
        SystemUtils.printLog(arguments.toString());
        new YardApplication().run(AppConstant.server, args[0]);
    }
}
