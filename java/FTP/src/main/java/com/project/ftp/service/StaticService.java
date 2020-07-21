package com.project.ftp.service;

import com.project.ftp.FtpConfiguration;
import com.project.ftp.common.DateUtilities;
import com.project.ftp.common.StrUtils;
import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.FileMimeType;
import com.project.ftp.obj.PathInfo;
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
    public static PathInfo getPathDetails(String requestedPath) {
        FileService fileService = new FileService();
        return fileService.getPathInfo(requestedPath);
    }
    public static String getDateStrFromPattern(String pattern) {
        DateUtilities dateUtilities = new DateUtilities();
        return dateUtilities.getDateStrFromPattern(pattern);
    }
    public static String generateStringFromFormat(AppConfig appConfig, HashMap<String, String> values) {
        SysUtils sysUtils = new SysUtils();
        String format = AppConstant.FileFormate;
        String configFileFormat = appConfig.getFtpConfiguration().getFilenameFormat();
        if (configFileFormat != null) {
            format = configFileFormat;
        }
        String result = sysUtils.getDateTime(format);
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
        ftpConfiguration.setPermanentlyDeleteFile(true);
    }
    public static String getDateFromInMs(String format, Long timeInMs) {
        DateUtilities dateUtilities = new DateUtilities();
        return dateUtilities.getDateFromInMs(format, timeInMs);
    }
    public static String updateSessionId(AppConfig appConfig, String cookieData) {
        SessionService sessionService = new SessionService(appConfig);
        return sessionService.updateSessionId(cookieData);
    }
    public static String replaceLast(String find, String replace, String str) {
        StrUtils strUtils = new StrUtils();
        return strUtils.replaceLast(find, replace, str);
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
