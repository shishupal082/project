Role config keys:
(1) HashMap<String, ArrayList<String>> roleAccess;
(2) HashMap<String, ArrayList<String>> relatedUsers;
(3) ArrayList<String> coRelatedUsers;
(4) HashMap<String, ArrayList<String>> groupRelatedUsers;

(5) HashMap<String, String> roleAccessMapping;
(6) HashMap<String, ArrayList<String>> userRolesMapping;

Details about above keywords
----------------------------------------------

(1) roleAccess:
      groupName_g1: [U1, U2]
(2) relatedUsers:
      U1: [g1,g2]
(3) coRelatedUsers: [g1,g2]

- Here g1 and g2 user will be co-related in themself but g1 will not be co-related with g2 and vice-versa

(4) groupRelatedUsers:
      g1: [g2,g3]
      g3: [g1]

note:
Here, g1: [g1], is same as coRelatedUsers: [g1]

(5) roleAccessMapping:
      roleName: group_name_expression (g1|g2)
(6) userRolesMapping: (Internally generated)
      U1: [roleName1, roleName2]

- internally generated

preDefinedRoleAccess:
API uses this access:

apiName,roleAccess

/api/get_app_config,isDevUser
/api/get_session_config,isDevUser
/api/aes_encrypt,isDevUser
/api/aes_decrypt,isDevUser
/api/md5_encrypt,isDevUser
/api/get_roles_config,isDevUser


/api/get_users,isAdminUser
/api/get_database_files_info,isAdminUser
/api/update_config,isAdminUser

/api/reset_count,isUserControlEnable

/api/get_related_users_data,isUserControlEnable

/api/login_other_user,isLoginOtherUserEnable

,isAddTextEnable
,isInfiniteTTLLoginUser
,isDeleteTextEnable
,isUploadFileEnable
,isDeleteFileEnable
/api/get_users,getAllUsersEnable
