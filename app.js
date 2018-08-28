var express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    expressSession  = require("express-session"),
    User            = require("./models/userModel"),
    Blog            = require("./models/blogModel"),
    bodyParser      = require("body-parser"),
    PORT            = 3000,
    app             = express();

//Testing used to initialize app without mongodb
    // var posts = [
    //     {
    //         postTitle: "Test Title 1",
    //         postSubTitle: "This is a subtitle",
    //         postLink: "https://www.linkedin.com/in/sara-bracewell-3b952761/",
    //         postDate: "July 2, 2018"
    //     },
    //     {
    //         postTitle: "Test Title 2",
    //         postSubTitle: "This is a subtitle",
    //         postLink: "https://www.linkedin.com/in/sara-bracewell-3b952761/",
    //         postDate: "July 14, 2018"
    //     },
    //     {
    //         postTitle: "Test Title 3",
    //         postSubTitle: "This is a subtitle",
    //         postLink: "https://www.linkedin.com/in/sara-bracewell-3b952761/",
    //         postDate: "July 2, 2018"
    //     }
    // ]

//Required Routes
var siteRoutes      = require('./routes/siteRoutes.js'),
    blogRoutes      = require('./routes/blogRoutes.js'),
    adminRoutes      = require('./routes/adminRoutes.js');

//App Configuration
mongoose.Promise = Promise;
// this connection tells what port to use for data base and
// what database to use, if it does not exist, create a MyBlogApp database
// if connection made, console log, else catch the specific error
mongoose.connect("mongodb://localhost:27017/MyBlogApp")
    .then(() => {
        console.log('The database connected')
    })
    .catch((err)=> {
        console.log('Something went awry', err);
    });

// View engine which will handle the front end side, which is ejs
app.set('view engine', 'ejs'); 
// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + '/public'));
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

// below is from documentation
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
//this resolved issue with user not going to database
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Share current user with routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Routes Used
app.use(siteRoutes);
app.use(blogRoutes);
app.use(adminRoutes);


// Start the server and give error if it is not working
var server = app.listen(PORT, function(err) {
    if(err) {
        console.log('There is a problem with the server: ' + err);
    }
    console.log('App started: Port ' + PORT);
});