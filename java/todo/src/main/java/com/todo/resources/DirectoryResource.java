package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.DirectoryConfig;
import com.todo.model.YamlObject;
import com.todo.services.DirectoryService;
import com.todo.utils.StringUtils;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.BufferedReader;
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
    private DirectoryService directoryService;
    private TodoConfiguration todoConfiguration;
    public DirectoryResource(TodoConfiguration todoConfiguration) {
        this.directoryService = new DirectoryService(todoConfiguration.getTodoDirectoryConfigPath(),
            todoConfiguration.getYamlObjectPath());
        this.todoConfiguration = todoConfiguration;
    }
    @Path("/v1/getAll")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAll() {
        DirectoryConfig directoryConfig = todoConfiguration.getDirectoryConfig();
        logger.info("getAll : In");
        String res = "";
        ArrayList<String> allFiles = new ArrayList<String>();
        for (String folderPath : directoryConfig.getRelativePath()) {
            logger.info("Searching files in : {}", folderPath);
            allFiles.addAll(directoryService.getAllFiles(folderPath, folderPath, true));
        }
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
    @Produces(MediaType.TEXT_HTML)
    public Response getFile(@QueryParam("name") String fileName) {
        logger.info("getFile : In : fileName : {}", fileName);
        DirectoryConfig directoryConfig = todoConfiguration.getDirectoryConfig();
        String fileData = null;
        String line;
        BufferedReader bufferedReader = null;
        try {
            String[] fileArray = fileName.split("\\.");
            if (fileArray.length > 1) {
                String fileExt = fileArray[fileArray.length - 1];
                if (directoryConfig.getSupportedGetFile().contains(fileExt)) {
                    bufferedReader = directoryService.getFile(directoryConfig.getRelativePath(), fileName);
                    fileData = "";
                    while ((line=bufferedReader.readLine()) != null) {
                        if (directoryConfig.getSkipLineBreakFile().contains(fileExt)) {
                            fileData += line;
                        } else {
                            fileData += line + "<br>";
                        }
                    }
                } else {
                    fileData = "Unsupported file format";
                }
            } else {
                fileData = "Unsupported file format";
            }
        } catch (TodoException todoe) {
            fileData = todoe.getMessage();
            logger.info("Error parsing file : {} : {}", fileName, fileData);
        } catch (Exception e) {
            fileData = "Invalid arguments";
            logger.info("Error parsing file : {} : {} : {}", fileName, fileData, e);
        }
        logger.info("getFile : Out : {}", fileName);
        return Response.ok(fileData).build();
    }
    @Path("/v1/filter")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getFilteredFiles(@QueryParam("type") String fileTypes) {
        logger.info("getFilteredFiles : In : fileType : {}", fileTypes);
        DirectoryConfig directoryConfig = todoConfiguration.getDirectoryConfig();
        String res = "";
        if (fileTypes == null) {
            res = "Invalid fileType : null";
            return Response.ok(res).build();
        }
        ArrayList<String> requiredFileTypes = StringUtils.tokanizeString(fileTypes, ",");
        if (requiredFileTypes.size() > 0) {
            for (String str : requiredFileTypes) {
                if (!directoryConfig.getSupportedGetFile().contains(str)) {
                    res = "One or more unsupported fileType : " + fileTypes;
                    return Response.ok(res).build();
                }
            }
        } else {
            res = "Invalid fileType";
            return Response.ok(res).build();
        }
        ArrayList<String> allFiles = new ArrayList<String>();
        ArrayList<String> allFilesV2 = new ArrayList<String>();
        for (String folderPath : directoryConfig.getRelativePath()) {
            logger.info("Finding files in : {}", folderPath);
            allFiles.addAll(directoryService.getAllFiles(folderPath, folderPath, true));
        }
        for (String str : requiredFileTypes) {
            allFilesV2.addAll(directoryService.filterFiles(allFiles, str));
        }
        allFiles = directoryService.createLink(allFilesV2, true);
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getFilteredFiles : Out");
        return Response.ok(res).build();
    }
    @Path("/v1/yaml")
    @GET
    public YamlObject getYamlObject() throws TodoException {
        logger.info("getYamlObject : In");
        YamlObject yamlObject = directoryService.getYamlObject();
        logger.info("getYamlFileName : Out");
        return yamlObject;
    }
}
