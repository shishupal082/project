<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reource Index</title>
    <link rel="stylesheet" type="text/css" href="/assets/static/bootstrap-3.3.7-dist/css/bootstrap.css">
</head>
<body>
<div class="container">
    <div class="row">
        <div class="text-center">Available links</div>
        <div style="display:none"><input type="text" name="index-page-re-route" value="${indexPageReRoute}"/></div>
        <div>
            <table>
                <#list resourceDetails as r>
                    <tr>
                        <td width="250px"><a href="${r.url}">${r.name}</a></td>
                        <td>${r.help}</td>
                    </tr>
                </#list>
            </table>
        </div>
    </div>
</div>
<script type="text/javascript" src="/assets/static/jquery-1.8.3.js"></script>
<script type="text/javascript" src="/assets/static/js/index.js"></script>
</body>
</html>