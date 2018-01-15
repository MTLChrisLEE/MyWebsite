/**
 * Created by Chris on 10/28/2017.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose")
var methodOverride = require("method-override")
var markdown = require("markdown").markdown;

var Subject = require("./models/subject")
var Review = require("./models/review")
var Course = require("./models/course")
var Comment = require("./models/comment")
var seedDB = require("./seeds");

seedDB()


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
mongoose.connect("mongodb://localhost/MTLChrisLEE_PR");


//====================================//
//====================================//
//            RESTFUL ROUTES          //
//====================================//
//====================================//


//HOME
app.get("/", function (req, res) {
    Subject.find({}, function (err, subjects) {
        if (err) {
            console.log("Cannot load subjects from dbs")
        } else {
            Review.find({}, function (err, reviews) {
                if (err) {
                    console.log("Cannot load subjects from dbs")
                } else {
                    res.render("home.ejs", {subjects: subjects, reviews: reviews})
                }
            })
        }
    })
})

app.get("/aboutme", function (req, res) {
    res.render("aboutme.ejs");
})


//====================================//
//         ROUTES FOR SUBJECTS        //
//====================================//


//NEW ROUTE FOR SUBJECTS
app.get("/home/new", function (req, res) {
    res.render("newsubject.ejs");
})


//POST ROUTE FOR SUBJECTS
app.post("/", function (req, res) {
    Subject.create(req.body.subjects, function (err, newSubject) {
        if (err) {
            res.render("newsubject.ejs")
        } else {
            res.redirect("/")
        }
    })
})


//====================================//
//         ROUTES FOR REVIEWS        //
//====================================//


//INDEX ROUTE FOR REVIEWS
app.get("/reviews", function (req, res) {
    Review.find({}, function (err, reviews) {
        if (err) {
            console.log("Cannot load subjects from dbs")
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
            res.render("newreview.ejs")
        } else {
            res.redirect("/reviews")
        }
    })
})


//SHOW ROUTE FOR REVIEWS
app.get("/reviews/:id", function (req, res) {
    Review.findById(req.params.id, function (err, foundReview) {
        if (err) {
            res.redirect("/reviews")
        } else {
            foundReview.content = markdown.toHTML(foundReview.content)
            res.render("showreview.ejs", {review: foundReview})
        }
    })
})


//EDIT ROUTE
app.get("/reviews/:id/edit", function (req, res) {
    Review.findById(req.params.id, function (err, foundReview) {
        if (err) {
            res.redirect("/reviews")
        } else {
            res.render("editreview.ejs", {review: foundReview})
        }
    })
})


//UPDATE ROUTE
app.put("/reviews/:id", function (req, res) {
    Review.findByIdAndUpdate(req.params.id, req.body.reviews, function (err, updatedReview) {
        if (err) {
            res.redirect("/reviews")
        } else {
            res.redirect("/reviews/" + req.params.id)
        }
    })
})


//DELETE ROUTE
app.delete("/reviews/:id", function (req, res) {
    Review.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log("ERROR: Cannot delete")
            console.log(err)
        } else {
            res.redirect("/reviews")
        }
    })
})


//====================================//
//         ROUTES FOR COURSES         //
//====================================//


//INDEX ROUTE FOR COURSES
app.get("/:subject", function (req, res) {
    Subject.find({name: req.params.subject}).populate("courses").exec(function (err, foundSubject) {
        if (err) {
            // res.redirect("/")
            console.log(err)
        } else {
            if (err) {
                console.log(err);
            } else {
                res.render("template.ejs", {subjects: foundSubject[0], courses: foundSubject[0].courses})
            }

        }
    })
})


//NEW ROUTE FOR COURSE
app.get("/:subject/course/new", function (req, res) {
    Subject.find({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            res.redirect("/")
            console.log(err)
        } else {
            res.render("newcourse.ejs", {subject: foundSubject[0]})
        }
    })
})


//POST ROUTE FOR COURSES
app.post("/:subject/courses", function (req, res) {
    Subject.find({name: req.params.subject}).populate("courses").exec(function (err, theSubject) {
        if (err) {
            res.redirect("/")
            console.log(err)
        } else {
            Course.create(req.body.courses, function (err, createdCourse) {
                if (err) {
                    console.log(err)
                } else {
                    theSubject[0].courses.push(createdCourse);
                    theSubject[0].save();
                    res.redirect('/' + theSubject[0].name);
                }
            })
        }
    })
})


//SHOW ROUTE
app.get("/:subject/:id", function (req, res) {
    Subject.find({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            console.log(err)
        } else {
            Course.findById(req.params.id, function (err, foundCourse) {
                if (err) {
                    res.redirect("/reviews")
                } else {
                    foundCourse.content = markdown.toHTML(foundCourse.content)
                    res.render("showcourse.ejs", {subject: foundSubject[0], course: foundCourse})
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
                    res.redirect("/" + req.params.subject)
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
            Course.findByIdAndUpdate(req.params.id, req.body.course, function (err, updatedReview) {
                if (err) {
                    res.redirect("/" + foundSubject[0].name)
                } else {
                    res.redirect("/" + foundSubject[0].name + "/" + req.params.id)
                }
            })
        }
    })
})


//DELETE ROUTE
app.delete("/:subject/:id", function (req, res) {
    Course.findByIdAndRemove(req.params.id, function (err, deletedCourse) {
        if (err) {
            console.log(err)
        } else {
            console.log(deletedCourse)
            Subject.updateOne({name: req.params.subject},
                {
                    $pull: {courses: {_id: req.params.id}}
                },
                function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect("/" + req.params.subject);
                    }
                })
        }
    })
})



app.listen(30000, process.env.IP, function () {
    console.log("CONNECTED")
})