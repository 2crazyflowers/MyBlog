var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    // username: {type: String, required: "Cannot be empty"},
    // password: {type: String, required: "Cannot be empty"}
    
    username: {type: String},
    password: {type: String},
    // _id:      { type: mongoose.Schema.Types.ObjectId },
});

UserSchema.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", UserSchema); 
