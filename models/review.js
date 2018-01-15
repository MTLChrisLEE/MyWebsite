/**
 * Created by Chris on 1/12/2018.
 */
var mongoose = require("mongoose")

var reviewSchema = new mongoose.Schema({
    title: String,
    author: String,
    paper: String,
    content: String
})


module.exports = mongoose.model("Review",reviewSchema);