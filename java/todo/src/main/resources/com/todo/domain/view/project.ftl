<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
<#list projectViewParams.cssFiles as css>
    <link rel="stylesheet" type="text/css" href="${css}">
</#list>
    <title>${projectViewParams.title}</title>
</head>
<body>
<div style="display:none;">
    <input type="text" name="pathParams" value='<#list projectViewParams.pathParams as path>${path}/</#list>' />
    <input type="text" name="version" value='${projectViewParams.version}' />
    <input type="text" name="config" value='${projectViewParams.config}' />
</div>
${projectViewParams.html}
<#if projectViewParams.projectNotFound>
    <center>Page not found : 404</center>
    <center><a href="/project">Goto Project Dashboard</a></center>
</#if>
<#list projectViewParams.jsFiles as js>
<script type="text/javascript" src="${js}"></script>
</#list>
</body>
</html>
