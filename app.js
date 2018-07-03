const express = require("express"),
    app = express();

    // var data = {
    //     title: "Hello Everyone"
    // }
    var posts = [
        {
            postTitle: "Test Title 1",
            postSubTitle: "This is a subtitle",
            postLink: "https://www.linkedin.com/in/sara-bracewell-3b952761/",
            postDate: "July 2, 2018"
        },
        {
            postTitle: "Test Title 2",
            postSubTitle: "This is a subtitle",
            postLink: "https://www.linkedin.com/in/sara-bracewell-3b952761/",
            postDate: "July 14, 2018"
        },
        {
            postTitle: "Test Title 3",
            postSubTitle: "This is a subtitle",
            postLink: "https://www.linkedin.com/in/sara-bracewell-3b952761/",
            postDate: "July 2, 2018"
        }
    ]


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
    res.render('home', {posts:posts});
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