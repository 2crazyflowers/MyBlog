var express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    expressSession  = require("express-session"),
    User            = require("./models/userModel"),
    bodyParser      = require("body-parser"),
    PORT            = 3000,
    app             = express();

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


//App Configuration
// mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/MyBlogApp"); //if the database is not there it will create it
// View engine which will handle the front end side, which is ejs
app.set('view engine', 'ejs'); 
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'));
// Use body-parser for handling form submissions, helps get data (from user- add new blog) from request 
app.use(bodyParser.urlencoded({ extended: true }));


// Passport Config
// These parameters takes property and value
app.use(require("express-session")({
    secret: "this is our secret sentence",
    resave: false,
    saveUninitalized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Below are HTTP methods. Routes for webpages, getting the static files
// route home page to render the home.ejs file
app.get("/", function (req, res) {
    res.render('home', {posts:posts});
});

//route for about page
app.get("/about", function (req, res) {
    res.render('about');
});

//route for contact page
app.get("/contact", function (req, res) {
    res.render('contact');
});

//route for signin page
app.get("/signin", function (req, res) {
    res.render('signIn');
});


//route for signup page
app.get("/signup", function (req, res) {
    res.render('signUp');
});

app.post("/signup", function (req, res) {
    //console.log(req.body) - add name to input in form for user/password
    console.log(req.body.username);
    console.log(req.body.password);

    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, newCreatedUser){
        if(err) {
            console.log('There is an error signing up: ' + err);
            res.redirect('/signup');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        })
    })
});

//route for add new blog page
app.get("/addnewblog", function (req, res) {
    res.render('addNewBlog');
});


// Start the server and give error if it is not working
var server = app.listen(PORT, function(err) {
    if(err) {
        console.log('There is a problem with the server: ' + err);
    }
    console.log('App started: Port ' + PORT);
});