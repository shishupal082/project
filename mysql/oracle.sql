ALTER TABLE smms_assets
MODIFY id NUMBER(6) primary key NOT NULL AUTO_INCREMENT;

select * from history_book where (deleted='0' and table_name='smms_assets') order by added_time desc FETCH FIRST 5 rows only;


SELECT asset_code,file_date,zone,division,sub_section,section_officer,section,location,deleted,COUNT(asset_code) as count FROM smms_assets where deleted='NO' GROUP BY asset_code,file_date,zone,division,sub_section,section_officer,section,location,deleted HAVING COUNT(asset_code) > 1;

select file_date,location,COUNT(asset_code) as count from smms_assets  where deleted='NO' group by file_date,zone,division,sub_section,section_officer,section,location HAVING COUNT(asset_code)>1 order by count desc

SELECT * from history_book where table_name="smms_asset_count";

and UNIQUE_COLUMN="mysql_error";

select * from SMSDATA;

select added_time,
to_char(cast(added_time as date),'YYYY-MM-DD') as added_date,
to_char(cast(added_time as TIME), 'hh24:mi:ss') as added_date_hr 
from history_book order by id desc;

select COUNT(*) from SMSDATA;

select * from SMSDATA;
order by id desc;

SELECT 
    table_name,
    unique_column,
    unique_parameter,
    column_name,
    old_value,
    new_value
FROM 
    history_book
WHERE 
    deleted = 0;

SELECT SMMS_ASSETS.LOCATION, SMMS_ASSETS.ASSET_TYPE, COUNT(*) as COUNT FROM SMMS_ASSETS 
INNER JOIN SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION 
where SMMS_ASSETS.DELETED=0 GROUP BY SMMS_ASSETS.LOCATION,SMMS_ASSETS.ASSET_TYPE;

SELECT SMMS_ASSETS.LOCATION as LOCATION, SMMS_ASSETS.ASSET_TYPE  as ASSET_TYPE, COUNT(*) AS COUNT, SMMS_ASSET_COUNT.division_asset_count as division_asset_count FROM SMMS_ASSETS 
INNER JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE 
WHERE SMMS_ASSETS.DELETED=0 AND SMMS_ASSET_COUNT.DELETED=0 GROUP BY SMMS_ASSETS.LOCATION,SMMS_ASSETS.ASSET_TYPE, SMMS_ASSET_COUNT.division_asset_count 
ORDER BY COUNT DESC;

SELECT location from smms_assets where location='Lohardaga  BS' and deleted='NO';



select SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.division_asset_count as division_asset_count,COUNT(*) AS COUNT 
from smms_assets 
LEFT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE  
where (smms_asset_count.deleted=0 and smms_assets.deleted=0 and smms_assets.location='Gangaghat') 
group by SMMS_ASSETS.LOCATION,SMMS_ASSETS.asset_type,SMMS_ASSET_COUNT.division_asset_count order by asset_type ASC;

select SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.division_asset_count as division_asset_count,COUNT(*) AS COUNT 
from SMMS_ASSET_COUNT 
LEFT JOIN smms_assets ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE  
where (smms_asset_count.deleted=0 and smms_assets.deleted=0 and smms_assets.location='Gangaghat') 
group by SMMS_ASSETS.LOCATION,SMMS_ASSETS.asset_type,SMMS_ASSET_COUNT.division_asset_count order by asset_type ASC;

-----START-------
select SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.ASSET_TYPE  as asset_type2,
SMMS_ASSET_COUNT.division_asset_count as division_asset_count, SMMS_ASSET_COUNT.deleted 
from smms_assets 
LEFT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE  
where (smms_assets.deleted=0 and smms_assets.location='AG TN-1-Tatisilwai-Namkom')
order by asset_type ASC;

select SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.ASSET_TYPE  as asset_type2,
SMMS_ASSET_COUNT.division_asset_count as division_asset_count, COUNT(*) as count
from smms_assets 
LEFT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE 
and smms_assets.deleted=SMMS_ASSET_COUNT.deleted 
where (smms_assets.deleted=0 and smms_assets.location='AG TN-1-Tatisilwai-Namkom')
group by SMMS_ASSETS.LOCATION,SMMS_ASSETS.ASSET_TYPE,SMMS_ASSET_COUNT.ASSET_TYPE,SMMS_ASSET_COUNT.division_asset_count 
order by asset_type ASC;

select SMMS_ASSET_COUNT.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.ASSET_TYPE  as asset_type2,
SMMS_ASSET_COUNT.division_asset_count as division_asset_count, COUNT(SMMS_ASSETS.ASSET_TYPE) as count
from smms_assets 
RIGHT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE 
and smms_assets.deleted=SMMS_ASSET_COUNT.deleted 
where (SMMS_ASSET_COUNT.deleted=0 and SMMS_ASSET_COUNT.location='AG TN-1-Tatisilwai-Namkom')
group by SMMS_ASSETS.LOCATION,SMMS_ASSET_COUNT.LOCATION,SMMS_ASSETS.ASSET_TYPE,SMMS_ASSET_COUNT.ASSET_TYPE,SMMS_ASSET_COUNT.division_asset_count 
order by asset_type ASC;

