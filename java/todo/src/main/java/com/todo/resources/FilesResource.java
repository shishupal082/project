package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.file.config.FilesConfig;
import com.todo.file.constant.FilesConstant;
import com.todo.file.domain.FileDetails;
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
    @Path("/v1/get/data/{actualFileName}")
    @GET
    public FileDetails v1GetData(@PathParam("actualFileName") String actualFileName,
                             @QueryParam("name") String fileName) throws TodoException {
        logger.info("v1GetData : In : actualFileName : {}, fileName : {}", actualFileName, fileName);
        FileDetails fileDetails = filesService.getFileDetails(fileName);
        fileDetails.setFile(null);
        logger.info("v1GetData : Out : {}", fileName);
        return fileDetails;
    }
    @Path("/v1/get/view/{actualFileName}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response v1GetView(@PathParam("actualFileName") String actualFileName,
                                 @QueryParam("name") String fileName) throws TodoException {
        logger.info("v1GetData : In : actualFileName : {}, fileName : {}", actualFileName, fileName);
        String fileData = null;
        FileDetails fileDetails = filesService.getFileDetails(fileName);
        FilesConfig filesConfig = todoConfiguration.getFilesConfig();
        Response.ResponseBuilder r;
        try {
            if (filesConfig.getUnsupportedFileType().contains(fileDetails.getFileExtention())) {
                String downloadPath = FilesConstant.fileDownloadUrl+"?name=" + StringUtils.urlEncode(fileName);
                logger.info("Unsupported fileType : {}, found in : {} : redirect to download : path={}",
                    fileDetails.getFileExtention(), filesConfig.getUnsupportedFileType(), downloadPath);
                r = Response.seeOther(new URI(downloadPath));
            } else {
                r = Response.ok(fileDetails.getFile(), fileDetails.getFileMemType());
            }
            logger.info("getFile : Out : {}", fileName);
            return r.build();
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
    @Path("/v1/get/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response v1GetViewDirect(@QueryParam("name") String fileName) throws TodoException {
        logger.info("v1GetViewDirect : In : , fileName : {}", fileName);
        Response response = v1GetView(null, fileName);
        logger.info("v1GetViewDirect : Out : {}", fileName);
        return response;
    }
    @Path("/v1/get/download")
    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(@QueryParam("name") String fileName) throws TodoException {
        logger.info("downloadFile : in : fileName : {}", fileName);
        FileDetails fileDetails = filesService.getFileDetails(fileName);
        try {
            InputStream inputStream = new FileInputStream(fileDetails.getFilePath());
            return Response.ok(inputStream)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=" + fileName)
                .build();
        } catch (FileNotFoundException fn) {
            logger.info("fileName : {}, not found", fileName);
            throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
        }
    }
    @Path("/v1/filter/data")
    @GET
    public ArrayList<ScanResult> getFilteredFilesData(@QueryParam("type") String fileTypes) throws TodoException {
        logger.info("getFilteredFiles : In : fileType : {}", fileTypes);
        ArrayList<String> requiredFileTypes = null;
        if (fileTypes == null) {
            logger.info("Unsupported: fileType : null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        } else {
            requiredFileTypes = StringUtils.tokanizeString(fileTypes, ",");
        }
        ArrayList<ScanResult> scanResultAllDirecotry = filesService.scanAllDirectory(true);
        ArrayList<ScanResult> totalFiles = filesService.getAllFilesFromScanedDirectory(scanResultAllDirecotry);
        ArrayList<ScanResult> filteredFiles;

        if (fileTypes.equals("all")) {
            filteredFiles = totalFiles;
        } else {
            filteredFiles = filesService.filterFilesByExtention(totalFiles, requiredFileTypes);
        }

        logger.info("getFilteredFiles : Out");
        return filteredFiles;
    }
    @Path("/v1/filter/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getFilteredFilesView(@QueryParam("type") String fileTypes) throws TodoException {
        logger.info("getFilteredFiles : In : fileType : {}", fileTypes);
        String res = FilesConstant.noFileFound;
        ArrayList<String> requiredFileTypes = null;
        if (fileTypes == null) {
            logger.info("Unsupported: fileType : null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        } else {
            requiredFileTypes = StringUtils.tokanizeString(fileTypes, ",");
        }
        ArrayList<ScanResult> scanResultAllDirecotry = filesService.scanAllDirectory(true);
        ArrayList<ScanResult> totalFiles = filesService.getAllFilesFromScanedDirectory(scanResultAllDirecotry);
        ArrayList<ScanResult> filteredFiles;

        if (fileTypes.equals("all")) {
            filteredFiles = totalFiles;
        } else {
            filteredFiles = filesService.filterFilesByExtention(totalFiles, requiredFileTypes);
        }
        ArrayList<String> allFiles = filesService.createLinkV3(filteredFiles);
        if (allFiles.size() > 0) {
            res = "";
        }
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getFilteredFiles : Out");
        return Response.ok(res).build();
    }
    @Path("/v2/getAll/data")
    @GET
    public ArrayList<ScanResult> getAllV2Data() throws TodoException {
        logger.info("getAllV2Data : In");
        ArrayList<ScanResult> scanResultAllDirecotry = filesService.scanAllDirectory(true);
        logger.info("getAllV2Data : Out");
        return scanResultAllDirecotry;
    }
    @Path("/v2/getAll/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAllV2View() throws TodoException {
        logger.info("getAllV2View : In");
        ArrayList<ScanResult> scanResultAllDirecotry = filesService.scanAllDirectory(true);
        ArrayList<String> allFiles = filesService.createLinkV3(scanResultAllDirecotry);
        String res = FilesConstant.noFileFound;
        if (allFiles.size() > 0) {
            res = "";
        }
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getAllV2View : Out");
        return Response.ok(res).build();
    }
    @Path("/v2/getAll/index/{index}/data")
    @GET
    public ScanResult getAllV2IndexData(@PathParam("index") String index) throws TodoException {
        logger.info("getAllV2IndexData : In");
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
        ScanResult response = filesService.scanDirectory(scanDir, scanDir, true);
        logger.info("getAllV2IndexData : Out");
        return response;
    }
    @Path("/v2/getAll/index/{index}/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAllV2IndexView(@PathParam("index") String index) throws TodoException {
        logger.info("getAllV2IndexView : In");
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
        ScanResult scanResultDirecotry = filesService.scanDirectory(scanDir, scanDir, true);
        ArrayList<String> allFiles = filesService.createLinkV2(scanResultDirecotry);
        String res = allFiles.size() > 0 ? "" : FilesConstant.noFileFound;
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getAllV2IndexView : Out");
        return Response.ok(res).build();
    }
    @Path("/v3/getAll/data")
    @GET
    public ArrayList<ScanResult> getAllV3Data() throws TodoException {
        logger.info("getAllV3Data : In");
        ArrayList<ScanResult> scanResultAllDirecotry = filesService.scanAllDirectory(false);
        logger.info("getAllV3Data : Out");
        return scanResultAllDirecotry;
    }
    @Path("/v3/getAll/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAllV3View() throws TodoException {
        logger.info("getAllV3View : In");
        ArrayList<ScanResult> scanResultAllDirecotry = filesService.scanAllDirectory(false);
        ArrayList<String> allFiles = filesService.createLinkV3(scanResultAllDirecotry);
        String res = FilesConstant.noFileFound;
        if (allFiles.size() > 0) {
            res = "";
        }
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getAllV3View : Out");
        return Response.ok(res).build();
    }
    @Path("/v3/getAll/index/{index}/data")
    @GET
    public ScanResult getAllV3IndexData(@PathParam("index") String index) throws TodoException {
        logger.info("getAllV3IndexData : In");
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
        ScanResult response = filesService.scanDirectory(scanDir, scanDir, false);
        logger.info("getAllV3IndexData : Out");
        return response;
    }
    @Path("/v3/getAll/index/{index}/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getAllV3IndexView(@PathParam("index") String index) throws TodoException {
        logger.info("getAllV3IndexView : In");
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
        ScanResult scanResultDirecotry = filesService.scanDirectory(scanDir, scanDir, false);
        ArrayList<String> allFiles = filesService.createLinkV2(scanResultDirecotry);
        String res = allFiles.size() > 0 ? "" : FilesConstant.noFileFound;
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getAllV3IndexView : Out");
        return Response.ok(res).build();
    }
}
