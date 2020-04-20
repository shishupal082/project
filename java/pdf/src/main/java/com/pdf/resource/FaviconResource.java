package com.pdf.resource;

import com.pdf.PdfConfiguration;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by shishupalkumar on 15/04/20.
 */
@Path("/favicon.ico")
public class FaviconResource {
    private String icoFilePath;
    public FaviconResource(PdfConfiguration pdfConfiguration){
        if (pdfConfiguration.getIcoFilePath() != null) {
            icoFilePath = pdfConfiguration.getIcoFilePath();
        } else {
            icoFilePath = "src/main/resources/assets/favicon.ico";
        }
    }
    @GET
    @Produces("image/x-icon")
    public Response LoadFaviconIcon() throws URISyntaxException {
        File file = new File(icoFilePath);
        if (file.isFile()) {
            Response.ResponseBuilder response = Response.ok((Object) file);
            response.header(HttpHeaders.CACHE_CONTROL, "attachment; filename=favicon.ico");
            return response.build();
        }
        return Response.seeOther(new URI("/assets/favicon.ico")).build();
    }
}
