<!DOCTYPE html>
<html>
<title>Submit message</title>
<link rel="stylesheet" type="text/css" href="/assets/static/bootstrap-3.3.7-dist/css/bootstrap.css">
<body>
<div class="container"><div class="row">
    <h1>Submit message</h1>
    <form action="/files/v1/query/submit" method="post">
        <div>
            <table>
                <tbody>
                <tr>
                    <td width="130px">File name</td>
                    <td><input type="text" name="filename" value="message"/><input type="text" name="ext" value=".txt"/></td>
                </tr>
                <tr>
                    <td>Message</td>
                    <td><textarea name="message" style="width: 310px; height: 150px;"></textarea></td>
                </tr>
                <tr>
                    <td><span>Overwrite</span><input type="checkbox" name="overwrite" value="yes"/></td>
                    <td><input type="submit" value="Submit" /></td>
                </tr>
                </tbody>
            </table>
        </div>
    </form>
</div></div>
</body>
</html>