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
mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost:27017/MyBlogApp")
    .then(() => {
        console.log('The database connected')
    })
    .catch((err)=> {
        console.log('Something went awry', err);
    });

//if the database is not there it will create it
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

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//from documentation
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));


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
    console.log('Current username: ' + req.body.username);
    console.log('Current password: ' + req.body.password);

    // Create a new user using req.body
    // User.create(req.body)
    //     .then(function(dbUser) {
    //     // If saved successfully, send the the new User document to the client
    //     res.json(dbUser);
    //     })
    //     .catch(function(err) {
    //     // If an error occurs, send the error to the client
    //     res.json(err);
    //     });

    var newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    console.log(newUser);

    User.register(newUser, req.body.password, function(err, newCreatedUser){
        if(err) {
            console.log('There is an error signing up: ' + err);
            res.redirect('/signup');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
    
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