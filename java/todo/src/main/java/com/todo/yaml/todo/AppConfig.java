package com.todo.yaml.todo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 18/05/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppConfig {
    private static Logger LOGGER = LoggerFactory.getLogger(AppConfig.class);

    private HashMap<String, String> jsonFileMapping;
    private ArrayList<String> taskItemsPath;
    private ArrayList<String> taskApplicationPath;
    private ArrayList<String> relativePath;
    private ArrayList<String> uiPath;
    private String messageSavePath;
    private String resourcePath;
    private String addTextPath;
    private Map<String, String> tcpIpConfig;
    private String indexPageReRoute;
    private ArrayList<String> projectStaticDataConfigPath;
    private CommandConfig commandConfig;

    public HashMap<String, String> getJsonFileMapping() {
        return jsonFileMapping;
    }

    public void setJsonFileMapping(HashMap<String, String> jsonFileMapping) {
        this.jsonFileMapping = jsonFileMapping;
    }

    public ArrayList<String> getTaskItemsPath() {
        return taskItemsPath;
    }

    public void setTaskItemsPath(ArrayList<String> taskItemsPath) {
        this.taskItemsPath = taskItemsPath;
    }

    public ArrayList<String> getTaskApplicationPath() {
        return taskApplicationPath;
    }

    public void setTaskApplicationPath(ArrayList<String> taskApplicationPath) {
        this.taskApplicationPath = taskApplicationPath;
    }

    public ArrayList<String> getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(ArrayList<String> relativePath) {
        this.relativePath = relativePath;
    }

    public ArrayList<String> getUiPath() {
        return uiPath;
    }

    public void setUiPath(ArrayList<String> uiPath) {
        this.uiPath = uiPath;
    }

    public String getMessageSavePath() {
        return messageSavePath;
    }

    public void setMessageSavePath(String messageSavePath) {
        this.messageSavePath = messageSavePath;
    }

    public String getResourcePath() {
        return resourcePath;
    }

    public void setResourcePath(String resourcePath) {
        this.resourcePath = resourcePath;
    }

    public String getAddTextPath() {
        return addTextPath;
    }

    public void setAddTextPath(String addTextPath) {
        this.addTextPath = addTextPath;
    }
    public void merge(AppConfig tempAppConfig) {
        if (tempAppConfig.getJsonFileMapping() != null) {
            if (this.getJsonFileMapping() != null) {
                this.getJsonFileMapping().putAll(tempAppConfig.getJsonFileMapping());
            } else {
                this.setJsonFileMapping(tempAppConfig.getJsonFileMapping());
            }
        }

        if (tempAppConfig.getTaskItemsPath() != null) {
            if (this.getTaskItemsPath() != null) {
                this.getTaskItemsPath().addAll(tempAppConfig.getTaskItemsPath());
            } else {
                this.setTaskItemsPath(tempAppConfig.getTaskItemsPath());
            }
        }
        if (tempAppConfig.getTaskApplicationPath() != null) {
            if (this.getTaskApplicationPath() != null) {
                this.getTaskApplicationPath().addAll(tempAppConfig.getTaskApplicationPath());
            } else {
                this.setTaskApplicationPath(tempAppConfig.getTaskApplicationPath());
            }
        }
        if (tempAppConfig.getUiPath() != null) {
            if (this.getUiPath() != null) {
                this.getUiPath().addAll(tempAppConfig.getUiPath());
            } else {
                this.setUiPath(tempAppConfig.getUiPath());
            }
        }
        if (tempAppConfig.getRelativePath() != null) {
            if (this.getRelativePath() != null) {
                this.getRelativePath().addAll(tempAppConfig.getRelativePath());
            } else {
                this.setRelativePath(tempAppConfig.getRelativePath());
            }
        }
        if (tempAppConfig.getResourcePath() != null) {
            if (resourcePath != null) {
                LOGGER.info("Replacing old resourcePath : {} with : {}",
                        resourcePath, tempAppConfig.getResourcePath());
            }
            this.setResourcePath(tempAppConfig.getResourcePath());
        }
        if (tempAppConfig.getMessageSavePath() != null) {
            this.setMessageSavePath(tempAppConfig.getMessageSavePath());
        }
        if (tempAppConfig.getAddTextPath() != null) {
            if (addTextPath != null) {
                LOGGER.info("Replacing old addTextPath : {} with : {}",
                        addTextPath, tempAppConfig.getAddTextPath());
            }
            this.setAddTextPath(tempAppConfig.getAddTextPath());
        }
        if (tempAppConfig.getTcpIpConfig() != null) {
            if (tcpIpConfig != null) {
                tcpIpConfig.putAll(tempAppConfig.getTcpIpConfig());
            } else {
                tcpIpConfig = tempAppConfig.getTcpIpConfig();
            }
        }
        if (tempAppConfig.getIndexPageReRoute() != null) {
            if (indexPageReRoute != null) {
                LOGGER.info("Replacing old indexPageReRoute : {} with : {}",
                        indexPageReRoute, tempAppConfig.getIndexPageReRoute());
            }
            this.setIndexPageReRoute(tempAppConfig.getIndexPageReRoute());
        }
        if (tempAppConfig.getProjectStaticDataConfigPath() != null) {
            if (projectStaticDataConfigPath != null) {
                projectStaticDataConfigPath.addAll(tempAppConfig.getProjectStaticDataConfigPath());
            } else {
                projectStaticDataConfigPath = tempAppConfig.getProjectStaticDataConfigPath();
            }
        }
        if (tempAppConfig.getCommandConfig() != null) {
            if (commandConfig != null) {
                if (tempAppConfig.getCommandConfig().getCommandFilePaths() != null) {
                    if (commandConfig.getCommandFilePaths() != null) {
                        commandConfig.getCommandFilePaths().addAll(tempAppConfig.getCommandConfig().getCommandFilePaths());
                    } else {
                        commandConfig.setCommandFilePaths(tempAppConfig.getCommandConfig().getCommandFilePaths());
                    }
                }
                commandConfig.setCommandLogRequestFile(tempAppConfig.getCommandConfig().getCommandLogRequestFile());
                commandConfig.setCommandLogResponseFile(tempAppConfig.getCommandConfig().getCommandLogResponseFile());
            } else {
                commandConfig = tempAppConfig.getCommandConfig();
            }
        }
    }

    public CommandConfig getCommandConfig() {
        return commandConfig;
    }

    public void setCommandConfig(CommandConfig commandConfig) {
        this.commandConfig = commandConfig;
    }

    public Map<String, String> getTcpIpConfig() {
        return tcpIpConfig;
    }

    public void setTcpIpConfig(Map<String, String> tcpIpConfig) {
        this.tcpIpConfig = tcpIpConfig;
    }

    public String getIndexPageReRoute() {
        return indexPageReRoute;
    }

    public void setIndexPageReRoute(String indexPageReRoute) {
        this.indexPageReRoute = indexPageReRoute;
    }

    public ArrayList<String> getProjectStaticDataConfigPath() {
        return projectStaticDataConfigPath;
    }

    public void setProjectStaticDataConfigPath(ArrayList<String> projectStaticDataConfigPath) {
        this.projectStaticDataConfigPath = projectStaticDataConfigPath;
    }

    @Override
    public String toString() {
        return "AppConfig{" +
                "jsonFileMapping=" + jsonFileMapping +
                ", taskItemsPath=" + taskItemsPath +
                ", taskApplicationPath=" + taskApplicationPath +
                ", relativePath=" + relativePath +
                ", uiPath=" + uiPath +
                ", messageSavePath='" + messageSavePath + '\'' +
                ", resourcePath='" + resourcePath + '\'' +
                ", addTextPath='" + addTextPath + '\'' +
                ", tcpIpConfig=" + tcpIpConfig +
                ", indexPageReRoute='" + indexPageReRoute + '\'' +
                ", projectStaticDataConfigPath=" + projectStaticDataConfigPath +
                ", commandConfig='" + commandConfig + '\'' +
                '}';
    }
}
