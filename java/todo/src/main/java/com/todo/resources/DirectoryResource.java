package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.TodoDirectoryConfig;
import com.todo.services.DirectoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

/**
 * Created by shishupalkumar on 01/02/17.
 */
@Path("/files")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DirectoryResource {
    private static Logger logger = LoggerFactory.getLogger(DirectoryResource.class);
    private TodoDirectoryConfig todoDirectoryConfig;
    private DirectoryService directoryService;
    public DirectoryResource(TodoConfiguration todoConfiguration, TodoDirectoryConfig todoDirectoryConfig) {
        this.todoDirectoryConfig = todoDirectoryConfig;
        this.directoryService = new DirectoryService(todoDirectoryConfig);
    }
    @Path("/v1/getAll")
    @GET
    @Produces("text/html")
    public Response getAll() {
        logger.info("getAll : In");
        String res = "";
        ArrayList<String> allFiles = directoryService.getAllFiles(todoDirectoryConfig.getRelativePath(), true);
        allFiles = directoryService.createLink(allFiles, true);
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getAll : Out");
        return Response.ok(res).build();
    }
//    @Path("/v2/getAll")
//    @GET
//    @Produces("text/html")
//    public Response getAllFilesV2(@QueryParam("path") String path) {
//        logger.info("getAll : In");
//        String res = "";
//        ArrayList<String> allFiles = directoryService.getAllFiles(path, false);
//        allFiles = directoryService.createLink(allFiles, false);
//        for (String fileName : allFiles) {
//            res += fileName + "<br>";
//        }
//        logger.info("getAll : Out");
//        return Response.ok(res).build();
//    }
    @Path("/v1/get")
    @GET
    @Produces("text/html")
    public Response getFile(@QueryParam("name") String fileName) {
        logger.info("getFile : In : fileName : {}", fileName);
        String fileData = null;
        BufferedReader bufferedReader = null;
        try {
            String[] fileArray = fileName.split("\\.");
            if (fileArray.length > 1 &&
                todoDirectoryConfig.getSupportedGetFile().contains(fileArray[fileArray.length - 1])) {
                bufferedReader = new BufferedReader(
                    new FileReader(todoDirectoryConfig.getRelativePath() + fileName));
                String line;
                fileData = "";
                while ((line=bufferedReader.readLine()) != null) {
                    fileData += line + "<br>";
                }
            } else {
                fileData = "Unsupported file format";
            }
        } catch (IOException ioe) {
            logger.info("Error parsing file : ", fileData);
            fileData = "File not found";
        } catch (Exception e) {
            fileData = "Invalid arguments";
            logger.info("Error parsing file : ", fileData);
        }
        logger.info("getFile : Out : {}", fileData);
        return Response.ok(fileData).build();
    }
}
