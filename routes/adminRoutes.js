var express     =  require('express'),
    passport    =  require("passport"),
    User        =  require("../models/userModel"),     
    router      =  express.Router();


// Routes for administrator: signup, signin, signout
// Below are HTTP methods. Routes for webpages, getting the static files
//route for signin page
router.get("/signin", function (req, res) {
    res.render('signIn');
});

router.post("/signin", passport.authenticate("local",
    {
    successRedirect: "/",
    failureRedirect: "/signin"
    }), function(req, res){ 
});

//route for signout page
router.get("/signout", function (req, res) {
    req.logOut();
    res.redirect("/");
});

//route for signup page
router.get("/signup", isLoggedIn, function (req, res) {
    res.render('signUp');
});

router.post("/signup", isLoggedIn, function (req, res) {
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

function isLoggedIn(req, res, next) {
    //console.log('You think you are logged in, but are you?');
    if(req.isAuthenticated()) {
        console.log('You are still logged in');
        return next();
    }
    res.redirect('/signin');
};


module.exports  = router;