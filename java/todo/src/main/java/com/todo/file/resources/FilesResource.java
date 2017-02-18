package com.todo.file.resources;

import com.todo.TodoConfiguration;
import com.todo.file.config.FilesConfig;
import com.todo.file.domain.ScanResult;
import com.todo.file.service.FilesService;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 01/02/17.
 */
@Path("/files")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FilesResource {
    private static Logger logger = LoggerFactory.getLogger(FilesResource.class);
    private FilesService filesService;
    private TodoConfiguration todoConfiguration;
    public FilesResource(TodoConfiguration todoConfiguration) {
        this.filesService = new FilesService(todoConfiguration);
        this.todoConfiguration = todoConfiguration;
        FilesService.updateFileConfig(todoConfiguration);
    }
    @Path("/api/v1/config/get")
    @GET
    public FilesConfig v1ConfigGet() throws TodoException {
        logger.info("v1ConfigGet : In");
        FilesConfig filesConfig = todoConfiguration.getFilesConfig();
        if (filesConfig == null) {
            filesConfig = new FilesConfig();
        }
        logger.info("v1ConfigGet : Out : {}", filesConfig);
        return filesConfig;
    }
    @Path("/api/v1/config/update")
    @GET
    public FilesConfig v1ConfigUpdate() throws TodoException {
        logger.info("v1ConfigUpdate : In");
        FilesConfig filesConfig = filesService.updateFileConfig();
        logger.info("v1ConfigUpdate : Out : {}", filesConfig);
        return filesConfig;
    }
    @Path("/api/v2/data")
    @GET
    public ArrayList<ScanResult> getAllV2Data() throws TodoException {
        logger.info("getAll : In");
        ArrayList<ScanResult> response = new ArrayList<ScanResult>();
        ScanResult scanResult;
        for (String scanDir : todoConfiguration.getFilesConfig().getRelativePath()) {
            scanResult = filesService.getAllFilesV3(scanDir, scanDir, true);
            response.add(scanResult);
        }
        logger.info("getAll : Out");
        return response;
    }
    @Path("/api/v2/data/{index}")
    @GET
    public ScanResult getAllV2Index(@PathParam("index") String index) throws TodoException {
        logger.info("getAll : In");
        Integer directoryIndex;
        String scanDir = null;
        try {
            directoryIndex = Integer.parseInt(index);
            ArrayList<String> allRelativePath = todoConfiguration.getFilesConfig().getRelativePath();
            scanDir = allRelativePath.get(directoryIndex);
        } catch (Exception e) {
            logger.info("Invalid directory index : {}", e);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        ScanResult response = filesService.getAllFilesV3(scanDir, scanDir, true);
        logger.info("getAll : Out");
        return response;
    }
    @Path("/api/v3/data")
    @GET
    public ArrayList<ScanResult> v3getAllData() throws TodoException {
        logger.info("v3getAllData : In");
        ArrayList<ScanResult> response = new ArrayList<ScanResult>();
        ScanResult scanResult;
        for (String scanDir : todoConfiguration.getFilesConfig().getRelativePath()) {
            scanResult = filesService.getAllFilesV3(scanDir, scanDir, false);
            response.add(scanResult);
        }
        logger.info("v3getAllData : Out");
        return response;
    }
    @Path("/api/v3/data/{index}")
    @GET
    public ScanResult v3getAllDataIndex(@PathParam("index") String index) throws TodoException {
        logger.info("v3getAllDataIndex : In");
        Integer directoryIndex;
        String scanDir = null;
        try {
            directoryIndex = Integer.parseInt(index);
            ArrayList<String> allRelativePath = todoConfiguration.getFilesConfig().getRelativePath();
            scanDir = allRelativePath.get(directoryIndex);
        } catch (Exception e) {
            logger.info("Invalid directory index : {}", e);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        ScanResult scanResult = filesService.getAllFilesV3(scanDir, scanDir, false);
        logger.info("v3getAllDataIndex : Out");
        return scanResult;
    }
    @Path("/v1/getAll")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAll() throws TodoException {
        logger.info("getAll : In");
        ArrayList<String> allFiles = filesService.getAllFilesV2();
        allFiles = filesService.createLink(allFiles, true);
        String res = "";
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getAll : Out");
        return Response.ok(res).build();
    }

    @Path("/v2/getAll")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAllV2Dir() throws TodoException {
        logger.info("getAllV2Dir : In");
        ScanResult scanResult;
        ArrayList<String> allFileLinks = new ArrayList<String>();
        for (String scanDir : todoConfiguration.getFilesConfig().getRelativePath()) {
            scanResult = filesService.getAllFilesV3(scanDir, scanDir, true);
            allFileLinks.addAll(filesService.createLinkV2(scanResult));
        }
        String res = "";
        for (String fileName : allFileLinks) {
            res += fileName + "<br>";
        }
        logger.info("getAllV2Dir : Out");
        return Response.ok(res).build();
    }

    @Path("/v2/getAll/{index}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAllV2IndexDir(@PathParam("index") String index) throws TodoException {
        logger.info("getAllV2IndexDir : In");
        Integer directoryIndex;
        String scanDir = null;
        try {
            directoryIndex = Integer.parseInt(index);
            ArrayList<String> allRelativePath = todoConfiguration.getFilesConfig().getRelativePath();
            scanDir = allRelativePath.get(directoryIndex);
        } catch (Exception e) {
            logger.info("Invalid directory index : {}", e);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        ScanResult scanResult = filesService.getAllFilesV3(scanDir, scanDir, true);
        ArrayList<String> allFileLinks = filesService.createLinkV2(scanResult);
        String res = "";
        for (String fileName : allFileLinks) {
            res += fileName + "<br>";
        }
        logger.info("getAllV2IndexDir : Out");
        return Response.ok(res).build();
    }
    @Path("/v3/getAll")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response v3getAllDir() throws TodoException {
        logger.info("v3getAllDir : In");
        ScanResult scanResult;
        ArrayList<String> allFileLinks = new ArrayList<String>();
        for (String scanDir : todoConfiguration.getFilesConfig().getRelativePath()) {
            scanResult = filesService.getAllFilesV3(scanDir, scanDir, false);
            allFileLinks.addAll(filesService.createLinkV2(scanResult));
        }
        String res = "";
        for (String fileName : allFileLinks) {
            res += fileName + "<br>";
        }
        logger.info("getAllV2Dir : Out");
        return Response.ok(res).build();
    }

    @Path("/v3/getAll/{index}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response v3getAllDirIndex(@PathParam("index") String index) throws TodoException {
        logger.info("getAllV2IndexDir : In");
        Integer directoryIndex;
        String scanDir = null;
        try {
            directoryIndex = Integer.parseInt(index);
            ArrayList<String> allRelativePath = todoConfiguration.getFilesConfig().getRelativePath();
            scanDir = allRelativePath.get(directoryIndex);
        } catch (Exception e) {
            logger.info("Invalid directory index : {}", e);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        ScanResult scanResult = filesService.getAllFilesV3(scanDir, scanDir, false);
        ArrayList<String> allFileLinks = filesService.createLinkV2(scanResult);
        String res = "";
        for (String fileName : allFileLinks) {
            res += fileName + "<br>";
        }
        logger.info("getAllV2IndexDir : Out");
        return Response.ok(res).build();
    }
    @Path("/v1/get/{actualFileName}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response viewFile(@PathParam("actualFileName") String actualFileName,
                             @QueryParam("name") String fileName) throws TodoException {
        logger.info("getFile : In : actualFileName : {}, fileName : {}", actualFileName, fileName);
        String fileData = null;
        try {
            Map<String, Object> fileStatus =  filesService.getFileStatus(
                todoConfiguration.getFilesConfig().getRelativePath(), fileName);
            String filePath = (String) fileStatus.get("path");
            if (!(Boolean) fileStatus.get("status")) {
                throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
            }
            File f = new File(filePath);
            String[] fileArray = fileName.split("\\.");
            if (fileArray.length > 1) {
                String fileExt = fileArray[fileArray.length - 1];
                FilesConfig filesConfig = todoConfiguration.getFilesConfig();
                ArrayList<String> imageType = filesConfig.getImageType();
                ArrayList<String> applicationType = filesConfig.getApplicationType();
                ArrayList<String> textType = filesConfig.getTextType();
                ArrayList<String> unsupportedFileType = filesConfig.getUnsupportedType();
                Response.ResponseBuilder r;
                if (imageType.contains(fileExt)) {
                    r = Response.ok(f, "image/" + fileExt);
                } else if(applicationType.contains(fileExt)) {
                    r = Response.ok(f, "application/" + fileExt);
                } else if (textType.contains(fileExt)){
                    r = Response.ok(f, "text/" + fileExt);
                } else if(unsupportedFileType.contains(fileExt)) {
                    String downloadPath = "/files/v1/download?name=" + StringUtils.urlEncode(fileName);
                    logger.info("Unsupported fileType : {}, found in : {} : redirect to download : path={}",
                        fileExt, unsupportedFileType, downloadPath);
                    r = Response.seeOther(new URI(downloadPath));
                } else {
                    r = Response.ok(f);
                }
                return r.build();
            }
            return Response.ok(f).build();
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

    @Path("/v1/download")
    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(@QueryParam("name") String fileName) throws TodoException {
        logger.info("downloadFile : in : fileName : {}", fileName);
        Map<String, Object> fileStatus =  filesService.getFileStatus(
            todoConfiguration.getFilesConfig().getRelativePath(), fileName);
        if ((Boolean) fileStatus.get("status")) {
            String filePath = (String)fileStatus.get("path");
            try {
                InputStream inputStream = new FileInputStream(filePath);
                return Response.ok(inputStream)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + fileName)
                    .build();
            } catch (FileNotFoundException fn) {
                logger.info("fileName : {}, not found", fileName);
                throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
            }
        }
        logger.info("fileName : {}, not found", fileName);
        throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
    }

    @Path("/v1/filter")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getFilteredFiles(@QueryParam("type") String fileTypes) throws TodoException {
        logger.info("getFilteredFiles : In : fileType : {}", fileTypes);
        String res = "";
        ArrayList<String> requiredFileTypes = null;
        if (fileTypes == null) {
            logger.info("Unsupported: fileType : null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        } else {
            requiredFileTypes = StringUtils.tokanizeString(fileTypes, ",");
        }
        ArrayList<String> allFiles = filesService.getAllFilesV2();
        ArrayList<String> filteredFiles = new ArrayList<String>();

        if (fileTypes.equals("all")) {
            filteredFiles = allFiles;
        } else {
            for (String str : requiredFileTypes) {
                filteredFiles.addAll(filesService.filterFiles(allFiles, str));
            }
        }
        allFiles = filesService.createLink(filteredFiles, true);
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getFilteredFiles : Out");
        return Response.ok(res).build();
    }

    @Path("/v1/filter/download")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getFilteredDownLoadFiles(@QueryParam("type") String fileTypes) throws TodoException {
        logger.info("getFilteredDownLoadFiles : In : fileType : {}", fileTypes);
        String res = "";
        ArrayList<String> requiredFileTypes = null;
        if (fileTypes == null) {
            logger.info("Invalid fileTypes : null : throw BAD_REQUEST_ERROR");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        } else {
            requiredFileTypes = StringUtils.tokanizeString(fileTypes, ",");
        }
        ArrayList<String> allFiles = filesService.getAllFilesV2();
        ArrayList<String> filteredFiles = new ArrayList<String>();

        if (fileTypes.equals("all")) {
            filteredFiles = allFiles;
        } else {
            for (String str : requiredFileTypes) {
                filteredFiles.addAll(filesService.filterFiles(allFiles, str));
            }
        }
        filteredFiles = filesService.createDownloadLink(filteredFiles);
        for (String fileName : filteredFiles) {
            res += fileName + "<br>";
        }
        logger.info("getFilteredDownLoadFiles : Out");
        return Response.ok(res).build();
    }
}
