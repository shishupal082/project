const express = require('express');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/dist/'));
app.get("/dashboard", function (req, res) {
    console.log("Request received: dashboard");
    res.sendFile(__dirname + '/dist/index.html');
});

app.get(/.*/, function (req, res) {
    console.log("Request received: default: "+req.url);
    res.sendFile(__dirname + '/dist/index.html');
});
app.listen(port);

console.log("server started on port: " + port);
