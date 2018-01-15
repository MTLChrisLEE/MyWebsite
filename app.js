/**
 * Created by Chris on 10/28/2017.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var markdown = require("markdown").markdown;

var Subject = require("./models/subject")
var Review = require("./models/review")
var Course = require("./models/course")
var Comment = require("./models/comment")
var seedDB = require("./seeds")
var methodOverride = require("method-override");


seedDB();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
mongoose.connect("mongodb://localhost/MTLChrisLEE");


//=========================================//
//=========================================//
//                  ROUTES                 //
//=========================================//
//=========================================//


//=========================================//
//                  Subjects               //
//=========================================//
app.get("/", function (req, res) {
    Subject.find({}, function (err, subjects) {
        if (err) {
            console.log(err)
        } else {
            Review.find({}, function (err, reviews) {
                if (err) {
                    console.log(err)
                } else {
                    res.render("home.ejs", {subjects: subjects, reviews: reviews})
                }
            })
        }
    })
})


//NEW ROUTE FOR SUBJECTS
app.get("/home/new", function (req, res) {
    res.render("newsubject.ejs");
})


//POST ROUTE FOR SUBJECTS
app.post("/", function (req, res) {
    Subject.create(req.body.subjects, function (err, newSubject) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/")
        }
    })
})

app.get("/aboutme", function (req, res) {
    res.render("aboutme.ejs");
})


//=========================================//
//                  Reviews                //
//=========================================//


//INDEX ROUTE FOR REVIEWS
app.get("/reviews", function (req, res) {
    Review.find({}, function (err, reviews) {
        if (err) {
            console.log(err)
        } else {
            res.render("reviews.ejs", {reviews: reviews})
        }
    })
})


//NEW ROUTE FOR REVIEWS
app.get("/reviews/new", function (req, res) {
    res.render("newreview.ejs")
})


//POST ROUTE FOR REVIEWS
app.post("/reviews", function (req, res) {
    Review.create(req.body.reviews, function (err, newReview) {
        if (err) {
            res.render("newreview.ejs");
        } else {
            res.redirect("/reviews");
        }
    })
})


//SHOW ROUTE FOR REVIEWS
app.get("/reviews/:id", function (req, res) {
    Review.findById(req.params.id, function (err, foundReview) {
        if (err) {
            console.log(err)
        } else {

            foundReview.content = markdown.toHTML(foundReview.content)
            res.render("showreview.ejs", {review: foundReview})
        }
    })
})


//EDIT ROUTE FOR A REVIEW
app.get("/reviews/:id/edit", function (req, res) {
    Review.findById(req.params.id, req.body.review, function (err, foundReview) {
        if (err) {
            res.redirect("/reviews")
        } else {
            res.render("editreview.ejs", {review: foundReview});
        }
    })
})


//UPDATE ROUTE FOR A REVIEW
app.put("/reviews/:id", function (req, res) {
    Review.findByIdAndUpdate(req.params.id, req.body.reviews, function (err, updatedReview) {
        if (err) {
            res.redirect("/reviews")
        } else {
            res.redirect("/reviews/" + req.params.id)
        }
    })
})


app.delete("/reviews/:id", function (req, res) {
    Review.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/reviews")
        }
    })
})


//=========================================//
//                  Courses                //
//=========================================//


//INDEX ROUTE FOR COURSES
app.get("/:subject", function (req, res) {
    Subject.find({name: req.params.subject}).populate("courses").exec(function (err, foundSubject) {
        if (err) {
            res.redirect("/")
        } else {
            res.render("template.ejs", {subjects: foundSubject[0], courses: foundSubject[0].courses})
        }
    })
})


//NEW ROUTE FOR COURSE
app.get("/:subject/course/new", function (req, res) {
    Subject.find({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            res.redirect("/")
        } else {
            res.render("newcourse.ejs", {subject: foundSubject[0]})
        }
    })
})


//POST ROUTE FOR COURSES
app.post("/:subject/courses", function (req, res) {
    Subject.find({name: req.params.subject}).populate("courses").exec(function (err, theSubject) {
        if (err) {
            console.log(err);
        } else {
            Course.create(req.body.courses, function (err, createdCourse) {
                if (err) {
                    console.log(err)
                } else {
                    theSubject[0].courses.push(createdCourse);
                    theSubject[0].save();
                    res.redirect("/" + theSubject[0].name)
                }
            })
        }
    })
})


//SHOW ROUTE FOR A COURSE
app.get("/:subject/:id", function (req, res) {
    Subject.find({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            console.log(err)
        } else {
            Course.findById(req.params.id, function (err, foundCourse) {
                if (err) {
                    console.log(err)
                } else {
                    foundCourse.content = markdown.toHTML(foundCourse.content)
                    res.render("showcourse.ejs", {subject: foundSubject[0], course: foundCourse});
                }
            })
        }
    })
})


//EDIT ROUTE
app.get("/:subject/:id/edit", function (req, res) {
    Subject.find({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            console.log(err)
        } else {
            Course.findById(req.params.id, function (err, foundCourse) {
                if (err) {
                    console.log(err)
                } else {
                    res.render("editcourse.ejs", {subject: foundSubject[0], course: foundCourse})
                }
            })
        }
    })
})


//UPDATE ROUTE
app.put("/:subject/:id", function (req, res) {
    Subject.find({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            console.log(err)
        } else {
            Course.findByIdAndUpdate(req.params.id, req.body.course, function (err, updatedCourse) {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect("/" + foundSubject[0].name + "/" + req.params.id)
                }
            })
        }
    })
})


//DELETE ROUTE
app.delete("/:subject/:id", function (req, res) {
    //1. Find a course according to its id from the collection & Removes it
    Course.findByIdAndRemove(req.params.id, function (err, deletedCourse) {
        if (err) {
            console.log(err)
        } else {
            //2. Update "a" subject
            Subject.updateOne({name: req.params.subject},
                {
                    $pull: {courses: {_id: req.params.id}} //Pulling the deleted course from courses[]
                },
                function (err) {
                    if(err){
                        console.log(err)
                    }else{
                        res.redirect("/"+req.params.subject)   //3. Redirecting
                    }
                }
            )
        }
    })
})


app.listen(30000, process.env.IP, function () {
    console.log("CONNECTED")
})