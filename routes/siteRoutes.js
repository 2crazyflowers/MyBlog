var express     =  require('express'),
    Blog        =  require("../models/blogModel"),       
    router      =  express.Router()
    
//Routes for general app pages seen by general user
// Below are HTTP methods. Routes for webpages, getting the static files
// route home page to render the home.ejs file
router.get("/", function (req, res) {
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
router.get("/about", function (req, res) {
    res.render('about');
});

//route for contact page
router.get("/contact", function (req, res) {
    res.render('contact');
});

module.exports  = router;