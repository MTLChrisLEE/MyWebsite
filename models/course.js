/**
 * Created by Chris on 1/12/2018.
 */

var mongoose = require("mongoose")


var courseSchema = new mongoose.Schema({
    title: String,
    content: String,
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    subject:  String
});

module.exports = mongoose.model("Course",courseSchema);