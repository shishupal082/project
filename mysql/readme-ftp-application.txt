Database required for ftp-application:
-------------------------------------------
username: mysql
password: mysql

mysql user details
----------------------
Role --> Custom
Global privilage --> Select, Update, Insert

ftpapp database
----------------------

create database ftpapp;
use ftpapp;
create table event_data(
    -- auto-generated primary key
    id bigint primary key not null auto_increment,
    username varchar(255) default null,
    event varchar(127) default null,
    status varchar(63) default null,
    -- current timestamp
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reason varchar(255) default null,
    comment varchar(511) default null,
    -- boolean (tinyint, 1 byte, max = 127)
    deleted boolean default false
);
create table users(
    -- auto-generated primary key
    id bigint primary key not null auto_increment,
    username varchar(255) not null unique,
    password varchar(63) default null,
    mobile varchar(15) default null,
    email varchar(255) default null,
    name varchar(255) default null,
    passcode varchar(15) default null,
    create_password_otp varchar(15) default null,
    -- smallint (2 byte, 16 bit, max = 32767)
    change_password_count smallint default 0,
    method varchar(255) default null,
    -- current timestamp
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- boolean (tinyint, 1 byte, max = 127)
    deleted boolean default false
);
