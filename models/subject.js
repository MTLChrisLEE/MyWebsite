/**
 * Created by Chris on 1/12/2018.
 */
var mongoose = require("mongoose");

var subjectSchema = new mongoose.Schema({
    name: String,
    image: String,
    quote: String,
    author: String,
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ]
})

module.exports = mongoose.model("Subject",subjectSchema);