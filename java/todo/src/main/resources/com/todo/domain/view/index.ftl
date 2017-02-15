<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Todo Index</title>
    <link rel="stylesheet" type="text/css" href="/assets/static/bootstrap-3.3.7-dist/css/bootstrap.css">
</head>
<body>
<div class="container">
    <div class="row">
        <div class="text-center">Todo Index</div>
        <div>
            <table>
                <tr>
                    <td width="160px"><a href="/">Index page</a></td>
                    <td>/</td>
                </tr>
                <tr>
                    <td><a href="/dashboard">View dashboard</a></td>
                    <td>/dashboard</td>
                </tr>
                <tr>
                    <td><a href="/todo/all">View all todo</a></td>
                    <td>/todo/all</td>
                </tr>
                <tr>
                    <td><a href="/todo/id/1">View todo</a></td>
                    <td>/todo/id/1</td>
                </tr>
                <tr>
                    <td><a href="/api/todo/v1/all">Get all todo</a></td>
                    <td>/api/todo/v1/id/all</td>
                </tr>
                <tr>
                    <td><a href="/api/todo/v1/id/1">Get todo by Id</a></td>
                    <td>/api/todo/v1/id/1</td>
                </tr>
                <tr>
                    <td><a href="/api/todo/v1/socket?query=127.0.0.1!!!8000!!!test|END">Call socket</a></td>
                    <td>/api/todo/v1/socket?query=127.0.0.1!!!8000!!!test|END</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/getAll">List all files</a></td>
                    <td>/files/v1/getAll</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/get?name=test.txt">Get text file</a></td>
                    <td>/files/v1/get?name=test.txt</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/download?name=test.txt">Download file</a></td>
                    <td>/files/v1/download?name=test.txt</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/filter?type=txt,csv">Filter files</a></td>
                    <td>/files/v1/filter?type=txt,csv</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/filter/download?type=txt,csv">Download filtered files</a></td>
                    <td>/files/v1/filter?type=txt,csv</td>
                </tr>
                <tr>
                    <td><a href="/api/config/v1/yaml">Get yaml file</a></td>
                    <td>/api/config/v1/yaml</td>
                </tr>
                <tr>
                    <td><a href="/api/config/v1/get/directory_config">Get directory config</a></td>
                    <td>/api/config/v1/get/directory_config</td>
                </tr>
                <tr>
                    <td><a href="/api/config/v1/update/directory_config">Update directory config</a></td>
                    <td>/api/config/v1/update/directory_config</td>
                </tr>
            </table>
        </div>
    </div>
</div>
</body>
</html>