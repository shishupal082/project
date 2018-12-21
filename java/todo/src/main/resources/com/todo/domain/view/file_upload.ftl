<!DOCTYPE html>
<html>
<title>File Upload</title>
<body>
<h1>File Upload</h1>
<form action="/files/v1/upload" method="post" enctype="multipart/form-data">
    <p>Select a file : <input type="file" name="file" size="45" /></p>
    <input type="submit" value="Upload It" />
</form>
</body>
</html>