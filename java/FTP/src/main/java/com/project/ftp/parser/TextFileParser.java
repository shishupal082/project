package com.project.ftp.parser;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.service.StaticService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;

public class TextFileParser {
    final static Logger logger = LoggerFactory.getLogger(TextFileParser.class);
    final AppConfig appConfig;
    final String userDataFileName = "user_data.csv";
    public TextFileParser(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    public ArrayList<ArrayList<String>> getTextData() throws AppException {
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        String filepath = appConfig.getFtpConfiguration().getFileSaveDir();
        filepath += userDataFileName;
        PathInfo pathInfo = StaticService.getPathDetails(filepath);
        if (!AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Requested file is not found: {}", filepath);
            throw new AppException(ErrorCodes.FILE_NOT_FOUND);
        }
        try {
            File file = new File(filepath);
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(
                            new FileInputStream(file), AppConstant.UTF8));
            String str;
            String[] tempArr;
            ArrayList<String> temp;
            while ((str = in.readLine()) != null) {
                temp = new ArrayList<>();
                tempArr = str.split(",");
                for(String tempStr : tempArr) {
                    temp.add(tempStr);
                }
                result.add(temp);
            }
            in.close();
//            FileReader fr = new FileReader(file);
//            BufferedReader br = new BufferedReader(fr);
//            String line = "";
//            String[] tempArr;
//            ArrayList<String> temp;
//            while((line = br.readLine()) != null) {
//                temp = new ArrayList<>();
//                tempArr = line.split(",");
//                for(String tempStr : tempArr) {
//                    temp.add(tempStr);
//                }
//                result.add(temp);
//            }
//            br.close();
//            fr.close();
            logger.info("Text file read success: {}", filepath);
        } catch (Exception e) {
            logger.info("Error in reading text file: {}", e.getMessage());
            throw new AppException(ErrorCodes.INVALID_FILE_DATA);
        }
        return result;
    }
    public Boolean addText(String text) {
        boolean textAddStatus = false;
        String filepath = appConfig.getFtpConfiguration().getFileSaveDir();
        filepath += userDataFileName;
        PathInfo pathInfo = StaticService.getPathDetails(filepath);
        if (!AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Requested file is not found: {}", filepath);
            return false;
        }
        try {
            File file = new File(filepath);
            Writer writer = new BufferedWriter(new OutputStreamWriter(
                    new FileOutputStream(file, true), AppConstant.UTF8));
            writer.append("\n");
            writer.append(text);
            writer.close();
            logger.info("Text added in : {}", filepath);
            textAddStatus = true;
        } catch (Exception e) {
            logger.info("Error in adding text in filename: {}", filepath);
        }
        return textAddStatus;
    }
}
