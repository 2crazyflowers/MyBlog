var express = require("express"),
    app = express();

app.get("/", function (req, res) {
    res.send("<h1>Home Page</h1>");
});

app.get("/about", function (req, res) {
    res.send("<h1>About Page</h1>");
});


var server = app.listen(3000, function(err){
    if(err) {
        console.log(err);
    }
    console.log('App started: Port 3000');
});