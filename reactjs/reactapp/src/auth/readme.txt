It contains only auth ui
(1) login
(2) logout
(3) register
(4) change_password
(5) forgot_password
(6) create_password
(7) login_other_user
(8) users_control
(9) permission_control
(10) compare_control
(11) api_role_mapping
(12) database_files

To enable ui link from template: each object shall have unique name and corresponding roleAccessMapping

(2) logout page:
If user is login, it will redirect to /login_other_user
If user is not login, it will redirect to /login
