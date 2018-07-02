const express = require("express"),
    app = express();
//view engine which will handle the front end side, which is ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

// const user = {
//     firstname: 'Sara',
//     lastname: 'Bracewell'
// }

// let data = "<h1>Testing</h1>"

// Below are HTTP methods. Routes for webpages, getting the static files
// route home page to render the home.ejs file
app.get("/", function (req, res) {
    res.render('home');
});

//route for about page
app.get("/about", function (req, res) {
    res.render('about');
});

app.get("/contact", function (req, res) {
    res.render('contact');
});

// Start the server and give error if it is not working
var server = app.listen(3000, function(err) {
    if(err) {
        console.log('There is a problem with the server: ' + err);
    }
    console.log('App started: Port 3000');
});