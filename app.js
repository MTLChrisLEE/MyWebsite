/**
 * Created by Chris on 10/28/2017.
 */
var express = require('express');
var app = express();


app.use(express.static("public"));


var subjects = {
    python: {
        subject: "python",
        quote: "\"Python has been an important part of Google since the beginning, and remains so as the system grows and evolves.\"",
        author: "-Peter Norvig"
    },
    java: {
        subject: "java",
        quote: "\"Java is C++ without the guns, knives, and clubs.\"",
        author: "-James Gosling"
    },
    web: {
        subject: "web",
        quote: "\"Websites promote you 24/7: No employee will do that.\"",
        author: "- Paul Cookson"
    },
    datascience: {
        subject: "data science",
        quote: "\"Data is the new science. Big data holds the answers.\"",
        author: "- Pat Gelsinger"
    },
    operatingsystem: {
        subject: "operating system",
        quote: "\"UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.\"",
        author: "- Dennis Ritchie"
    }
}


app.get("/", function (req, res) {
    res.render("MTLChrisLEE.ejs")
})

app.get("/aboutme",function(req,res){
    res.render("aboutme.ejs");
})


app.get("/:subject", function (req, res) {
    if (req.params.subject in subjects) {
        res.render("template.ejs", {subject: subjects[req.params.subject]})
    } else {
        res.send("SOMETHING WRONG")
    }
})




app.listen(30000, process.env.IP, function () {
    console.log("CONNECTED")
})