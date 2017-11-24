/**
 * Created by Chris on 10/28/2017.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var subjects = [
    {
        name: "web",
        image: "https://i.imgur.com/nosrsBg.jpg",  //https://imgur.com/nosrsBg
        quote: "\"Websites promote you 24/7: No employee will do that.\"",
        author: "- Paul Cookson"

    },
    {
        name: "python",
        image: "https://i.imgur.com/mvNWVNW.jpg",  //https://imgur.com/a/Q1k33
        quote: "\"Python has been an important part of Google since the beginning.\"",
        author: "-Peter Norvig"

    },
    {
        name: "java",
        image: "https://i.imgur.com/QZP7KY8.jpg",  //https://imgur.com/a/rMtbT
        quote: "\"Java is C++ without the guns, knives, and clubs.\"",
        author: "-James Gosling"
    },
    {
        name: "data science",
        image: "https://i.imgur.com/zzrKnK7.jpg",  //https://imgur.com/a/Goeej
        quote: "\"Data is the new science. Big data holds the answers.\"",
        author: "- Pat Gelsinger"
    },
    {
        name: "operating system",
        image: "https://i.imgur.com/mAkbjU5.jpg",     //https://imgur.com/a/ygIVm
        quote: "\"UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.\"",
        author: "- Dennis Ritchie"
    }
]


var courses = [
    {
        title:"Hello",
        content: ""
    },
    {
        title:"World",
        content: ""
    }
]


var reviews = [
    {
        title:"Review1",
        author: "Whatever1",
        paper: "Title of the paper",
        content: ""
    },
    {
        title:"Review2",
        author: "Whatever2",
        paper: "Title of the paper2",
        content: ""
    },
    {
        title:"Review3",
        author: "Whatever3",
        paper: "Title of the paper3",
        content: ""
    },
    {
        title:"Review4",
        author: "Whatever4",
        paper: "Title of the paper4",
        content: ""
    }
]


app.get("/",function(req,res){
    res.render("welcomepage.ejs")
})


//HOME
app.get("/home", function (req, res) {
    res.render("home.ejs", {subjects: subjects, reviews:reviews})
})


//NEW ROUTE FOR SUBJECTS
app.get("/home/new",function(req,res){
    res.render("newsubject.ejs");
})


//POST ROUTE FOR SUBJECTS
app.post("/home",function(req,res){
    var subject = req.body.subjects;
    subjects.push(subject);
    res.redirect("/home");
})

app.get("/aboutme", function (req, res) {
    res.render("aboutme.ejs");
})



//INDEX ROUTE FOR REVIEWS
app.get("/reviews",function(req,res){
    res.render("reviews.ejs",{reviews:reviews})
})


//NEW ROUTE FOR REVIEWS
app.get("/reviews/new",function(req,res){
    res.render("newreview.ejs")
})


app.post("/reviews",function(req,res){
    var review = req.body.reviews;
    reviews.push(review);
    res.redirect("/reviews");
})





//INDEX ROUTE FOR COURSES
app.get("/:subject", function (req, res) {
    var subjectreq = req.params.subject;
    var subject = subjects.find(function (element) {
        if (element.name == subjectreq) {
            return element;
        }
    })

    if (subject) {
        res.render("template.ejs", {subjects: subject, courses:courses})
    }else{
        res.render("wrongpage.ejs");
    }
})



//NEW ROUTE FOR COURSE
app.get("/:subject/new",function(req,res){
    var subjectreq = req.params.subject;
    var subject = subjects.find(function (element) {
        if (element.name == subjectreq) {
            return element;
        }
    })

    if (subject) {
        res.render("newcourse.ejs", {subject: subject});
    }
})




//POST ROUTE FOR COURSES
app.post("/:subject",function(req,res){
    var post = req.body.courses;
    courses.push(post);

    var subjectreq = req.params.subject;
    var subject = subjects.find(function (element) {
        if (element.name == subjectreq) {
            return element;
        }
    })

    if (subject) {
        res.render("template.ejs", {subjects: subject, courses:courses})
    }else{
        res.render("wrongpage.ejs");
    }
})


app.listen(30000, process.env.IP, function () {
    console.log("CONNECTED")
})