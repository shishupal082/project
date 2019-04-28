package com.todo.interfaces;

import com.todo.domain.project_static_data.ProjectStaticData;
import com.todo.model.CommandsDB;
import com.todo.model.TaskConfigDB;
import com.todo.yaml.todo.AppConfig;

public interface ConfigInterface {
    AppConfig getAppConfig();
    AppConfig updateAppConfig();
    TaskConfigDB getTaskConfigDB(AppConfig appConfig);
    TaskConfigDB updateTaskConfigDB(AppConfig appConfig);
    ProjectStaticData getProjectStaticData(AppConfig appConfig);
    ProjectStaticData updateProjectStaticData(AppConfig appConfig);
    CommandsDB getCommandsDB(AppConfig appConfig);
    CommandsDB updateCommandsDB(AppConfig appConfig);
}
