var express     =  require('express'),
    Blog        =  require("../models/blogModel"),       
    router      =  express.Router()


//Routes for Blogs
// Below are HTTP methods. Routes for webpages, getting the static files
//route for add new blog page
router.get("/addnewblog", isLoggedIn, function (req, res) {
    res.render('addNewBlog');
});

router.post("/addnewblog", isLoggedIn, function (req, res){
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
// this route is used by admin and normal user
// so do not want to need them to sign in and 
// have it be a protected route
router.get("/blogs/:blogId", function (req, res) {
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
router.delete("/blogs/:blogId", isLoggedIn, function (req, res) {
    console.log("the id of the blog you are trying to delete is: ", req.params.blogId);
    // res.send('We will show you the blog in a minute');

    Blog.findByIdAndRemove(req.params.blogId)
    .then(function(foundBlog){
        console.log('this is the blog chosen to be deleted: ', foundBlog);
        //res.render("blog", {foundBlog: foundBlog})
        res.redirect("/");
    })
    .catch(function(err) {
        console.log('there is an error with deleting this blog page: ', err);
        res.send(err);
    })
});

//this is sending you to foundblog for editing
router.get ("/blogs/:blogId/edit", isLoggedIn, function(req, res) {
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
router.put ("/blogs/:blogId/edit", isLoggedIn, function(req, res) {
    console.log('This is the blog you are editing, from router.put: ',  req.body);
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