var mongoose = require('mongoose');

var BlogSchema = new mongoose.Schema ({
    title:    {type: String, required: "Cannot be empty"},
    subTitle: {type: String, required: "Cannot be empty"},
    comImage: {type: String, required: "Cannot be empty"},
    blog:     {type: String, required: "Cannot be empty"},
    date:     {type: Date, default: Date.now}
});

// Export the Blog model
module.exports = mongoose.model("Blog", BlogSchema); 