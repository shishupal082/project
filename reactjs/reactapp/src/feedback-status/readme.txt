2021-08-08
--------------------------------------------------------------------
1) S.No.   2) Date  3) Course code   4) Feedback   5) Department   6) Action    7) Date of complience     8) Status   9) Remarks by DG/ADG

****************************************************

Create new database in mysql called ftpapp

it should have 2 tables
	- users and event_data


****************************************************

Roles
- training section can view all department data
- all department except training can view respective department and training section
- DG/ADG can view all user data

Roles group
- admin
- DG_ADG
- SignalTeam
- TelecomTeam
- AdminTeam
- TrainingSection

admin:
	- Shishupal

isAdminUser: admin
isDevUser: admin
isLoginOtherUserEnable: admin
isUsersControlEnable: admin
isAddTextEnable: true
isDeleteFileEnable: false
isLogin: true

*************************************************************************************

Roles depedent users
DG_ADG
	- SignalTeam
	- TelecomTeam
	- AdminTeam
	- TrainingSection
TrainingSection
	- DG_ADG
	- SignalTeam
	- TelecomTeam
	- AdminTeam
SignalTeam
	- TrainingSection
TelecomTeam
	- TrainingSection
AdminTeam
	- TrainingSection

*************************************************************************************

Form-1
- add new feedback (sr.no. 1,2,3,4,5)
- enable only for training section
Form-2
- add comment by respective department with complience date
- enable for respective department only
Form-3
- add comment by DG_ADG with status update
- enable only for DG_ADG (after entry by respective department)


*************************************************************************************

csv_filename
1) feedback_entry (1 to 5) unique_id
2) action_on_feedback (6 and 7) feedback_unique_id --> action_id
	- each feedback_unique_id can have multiple comment by department
3) remarks_by_dg_adg (8 and 9) feedback_unique_id --> remarks_id
	- each feedback_unique_id can have multiple remarks by dg-adg


*************************************************************************************

page required
1) summary_page
	- display 4) feedback 6) action and 8) status
2) detail_page
	- display as it is mention from 1 to 5
	- then create note sheet below earch row
3) display_pages as per requirement


*************************************************************************************
csv_file data pattern
entry_date_time, table_name, unique_id, updated_by, orher fields as applicable


