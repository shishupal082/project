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
                <#list resourceDetails as r>
                    <tr>
                        <td><a href="${r.url}">${r.name}</a></td>
                        <td>${r.help}</td>
                    </tr>
                </#list>
            </table>
        </div>
    </div>
</div>
</body>
</html>