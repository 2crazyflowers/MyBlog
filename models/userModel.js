var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, required: "Cannot be empty"},
    password: {type: String, required: "Cannot be empty"}
    // _id:      { type: mongoose.Schema.Types.ObjectId },
    // username: {type: String},
    // password: {type: String},
});

UserSchema.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", UserSchema); 
