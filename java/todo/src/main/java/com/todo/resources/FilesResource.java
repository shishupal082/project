package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.domain.ConfigDetails;
import com.todo.domain.view.CommonView;
import com.todo.file.constant.FilesConstant;
import com.todo.file.domain.FileDetails;
import com.todo.file.domain.ScanResult;
import com.todo.file.service.FilesService;
import com.todo.parser.IniFileParser;
import com.todo.parser.JsonFileParser;
import com.todo.utils.ErrorCodes;
import com.todo.utils.IpAddress;
import com.todo.utils.StringUtils;
import com.todo.utils.SystemUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.Map;

/**
 *
 * Created by shishupalkumar on 01/02/17.
 */
@Path("/files")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FilesResource {
    private static Logger logger = LoggerFactory.getLogger(FilesResource.class);
    private FilesService filesService;
    private TodoConfiguration todoConfiguration;
    @Context
    private HttpServletRequest httpServletRequest;

    public FilesResource(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
        this.filesService = new FilesService(todoConfiguration);
    }
    @Path("/v1/upload")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadFile(@FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail) throws TodoException {
        logger.info("uploadFile : In");
        String fileName = StringUtils.getAbsoluteFileName(fileDetail.getFileName());
        String ext = StringUtils.getFileExtention(fileDetail.getFileName());
        String saveMessagePath = todoConfiguration.getConfigInterface().getAppConfig().getMessageSavePath();
        if (SystemUtils.isValidDirectoryV2(saveMessagePath)) {
            if (SystemUtils.isFileExistV2(saveMessagePath + fileName + ext)) {
                if (!filesService.renameExistingFile(saveMessagePath, fileName, ext)) {
                    logger.info("Error in renaming existing file with same fileName : {}",
                            saveMessagePath + fileName);
                    throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
                }
            }
        } else {
            logger.info("Save message path is invalid : {}", saveMessagePath);
            throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
        }
        try {
            logger.info("File uploading: {} ...", fileName + ext);
            int read = 0;
            byte[] bytes = new byte[1024];
            OutputStream out = new FileOutputStream(new File(saveMessagePath + fileName + ext));
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
            out.flush();
            out.close();
            logger.info("File upload: {} success", fileName + ext);
        } catch (IOException e) {
            logger.info("Error in file upload : {}", e);
        }
        String output = "File uploaded to : " + fileDetail.toString();
        logger.info("uploadFile : Out");
        return Response.status(200).entity(output).build();
    }
    @Path("/v1/static")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response v1GetStaticFile(@QueryParam("name") String fileName) throws TodoException {
        logger.info("v1GetStaticFile : In : fileName : {}", fileName);
        if (fileName == null) {
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        fileName = filesService.parseFilePath(fileName);
        String fileData = null;
        FileDetails fileDetails = filesService.getStaticFileDetails(fileName);
        Response.ResponseBuilder r;
        try {
            r = Response.ok(fileDetails.getFile(), fileDetails.getFileMemType());
            logger.info("v1GetStaticFile : Out : {}", fileName);
            return r.build();
        } catch (TodoException todoe) {
            fileData = todoe.getMessage();
            logger.info("Error parsing file : {} : {}", fileName, fileData);
        } catch (Exception e) {
            fileData = "Invalid arguments";
            logger.info("Error parsing file : {} : {}", StringUtils.getLoggerObject(fileName, fileData, e));
            e.getStackTrace();
        }
        logger.info("v1GetStaticFile : Out : {}", fileName);
        return Response.ok(fileData).build();
    }
    @Path("/v1/upload/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public CommonView uploadFileView() throws TodoException {
        logger.info("uploadFileView : In : Out");
        return new CommonView(httpServletRequest, "file_upload.ftl");
    }
    @Path("/v1/query/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public CommonView fileQueryView() throws TodoException {
        logger.info("fileQueryView : In : Out : {}", IpAddress.getClientIpAddr(httpServletRequest));
        return new CommonView(httpServletRequest, "query_view.ftl");
    }
    @Path("/v1/query/submit")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_HTML)
    public Response fileQuerySubmit(@FormParam("message") String message,
                                    @FormParam("filename") String fileName,
                                    @FormParam("ext") String ext,
                                    @FormParam("overwrite") String overwrite) throws TodoException {
        boolean overWrite = "yes".equals(overwrite);
        logger.info("fileQuerySubmit : In : {}, {}, {}, {}",
                StringUtils.getLoggerObject(message, fileName, ext, overWrite));
        String saveMessagePath = todoConfiguration.getConfigInterface().getAppConfig().getMessageSavePath();
        if (!SystemUtils.isValidDirectoryV2(saveMessagePath)) {
            logger.info("Save message path is invalid : {}", saveMessagePath);
            throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
        }
        String response = filesService.saveMessage(message, fileName, ext, overWrite, 0);
        logger.info("fileQuerySubmit : Out : response : {}", response);
        response = "<center><span>" + response
            + "</span><span>&nbsp;&nbsp;&nbsp;</span><a href=" +
            FilesConstant.queryViewUrl+">Try again</a></center>";
        return Response.ok(response).build();
    }
    @Path("/v1/get/data/{actualFileName}")
    @GET
    public FileDetails v1GetData(@PathParam("actualFileName") String actualFileName,
                                 @QueryParam("name") String fileName) throws TodoException {
        logger.info("v1GetData : In : actualFileName : {}, fileName : {}", actualFileName, fileName);
        ConfigDetails configDetails = new ConfigDetails(todoConfiguration);
        Map<String, String> configFileMapper = null;
        if (fileName != null && fileName.split("todoConfiguration.").length > 1) {
            configFileMapper = configDetails.getConfigFileMapper();
        }
        FileDetails fileDetails = filesService.getFileDetails(fileName, configFileMapper);
        fileDetails.setFile(null);
        logger.info("v1GetData : Out : {}", fileName);
        return fileDetails;
    }
    @Path("/v1/get/view/{fileName}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response v1GetView(@PathParam("fileName") String fileName,
                              @QueryParam("name") String actualFileName) throws TodoException {
        logger.info("v1GetData : In : fileName : {}, actualFileName : {}", fileName, actualFileName);
        String fileData = null;
        ConfigDetails configDetails = new ConfigDetails(todoConfiguration);
        Map<String, String> configFileMapper = null;
        if (actualFileName != null && actualFileName.split("todoConfiguration.").length > 1) {
            configFileMapper = configDetails.getConfigFileMapper();
        }
        FileDetails fileDetails = filesService.getFileDetails(actualFileName, configFileMapper);
        Response.ResponseBuilder r;
        try {
            if (todoConfiguration.getDirectoryConfig().getUnsupportedFileType().contains(
                fileDetails.getFileExtention())) {
                String downloadPath = FilesConstant.fileDownloadUrl+"?name=" + StringUtils.urlEncode(actualFileName);
                logger.info("Unsupported fileType : {}, found in : {} : redirect to download : path={}",
                    StringUtils.getLoggerObject(fileDetails.getFileExtention(), todoConfiguration.getDirectoryConfig().getUnsupportedFileType(),
                            downloadPath));
                r = Response.seeOther(new URI(downloadPath));
            } else {
                r = Response.ok(fileDetails.getFile(), fileDetails.getFileMemType());
            }
            logger.info("getFile : Out : {}", actualFileName);
            return r.build();
        } catch (TodoException todoe) {
            fileData = todoe.getMessage();
            logger.info("Error parsing file : {} : {}", actualFileName, fileData);
        } catch (Exception e) {
            fileData = "Invalid arguments";
            logger.info("Error parsing file : {} : {} : {}",
                    StringUtils.getLoggerObject(actualFileName, fileData, e));
        }
        logger.info("getFile : Out : {}", actualFileName);
        return Response.ok(fileData).build();
    }
    @Path("/v1/get/view")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response v1GetViewDirect(@QueryParam("name") String fileName) throws TodoException {
        logger.info("v1GetViewDirect : In : fileName : {}", fileName);
        Response response = v1GetView(null, fileName);
        logger.info("v1GetViewDirect : Out : {}", fileName);
        return response;
    }
    @Path("/v1/get/download")
    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(@QueryParam("name") String fileName) throws TodoException {
        logger.info("downloadFile : in : fileName : {}", fileName);
        ConfigDetails configDetails = new ConfigDetails(todoConfiguration);
        Map<String, String> configFileMapper = null;
        if (fileName != null && fileName.split("todoConfiguration.").length > 1) {
            configFileMapper = configDetails.getConfigFileMapper();
            logger.info("File : {}, is a configuration file", fileName);
        }
        FileDetails fileDetails = filesService.getFileDetails(fileName, configFileMapper);
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
    @Path("/v1/get/download/{fileName}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response downloadFileV2(@QueryParam("name") String fileName) throws TodoException {
        logger.info("downloadFileV2 : In : fileName : {}", fileName);
        Response response = downloadFile(fileName);
        logger.info("downloadFileV2 : Out : {}", fileName);
        return response;
    }
    @Path("/v1/download/view/{fileName}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response downloadFileV3(@QueryParam("name") String fileName) throws TodoException {
        logger.info("downloadFileV3 : In : fileName : {}", fileName);
        Response response = downloadFile(fileName);
        logger.info("downloadFileV3 : Out : {}", fileName);
        return response;
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
        String res = allFiles.size() > 0 ? "" : FilesConstant.noFileFound;
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
        String res = allFiles.size() > 0 ? "" : FilesConstant.noFileFound;
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
            ArrayList<String> allRelativePath = todoConfiguration.getConfigInterface().getAppConfig().getRelativePath();
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
            ArrayList<String> allRelativePath = todoConfiguration.getConfigInterface().getAppConfig().getRelativePath();
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
        ArrayList<String> allFiles = new ArrayList<String>();
        for (int i=0; i<scanResultAllDirecotry.size(); i++) {
            allFiles.addAll(filesService.createLinkV4(scanResultAllDirecotry.get(i).getScanResults(), i));
        }
        String res = allFiles.size() > 0 ? "" : FilesConstant.noFileFound;
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
            ArrayList<String> allRelativePath = todoConfiguration.getConfigInterface().getAppConfig().getRelativePath();
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
    public Response getAllV3IndexView(@PathParam("index") String index,
                                      @QueryParam("path") String path) throws TodoException {
        logger.info("getAllV3IndexView : In");
        Integer directoryIndex;
        String scanDir = null, folderPath;
        try {
            directoryIndex = Integer.parseInt(index);
            ArrayList<String> allRelativePath = todoConfiguration.getConfigInterface().getAppConfig().getRelativePath();
            scanDir = allRelativePath.get(directoryIndex);
            folderPath = scanDir;
        } catch (Exception e) {
            logger.info("Invalid directory index : {}", e);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        if (path != null) {
            path = filesService.parseFilePath(path);
            folderPath = scanDir + path;
        }
        ScanResult scanResultDirecotry = filesService.scanDirectory(folderPath, scanDir, false);
        ArrayList<String> allFiles;
        allFiles = filesService.createLinkV4(scanResultDirecotry.getScanResults(), directoryIndex);
        String res = allFiles.size() > 0 ? "" : FilesConstant.noFileFound;
        for (String fileName : allFiles) {
            res += fileName + "<br>";
        }
        logger.info("getAllV3IndexView : Out");
        return Response.ok(res).build();
    }
    @Path("/v1/add_text")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response addTextToFile(@QueryParam("fileName") String fileName,
                                      @QueryParam("text") String text) throws TodoException {
        logger.info("addTextToFile {}, {}", fileName, text);
        String res = "Error";
        String addTextPath = todoConfiguration.getConfigInterface().getAppConfig().getAddTextPath();
        if (SystemUtils.isValidDirectoryV2(addTextPath)) {
            try {
                res = filesService.addNewLine(text, fileName);
            } catch (Exception e) {
                logger.info("Error in saving text : {}, in file : {}", text, fileName);
            }
        } else {
            logger.info("Add Text path is invalid : {}", addTextPath);
        }
        logger.info("addTextToFile out.");
        return Response.ok(res).build();
    }
    @Path("/v1/read_json")
    @GET
    public Object readJsonFile(@QueryParam("fileRef") String fileRef) throws TodoException {
        logger.info("readJsonFile : {}", fileRef);
        JsonFileParser jsonFileParser = new JsonFileParser(todoConfiguration);
        Object obj = jsonFileParser.getJsonFileResponse(fileRef);
        logger.info("readJsonFile out.");
        return obj;
    }
    @Path("/v1/read_ini")
    @GET
    public Object readIniFile() throws TodoException {
        logger.info("readIniFile : in");
        IniFileParser iniFileParser = new IniFileParser(todoConfiguration);
        Object obj = iniFileParser.parseIni();
        logger.info("readIniFile out.");
        return obj;
    }
}
