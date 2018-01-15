/**
 * Created by Chris on 1/12/2018.
 */

var mongoose = require("mongoose")

var commentSchema = new mongoose.Schema({
    user: String,
    content: String
})

module.exports = mongoose.model("Comment",commentSchema);