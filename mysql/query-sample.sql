show databases;
use ftpapp;


show tables;

desc staff_rnc;


select * from requisition_status;

ALTER TABLE requisition_status MODIFY row_unique_number varchar(255) default null;
INSERT INTO requisition_status (req_date,dp_date,remark_date,material_status,file_date,department,s_no,items,unit,
qty,demand_no,demand_date,budget,req_rate,req_amount,allocation,project_id,work_id,estimate_no,estimate_item_no,
po_number,dp,po_rate,po_amount,material_received_date,bill_paid,co7_number,req_remark,row_unique_number,project_id_item_no,
estimate_ref_count,estimate_remark,indent_status,category,sub_category,make) VALUES("", "", "2024-01-16", "Not received", 
"2024-09-03", "Signal", "1", "Underground Armoured... U/S Railway power cable (Stranded 7 x 1.40 mm) with high conductivity circular", "Km", "2", "SN234704656", "2024-01-16",
 "", "235...852.16", "471...704", "", "12.04.16.21.1.53.001", "RNC-Yard-remodeling", "", 25, "", "", "", "", "", "", "", "16.01.2024 Demand forwarded to GSD. Demand returned by Sr DMM/RNC on 20.10.23 for taking material from GSD/RNC", "RNC-Yard-remodeling-sig-power-cable-2-SN234704656", "12.04.16.21.1.53.00125", "1", "", "", "Cable", "10Sqx2C", "Cu");


ALTER TABLE requisition_status MODIFY req_remark varchar(1023) default null;

select * from staff_rnc where deleted=0;
select * from staff_rnc where hrms_id=null;
ALTER TABLE staff_rnc ADD sub_section varchar(63) DEFAULT NULL AFTER section;



select * from history_book where table_name="staff_rnc";
select * from history_book where table_name="requisition_status";
select * from history_book where table_name="smms_assets" order by added_time desc;

select * from history_book where deleted=0 and table_name="smms_assets" order by id desc;
UPDATE history_book set deleted=1 where table_name="smms_assets" and unique_column="mysql_error";

desc history_book;


select * from history_book where table_name="smms_assets" and added_time like "2024-09-01 21%" order by added_time desc;

select * from users;
desc event_data;
show tables;
INSERT INTO users (username, passcode) values ("Shishupal3","12345"), ("Shishupal10","12345");

select * from users where deleted=0 order by id desc limit 100;

select * from sia_data;

select * from smms_assets where deleted=0 and asset_code like "Test%";

select Count(*) from smms_assets where deleted=0 and added_time > "2024-08-27 08:00" order by updated_time desc;
select * from smms_assets where deleted=0 and added_time > "2024-08-27 08:00" order by updated_time desc;

UPDATE smms_assets SET deleted=1 where deleted=0 and file_date = "2024-09-01" and division="Ranchi";
Select * from smms_assets where deleted=0 and file_date = "2024-08-26" and division="Ranchi";

Select * from smms_assets where deleted=0 and division like "Test Ranchi";
Select * from smms_assets where deleted=0 and (asset_code like "OIPBKPR00001" or asset_code like "OIPBKPR00002" 
or asset_code like "OIPBLRG00001" or asset_code like "OIPBLRG00002");
Select * from smms_assets where deleted=0 order by updated_time desc;
Select * from smms_assets where deleted=1 and asset_code="BCBAG TN-1-TIS-NKM00001";
Select * from smms_assets where deleted=1 and location="AG TN-1-Tatisilwai-Namkom";
SELECT asset_code, COUNT(asset_code) FROM smms_assets where deleted=0 GROUP BY asset_code HAVING COUNT(asset_code) > 1;

desc smms_assets;
UPDATE smms_assets_v2 SET deleted=1;
select * from smms_assets_v2;

SELECT id, division, COUNT(division) FROM smms_assets where deleted=0 and division = "Ranchi" GROUP BY id, division, sub_section order by id desc;

Select * from history_book;
Select * from history_book order by added_time desc limit 10;

select location, added_time, updated_time from smms_assets where added_time > "2024-08-26 22:00" order by updated_time desc;


select DATE_FORMAT(added_time, "%Y-%m-%d-%H") as added_date_hour, added_time, concat(DATE(added_time), ":", MINUTE(added_time)) as h from smms_assets where added_time > "2024-08-26 22:00" order by updated_time desc;

desc smms_assets;

ALTER TABLE smms_assets MODIFY serial_no varchar(1023) default null;


select asset_code_v2, count(*) as count from smms_assets where deleted=0 group by asset_code_v2 having count(asset_code_v2)>1 order by count desc;

UPDATE smms_assets SET asset_code_v2=concat(COALESCE(asset_type,""),"--",COALESCE(location,""),"--",COALESCE(gear_name,""),"--",
COALESCE(serial_no,""),"--",COALESCE(latitude,""),"--",COALESCE(longitude,""));

select * from sia_data;
desc sia_data;

ALTER TABLE sia_data MODIFY failure_description varchar(1023) default null;


select * from event_data where event!="table_data" order by id asc;

select * from bill_details where bill_unique_number="PO-Mani-bhusan-ranchi-revenue-24";

select * from file_path order by id asc;
DROP TABLE file_path;

ALTER TABLE file_path RENAME COLUMN sizeInKb TO size_in_kb;

ALTER TABLE file_path change scanned_date scanned_date TIMESTAMP;

ALTER TABLE file_path ADD filename varchar(127) DEFAULT NULL AFTER pathname;

describe ftpapp.file_path;

desc file_path;


ALTER TABLE file_path change COLUMN size_in_kb size_in_kb double;

select updated_time,id,size,size_in_kb,pathname,edited_at,type,remark from file_path where deleted=0 order by updated_time desc;

select * from file_path where deleted=0 and (pathname like 'D:/workspace/ftp-application/FTP/meta-data/%') order by id desc;
select * from file_path where deleted=0 and (filename like '%.pdf') order by id desc;
desc file_path;
select * from file_path where deleted=0 and (scan_dir_mapping_id="test-4" or scan_dir_mapping_id="test-5") order by id desc;

select * from file_path where deleted=0 and (scan_dir_mapping_id='meta-data-dir') order by id desc;
select * from file_path where deleted=0 and (id=45 or id=35 or id=82 or id=5392) order by id desc;


select Count(*) from file_path order by updated_time desc;

select Count(*) from file_path where scan_dir_mapping_id="project"order by updated_time desc;
desc file_path;
ALTER TABLE file_path change scan_dir_mapping_id scan_dir_mapping_id varchar(511);



