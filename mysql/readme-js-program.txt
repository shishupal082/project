Database required for java script application:
-----------------------------------------------
username: mysqljs
password: mysqljs

mysqljs user details under: mysql --> readme.txt

Database ftpapp

create table ping_status(
    -- auto-generated primary key
    s_no bigint primary key not null auto_increment,
    did varchar(128) default null,
    dip varchar(128) default null,
    status varchar(128) default null,
    response_id varchar(128) default null,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted boolean default false
);

create table device_info(
    -- auto-generated primary key
    s_no bigint primary key not null auto_increment,
    did varchar(128) not null unique,
    dip varchar(128) not null unique,
    dname varchar(128) default null,
    dtype varchar(128) default null,
    railway_unit varchar(128) default null,
    remarks varchar(256) default null,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted boolean default false
);
