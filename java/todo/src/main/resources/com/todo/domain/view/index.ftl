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
                    <td><a href="/index">Index page (Route to /)</a></td>
                    <td>/index</td>
                </tr>
                <tr>
                    <td><a href="/dashboard">Dashboard</a></td>
                    <td>/dashboard</td>
                </tr>
                <tr>
                    <td><a href="/api/todo/v1/get?id=1">Get todo by Id</a></td>
                    <td>/api/todo/v1/get?id=1</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/getAll">List all files</a></td>
                    <td>/files/v1/getAll</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/filter?type=txt,csv">Filter available files</a></td>
                    <td>/files/v1/filter?type=txt,csv</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/get?name=test.txt">Get text file</a></td>
                    <td>/files/v1/get?name=test.txt</td>
                </tr>
                <tr>
                    <td><a href="/files/v1/yaml">Get yaml file</a></td>
                    <td>/files/v1/yaml</td>
                </tr>
            </table>
        </div>
    </div>
</div>
</body>
</html>