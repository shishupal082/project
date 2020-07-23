package com.project.ftp.service;

import com.project.ftp.FtpConfiguration;
import com.project.ftp.common.DateUtilities;
import com.project.ftp.common.StrUtils;
import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.FileMimeType;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.parser.YamlFileParser;
import com.project.ftp.pdf.TextToPdfService;
import com.project.ftp.session.SessionService;
import org.eclipse.jetty.server.Request;
import org.glassfish.jersey.server.ContainerRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import java.util.HashMap;
import java.util.Map;

public class StaticService {
    final static Logger logger = LoggerFactory.getLogger(StaticService.class);
    final static SysUtils sysUtils = new SysUtils();
    final static StrUtils strUtils = new StrUtils();
    final static DateUtilities dateUtilities = new DateUtilities();
    final static FileService fileService = new FileService();
    public static PathInfo getPathInfo(String requestedPath) {
        return fileService.getPathInfo(requestedPath);
    }
    public static String getDateStrFromPattern(String pattern) {
        return dateUtilities.getDateStrFromPattern(pattern);
    }
    public static String generateStringFromFormat(AppConfig appConfig, HashMap<String, String> values) {
        SysUtils sysUtils = new SysUtils();
        String format = AppConstant.DateTimeFormat2;
        String configFileFormat = appConfig.getFtpConfiguration().getFilenameFormat();
        if (configFileFormat != null) {
            format = configFileFormat;
        }
        String result = dateUtilities.getDateStrFromPattern(format);
        String key, value;
        for (Map.Entry<String, String> entry: values.entrySet()) {
            key = entry.getKey();
            value = entry.getValue();
            if (result.contains(key) && value != null) {
                result = result.replace(key, value);
            }
        }
        return result;
    }
    public static void renameOldLogFile(final String relativeConfigFilePath) {
        if (relativeConfigFilePath == null) {
            return;
        }
        String configFilePath = sysUtils.getProjectWorkingDir() + "/" + relativeConfigFilePath;
        configFilePath = strUtils.replaceBackSlashToSlash(configFilePath);
        YamlFileParser ymlFileParser = new YamlFileParser();
        String logFilePath = ymlFileParser.getLogFilePath(configFilePath);
        PathInfo pathInfo = fileService.getPathInfo(logFilePath);
        if (AppConstant.FILE.equals(pathInfo.getType())) {
            String newLogFilePath = pathInfo.getParentFolder() + "/" + pathInfo.getFilenameWithoutExt() +
                    "-" + dateUtilities.getDateStrFromPattern(AppConstant.DateTimeFormat4) + "." + pathInfo.getExtension();
            Boolean copyStatus = fileService.copyFileV2(logFilePath, newLogFilePath);
            if (copyStatus) {
                Boolean deleteStatus = fileService.deleteFileV2(logFilePath);
                if (!deleteStatus) {
                    sysUtils.printLog("Error in deleting old log file: " + logFilePath);
                }
            } else {
                sysUtils.printLog("Error in copying log file: " + logFilePath);
            }
        }
    }
    public static void initApplication(final AppConfig appConfig) {
        FtpConfiguration ftpConfiguration = appConfig.getFtpConfiguration();
        ConfigService configService = new ConfigService(appConfig);
        configService.setPublicDir();
        String ftl = ftpConfiguration.getAppViewFtlFileName();
        String indexPageReRoute = ftpConfiguration.getIndexPageReRoute();
        if (ftl == null) {
            ftl = AppConstant.APP_VIEW_FTL_FILENAME;
        }
        if (indexPageReRoute == null) {
            indexPageReRoute = AppConstant.INDEX_PAGE_RE_ROUTE;
        }
        ftpConfiguration.setAppViewFtlFileName(ftl);
        ftpConfiguration.setIndexPageReRoute(indexPageReRoute);
        TextToPdfService textToPdfService = new TextToPdfService();
        Boolean createReadmePdf = ftpConfiguration.getCreateReadmePdf();
        if (createReadmePdf != null && createReadmePdf) {
            textToPdfService.convertReadmeTextToPdf();
        }
    }
    public static String getDateStrFromTimeMs(String format, Long timeInMs) {
        DateUtilities dateUtilities = new DateUtilities();
        return dateUtilities.getDateStrFromTimeMs(format, timeInMs);
    }
    public static String updateSessionId(AppConfig appConfig, String cookieData) {
        SessionService sessionService = new SessionService(appConfig);
        return sessionService.updateSessionId(cookieData);
    }
    public static String replaceLast(String find, String replace, String str) {
        return strUtils.replaceLast(find, replace, str);
    }
    public static void printLog(Object logStr) {
        sysUtils.printLog(logStr);
    }
    public static String replaceBackSlashToSlash(String str) {
        return strUtils.replaceBackSlashToSlash(str);
    }
    public static String getPathUrl(final HttpServletRequest request) {
        String path = ((Request) request).getUri().toString();
        String[] pathArr = path.split("\\?");
        if (pathArr.length > 0) {
            path = pathArr[0];
        }
        return path;
    }
    public static String getPathUrlV2(final ContainerRequestContext requestContext) {
        String path = ((ContainerRequest) requestContext).getPath(true);
        String[] pathArr = path.split("\\?");
        if (pathArr.length > 0) {
            path = pathArr[0];
        }
        return path;
    }
    public static String getFileMimeTypeValue(String name) {
        if (name == null) {
            return null;
        }
        name = name.toLowerCase();
        String response = null;
        FileMimeType fileMimeType;
        try {
            fileMimeType = FileMimeType.valueOf(name);
            response = fileMimeType.getFileMimeType();
        } catch (Exception e) {
//            logger.info("Error in parsing enum ({}): {}", name, e.getMessage());
        }
        return response;
    }
}
