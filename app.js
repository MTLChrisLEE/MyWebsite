/**
 * Created by Chris on 10/28/2017.
 */
var express = require('express');
var app = express();


app.use(express.static("public"));


var subjects = [
    {
        name: "web",
        image: "web.jpg",
        quote: "\"Websites promote you 24/7: No employee will do that.\"",
        author: "- Paul Cookson"

    },
    {
        name: "python",
        image: "python.jpg",
        quote: "\"Python has been an important part of Google since the beginning, and remains so as the system grows and evolves.\"",
        author: "-Peter Norvig"

    },
    {
        name: "java",
        image: "java.jpg",
        quote: "\"Java is C++ without the guns, knives, and clubs.\"",
        author: "-James Gosling"
    },
    {
        name: "data science",
        image: "datascience.jpg",
        quote: "\"Data is the new science. Big data holds the answers.\"",
        author: "- Pat Gelsinger"
    },
    {
        name: "operating system",
        image: "OS.jpg",
        quote: "\"UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.\"",
        author: "- Dennis Ritchie"
    }
]


app.get("/", function (req, res) {
    res.render("MTLChrisLEE.ejs", {subjects: subjects})
})

app.get("/aboutme", function (req, res) {
    res.render("aboutme.ejs");
})


app.get("/:subject", function (req, res) {
    var subjectreq = req.params.subject;
    var subject = subjects.find(function (element) {
        if (element.name == subjectreq) {
            return element;
        }
    })
    if (subject) {
        res.render("template.ejs", {subjects: subject})
    }

})


app.listen(30000, process.env.IP, function () {
    console.log("CONNECTED")
})