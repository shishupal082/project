 create table employee(
 -- auto-generated primary key
     id bigint primary key not null,
     firstName varchar(255) not null,
     lastName varchar(63) default null,
     email varchar(255) default null
 );
