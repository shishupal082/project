var Template = {};
Template["heading"] = [
    {
        "tag": "div.center",
        "className": "heading",
        "text": [
            {
                "tag": "div",
                "text": "Heading Line 1"
            },
            {
                "tag": "div",
                "text": "Larger Heading Line 2 Row"
            }
        ]
    }
];
Template["link"] = [
    {
        "tag": "div.center",
        "text": [
            {
                "tag": "a",
                "href": "/dashboard",
                "name": "link.dashboard",
                "className": "p-10px",
                "text": "Dashboard"
            },
            {
                "tag": "a",
                "href": "/forgot_password",
                "name": "link.forgot_password",
                "className": "p-10px",
                "text": "Forgot Password"
            },
            {
                "tag": "a",
                "href": "/change_password",
                "name": "link.change_password",
                "className": "p-10px",
                "text": "Change Password"
            },
            {
                "tag": "a",
                "href": "/upload_file",
                "name": "link.upload_file",
                "className": "p-10px",
                "text": "Upload File"
            },
            {
                "tag": "a",
                "name": "link.logout",
                "href": "/logout",
                "className": "p-10px",
                "text": "Logout"
            }
        ]
    },
    {
        "tag": "div.center",
        "text": [
            {
                "tag": "span",
                "text": "Login as: "
            },
            {
                "tag": "b",
                "name": "link.loginAs",
                "text": ""
            }
        ]
    }
];
Template["login"] = [
    {
        "tag": "div.div",
        "className": "form-div pt-40px",
        "text": {
            "tag": "form",
            "id": "login_form",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Login"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Username"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Password"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "text": "Submit"
                },
                {
                    "tag": "a",
                    "href": "/forgot_password",
                    "className": "p-10px",
                    "text": "Forgot Password"
                }
            ]
        }
    }
];
Template["forgot_password"] = [
    {
        "tag": "div.div",
        "className": "form-div pt-40px",
        "text": {
            "tag": "form",
            "id": "forgot_password",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Forgot Password"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "div.label",
                            "className": "pl-10px",
                            "text": "Please contact admin"
                        },
                        {
                            "tag": "div",
                            "text": {
                                "tag": "a",
                                "href": "/login",
                                "className": "p-10px",
                                "text": "Login"
                            }
                        }
                    ]
                }
            ]
        }
    }
];
Template["upload_file"] = [
    {
        "tag": "div.div",
        "className": "form-div",
        "text": {
            "tag": "form",
            "id": "upload_file_form",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Upload File"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "input",
                            "type": "file",
                            "name": "upload_file.file",
                            "id": "file"
                        }
                    ]
                },
                {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "text": "Submit"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "div",
                            "className": "text-danger pt-10px",
                            "name": "upload_file.message",
                            "text": ""
                        }
                    ]
                }
            ]
        }
    }
];
Template["change_password"] = [
    {
        "tag": "div.div",
        "className": "form-div",
        "text": {
            "tag": "form",
            "id": "change_password",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Change Password"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Old Password"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "New Password"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Confirm Password"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "text": "Submit"
                }
            ]
        }
    }
];
Template["dashboard"] = [
    {
        "tag": "div.div",
        "className": "dashboard",
        "text": [

        ]
    }
];

Template["noPageFound"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "",
        "name": "date",
        "text": "Page not found"
    }
}];
Template["loading"] = [
    {
        "tag": "div.center",
        "className": "loading",
        "text": "Loading..."
    }
];

export default Template;