--------END------------

select SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.division_asset_count as division_asset_count,COUNT(*) AS COUNT 
from smms_assets 
RIGHT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE  
where (smms_asset_count.deleted=0 and smms_assets.deleted=0) 
group by SMMS_ASSETS.LOCATION,SMMS_ASSETS.asset_type,SMMS_ASSET_COUNT.division_asset_count order by LOCATION ASC;

 select SMMS_ASSETS.file_date as file_date,SMMS_ASSETS.sub_section as sub_section,SMMS_ASSETS.section_officer as section_officer,SMMS_ASSETS.division as division,
 SMMS_ASSETS.section as section,SMMS_ASSETS.location_type as location_type,SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,
 SMMS_ASSET_COUNT.division_asset_count as division_asset_count,COUNT(*) AS COUNT 
 from smms_assets 
 RIGHT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE  
 where (smms_assets.deleted=0) 
 group by SMMS_ASSETS.file_date,SMMS_ASSETS.sub_section,SMMS_ASSETS.section_officer,SMMS_ASSETS.division,SMMS_ASSETS.section,SMMS_ASSETS.location_type,SMMS_ASSETS.LOCATION,SMMS_ASSETS.asset_type,SMMS_ASSET_COUNT.division_asset_count 
 order by count desc;


select SMMS_ASSETS.file_date as file_date,
SMMS_ASSETS.sub_section as sub_section,
SMMS_ASSETS.section_officer as section_officer,SMMS_ASSETS.division as division,
SMMS_ASSETS.section as section,SMMS_ASSETS.location_type as location_type,
SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.division_asset_count as division_asset_count,
COUNT(*) AS COUNT 
from smms_assets 
RIGHT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE  
where (smms_assets.deleted=0) group by SMMS_ASSETS.file_date,SMMS_ASSETS.sub_section,SMMS_ASSETS.section_officer,
SMMS_ASSETS.division,SMMS_ASSETS.section,SMMS_ASSETS.location_type,SMMS_ASSETS.LOCATION,
SMMS_ASSETS.asset_type,SMMS_ASSET_COUNT.division_asset_count order by count desc;


 select SMMS_ASSETS.file_date as file_date,SMMS_ASSETS.sub_section as sub_section,SMMS_ASSETS.section_officer as section_officer,SMMS_ASSETS.division as division,SMMS_ASSETS.section as section,SMMS_ASSETS.location_type as location_type,SMMS_ASSETS.LOCATION as location,SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.division_asset_count as division_asset_count,COUNT(*) AS COUNT from smms_assets RIGHT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE  where (smms_assets.deleted=0) group by SMMS_ASSETS.file_date,SMMS_ASSETS.sub_section,SMMS_ASSETS.section_officer,SMMS_ASSETS.division,SMMS_ASSETS.section,SMMS_ASSETS.location_type,SMMS_ASSETS.LOCATION,SMMS_ASSETS.asset_type,SMMS_ASSET_COUNT.division_asset_count order by count desc


ALTER TABLE smms_assets MODIFY deleted VARCHAR(1);


DROP TABLE smms_assets;


select * from smms_assets where (deleted='FALSE' and asset_code='Test-DCTMURI00002');

select * from smms_assets  where (deleted='FALSE' and asset_code='Test-DCTMURI00002');

select TO_DATE(added_time,'DD-MM-YYYY') as added_date from smms_assets;
select ASSET_CODE, DELETED, ADDED_TIME from smms_assets;
select * from smms_assets where deleted=0;
select * from smms_assets where deleted=0 and asset_code='Test-DCTMURI00002';
UPDATE SMMS_ASSETS SET DELETED='YES' where division='Ranchi';

ALTER TABLE smms_assets_2024_09_18 rename to smms_assets_;
ALTER TABLE smms_assets_ rename to smms_assets;

select COUNT(*) from smms_assets where deleted='NO' and division='Ranchi' and file_date='2024-09-18';

UPDATE smms_assets SET deleted='YES' where deleted='NO' and division='Ranchi' and file_date='2024-09-18';

select file_date,zone,division,sub_section,section_officer,section,location,deleted,COUNT(*) as count
from smms_assets  where (division='Ranchi' and deleted='NO') 
group by file_date,zone,division,sub_section,section_officer,section,location,deleted order by count desc

select file_date,zone,division,sub_section,section_officer,section,location,deleted,COUNT(*) as count from smms_assets  where (division='Ranchi' and deleted='NO') group by file_date,zone,division,sub_section,section_officer,section,location,deleted order by count desc

select file_date,sub_section,section_officer,s_no,zone,division,section,location_type,location,asset_type,asset_code_v2 as asset_code,gear_name,rfid,make,model,serial_no,latitude,longitude,installation_date,waranty_expiry_date,status,added_time as added_date,updated_time from smms_assets  where (division='Ranchi' and deleted='NO')


