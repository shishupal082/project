<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${configViewParams.title}</title>
    <link rel="stylesheet" type="text/css" href="/assets/static/bootstrap-3.3.7-dist/css/bootstrap.css">
</head>
<body>
<div class="container">
    <div class="row">
        <center>${configViewParams.heading}</center>
        <div>
            <table>
                <#list configViewParams.files as file>
                    <tr>
                        <td width="200px"><a href="/files/v1/get/view?name=${file}">${file}</a></td>
                    </tr>
                </#list>
            </table>
        </div>
    </div>
</div>
</body>
</html>