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
// below code not working:
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// below is from documentation
//this resolved issue (above) with user not going to database
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
//this resolved issue with user not going to database
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//from documentation - did not resolve errors
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

// Share current user with routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// route home page to render the home.ejs file
app.get("/", function (req, res) {
    Blog.find({}, function(err, posts){
        if(err) {
            console.log("there is an error finding blogs from database: ", err);
        } else {
        // console.log(posts);
            res.render('home', {posts:posts});
        }
    })
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

app.post("/signin", passport.authenticate("local",
    {
    successRedirect: "/",
    failureRedirect: "/signin"
    }), function(req, res){ 
});

//route for signout page
app.get("/signout", function (req, res) {
    req.logOut();
    res.redirect("/");
});

//route for signup page
app.get("/signup", isLoggedIn, function (req, res) {
    res.render('signUp');
});

app.post("/signup", isLoggedIn, function (req, res) {
    //console.log(req.body) - add name to input in form for user/password
    console.log('Current username: ' + req.body.username);
    console.log('Current password: ' + req.body.password);

    // Create a new user using req.body to test if saving user to database working
    // without using passport etc. just simple connection
    // User.create(req.body)
    //     .then(function(dbUser) {
    //     // If saved successfully, send the the new User document to the client
    //     res.json(dbUser);
    //     })
    //     .catch(function(err) {
    //     // If an error occurs, send the error to the client
    //     res.json(err);
    //     });

    // var newUser = new User({
    //     username: req.body.username,
    //     password: req.body.password
    // });
    // console.log(newUser);

    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, newCreatedUser){
        if(err) {
            console.log('There is an error signing up: ' + err);
            res.redirect('/signup');
        }
        passport.authenticate('local')(req, res, function(){
            //console.log(req.body);
            res.redirect('/');
        });
    });
    
});

//route for add new blog page
app.get("/addnewblog", isLoggedIn, function (req, res) {
    res.render('addNewBlog');
});

app.post("/addnewblog", isLoggedIn, function (req, res){
    // console.log(req.body.data);
    var title = req.body.data.blogTitle;
    var subTitle = req.body.data.blogSubTitle;
    var comImage = req.body.data.blogComImage;
    var blog = req.body.data.blogText;

    var newBlog = {
        title: title, 
        subTitle: subTitle, 
        comImage: comImage,
        blog: blog
    }

    Blog.create(newBlog)
    .then(function(newBlog){
        console.log("New blog added: " + newBlog);
        res.status(201).json(newBlog);
    })
    .catch(function(err) {
        console.log("there is an error sending new blog to database: " + err)
    })
});

// route for each blog
app.get("/blogs/:blogId", isLoggedIn, function (req, res) {
    // console.log(req.params.blogId);
    // res.send('We will show you the blog in a minute');

    Blog.findById(req.params.blogId)
    .then(function(foundBlog){
        res.render("blog", {foundBlog: foundBlog})
    })
    .catch(function(err) {
        console.log('there is an error with posting this blog page: ', err);
        res.send(err);
    })
});

//route for deleting blogs
// app.delete("/blogs/:blogId", isLoggedIn, function (req, res) {
//     console.log(req.params.blogId);
//     // res.send('We will show you the blog in a minute');

//     Blog.findByIdAndRemove(req.params.blogId)
//     .then(function(foundBlog){
//         console.log('this is the blog chosen to be deleted: ', foundBlog);
//         //res.render("blog", {foundBlog: foundBlog})
//     })
//     .catch(function(err) {
//         console.log('there is an error with deleting this blog page: ', err);
//         res.send(err);
//     })
// });

app.get("/deleteblog/:blogId", isLoggedIn, function(req, res){
    Blog.findById(req.params.blogId)
    .then(function(foundBlog){
        res.render("blog", {foundBlog: foundBlog})
    })
    .catch(function(err) {
        console.log('there is an error with posting this blog page: ', err);
        res.send(err);
    });
});

//deleting blogs is not working
app.delete("/deleteblog/:blogId", isLoggedIn, function(req, res){
    console.log('deleting with this id: ', req.params.blogId)
    Blog.findByIdAndRemove(req.params.blogId, function(err){
        console.log("this is the blog you are trying to delete: ", req.params.blogId, req.body);
        
        if(err){
            console.log('there was an error in trying to delete the blog: ' + err);
            //res.redirect("/");
        } else {
            console.log('you have deleted this blog: '+ req.body);
            //res.redirect("/");
        }
    });
});

//this is working and sending you to foundblog for editing
app.get ("/blogs/:blogId/edit", isLoggedIn, function(req, res) {
    Blog.findById(req.params.blogId, function(err, foundBlog) {
        console.log('url for put should be: /blogs/',req.params.blogId);
        console.log('foundblog for editing: ', foundBlog);
        if(err) {
            console.log("there is an error getting the id of the post you are trying to blog: ", err);
        };
        //sends the blog requested for editing to updateBlog page for editing
        res.render("updateBlog", {foundBlog: foundBlog});
    });
});
//route for editing a blog and saving it
app.put ("/blogs/:blogId/edit", isLoggedIn, function(req, res) {
    //these console logs are not even logging out!!
    console.log('This is the blog you are editing, from app.put: ',  req.body);
    // this has been added to see if jquery put will work instead of an ajax call
    //these variables were not here before, 
    //beginning to think error is that I am not 
    //giving the backend the proper information to send
    var title = req.body.blogTitle;
    var subTitle = req.body.blogSubTitle;
    var comImage = req.body.blogComImage;
    var blog = req.body.blogText;

    var updatedBlog = {
        title: title, 
        subTitle: subTitle, 
        comImage: comImage,
        blog: blog
    }
    //updated to params from param ===see if that is what was going wrong
    Blog.findByIdAndUpdate(req.params.blogId, req.body, function(err, updatedBlog){
        console.log('==================This is your edited blog: ', updatedBlog);
        if(err) {
            console.log('There is an error updating this blog: ', err);
            res.render("updateBlog", {data:data});
        }
        else {
            res.redirect("/");
        }
    });
});

function isLoggedIn(req, res, next) {
    //console.log('You think you are logged in, but are you?');
    
    if(req.isAuthenticated()) {
        console.log('You are still logged in');
        return next();
    }
    res.redirect('/signin');
};


// Start the server and give error if it is not working
var server = app.listen(PORT, function(err) {
    if(err) {
        console.log('There is a problem with the server: ' + err);
    }
    console.log('App started: Port ' + PORT);
});