select SMMS_ASSETS.file_date as file_date,SMMS_ASSETS.sub_section as sub_section,SMMS_ASSETS.section_officer as section_officer,
SMMS_ASSETS.division as division,SMMS_ASSETS.section as section,SMMS_ASSETS.location_type as location_type,SMMS_ASSETS.LOCATION as location,
SMMS_ASSETS.ASSET_TYPE  as asset_type,SMMS_ASSET_COUNT.division_asset_count as division_asset_count,COUNT(*) AS smms_count 
from smms_assets LEFT JOIN SMMS_ASSET_COUNT ON SMMS_ASSETS.LOCATION=SMMS_ASSET_COUNT.LOCATION and SMMS_ASSETS.ASSET_TYPE=SMMS_ASSET_COUNT.ASSET_TYPE and 
SMMS_ASSETS.DELETED=SMMS_ASSET_COUNT.DELETED 
where (smms_assets.division='Ranchi' and smms_assets.deleted='NO') 
group by SMMS_ASSETS.file_date,SMMS_ASSETS.sub_section,SMMS_ASSETS.section_officer,SMMS_ASSETS.division,SMMS_ASSETS.section,SMMS_ASSETS.location_type,SMMS_ASSETS.LOCATION,SMMS_ASSETS.asset_type,SMMS_ASSET_COUNT.division_asset_count 
order by smms_count desc;


UPDATE smms_assets SET deleted='0' where file_date='2024-09-18';

select * from smms_assets  
where (division='Ranchi' and zone='South Eastern Railway' and file_date='2024-09-10');

select file_date,zone,division,COUNT(*) as count from smms_assets  
where (deleted=0 and zone='South Eastern Railway' and division='Adra') 
group by file_date,zone,division order by count desc;

select file_date,deleted,division,COUNT(*) as count from smms_assets 
where division='Ranchi' and file_date='2024-09-10'
group by file_date,division,deleted order by count desc;

select file_date,zone,division,COUNT(*) as count from smms_assets  where (division=? and deleted=? and zone=?) group by file_date,zone,division order by count desc

select * from smms_assets where deleted = 0 and (ASSET_CODE='Test-DCTMURI00002');

desc smms_assets;
select * from smms_assets where deleted=0 and (asset_code='Test-DCTMURI00002');

ALTER TABLE smms_assets
MODIFY deleted NUMBER(1) default 0;

ALTER TABLE smms_assets ADD updated_time timestamp default systimestamp on_update systimestamp;

create table t1 (
    id NUMBER(3) primary key not null,
    item varchar(255) default null,
    id_t2 NUMBER(3) default 0
);

create table t2 (
    id NUMBER(3) primary key not null,
    item varchar(255) default null,
    id_t1 NUMBER(3) default 0
);

SELECT * from T1;

INSERT into T2 (ITEM, ID_T1) values('t2.item-5', 2);

select added_time, to_char(cast(added_time as date),'YYYY-MM-DD') as added_date from t2;

 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T1 
 inner JOIN T2 ON T1.id=T2.id_t1 order by item_t1;

 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T2 
 inner JOIN T1 ON T1.id=T2.id_t1 order by item_t1;

------START--------
 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T1 
 left JOIN T2 ON T1.id=T2.id_t1 order by item_t1;

 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T2 
 right JOIN T1 ON T1.id=T2.id_t1 order by item_t1;
------END--------

------START--------
 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T1 
 right JOIN T2 ON T2.id=T1.id_t2 order by item_t1;

 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T2 
 left JOIN T1 ON T2.id=T1.id_t2 order by item_t1;
------END--------


 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T1 
 left JOIN T2 ON T1.id=T2.id_t1 order by item_t1;

 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T2 
 left JOIN T1 ON T2.id=T1.id_t2 order by item_t1;

 select T1.item as item_t1,T2.item as item_t2, T1.id as t1_id, T2.id as t2_id
 from T2 
 left JOIN T1 ON T2.id=T1.id_t2 order by item_t1;


DROP TABLE SMMS_ASSET_COUNT;

create table smms_asset_count (
    id NUMBER(8) primary key not null,

    file_date varchar(255) default null,

    zone varchar(255) default null,
    division varchar(255) default null,
    section_officer varchar(255) default null,
    section varchar(255) default null,
    sub_section varchar(255) default null,
    location varchar(255) default null,
    asset_type varchar(255) default null,
    division_asset_count NUMBER(5) default null,
    unique_id varchar(511) default null,

    added_time TIMESTAMP NOT NULL,
    updated_time TIMESTAMP NOT NULL,
    deleted NUMBER(1) default 0
);


SELECT COUNT(*) from SMSUSERS;
SELECT * from SMSUSERS;

SELECT COUNT(*)from SMSFAULTCONFIG;
SELECT * from SMSFAULTCONFIG;

SELECT COUNT(*) from SMSFAULTS;

SELECT COUNT(*) from RHSETUP;

