var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, required: "Cannot be empty"},
    password: {type: String, required: "Cannot be empty"}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema); 