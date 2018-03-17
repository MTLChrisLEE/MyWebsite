/**
 * Created by Chris on 3/17/2018.
 */
//====================================//
//         ROUTES FOR LECTURES        //
//====================================//
var express = require('express')
var router = express.Router();

var Subject = require("../models/subject");
var Course = require("../models/course");
var Comment = require("../models/comment");
var markdown = require("markdown").markdown;


//INDEX ROUTE FOR LECTURES
router.get("/:subject", isLoggedIn, function (req, res) {
    var itemsPerPage = 6;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    Subject.findOne({name: req.params.subject})
        .populate([{
            path: 'courses',
            model: 'Course',
            options: {
                skip: (itemsPerPage * pageNumber) - itemsPerPage,
                limit: itemsPerPage
            }
        }])
        .exec(function (err, foundSubject) {
            if (err) {
                console.log("Cannot find the subject")
                res.redirect("/")
            } else {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    Course.count(foundSubject.courses).exec(function (err, count) {
                        if (err) {
                            console.log(err)
                        } else {
                            if (foundSubject == null) {
                                res.redirect("/");
                            } else {
                                console.log("=====Course.count()");
                                console.log(Course.count());
                                console.log("======count====");
                                console.log(count)
                                res.render("template.ejs", {
                                    subjects: foundSubject,
                                    courses: foundSubject.courses,
                                    current: pageNumber,
                                    pages: Math.ceil(count / itemsPerPage)
                                })
                            }
                        }
                    })
                }
            }
        })
})


//NEW ROUTE FOR LECTURES
router.get("/:subject/course/new", isAdmin, function (req, res) {
    Subject.find({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            res.redirect("/")
            console.log(err)
        } else {
            res.render("newlecture.ejs", {subject: foundSubject[0]})
        }
    })
})


//POST ROUTE FOR LECTURES
router.post("/:subject/courses", function (req, res) {
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


//SHOW ROUTE FOR LECTURES
router.get("/:subject/:id", isLoggedIn, function (req, res) {
    Subject.findOne({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            console.log(err)
        } else {
            Course.findById(req.params.id, function (err, foundCourse) {
                if (err) {
                    res.redirect("/")
                } else {
                    foundCourse.content = markdown.toHTML(foundCourse.content)
                    Comment.find({_id: {$in: foundCourse.comment}}, function (err, foundComments) {
                        for (index in foundComments) {
                            foundComments[index].content = markdown.toHTML(foundComments[index].content);
                        }
                        res.render("showlecture.ejs", {
                            subject: foundSubject,
                            course: foundCourse,
                            comments: foundComments
                        })
                    })
                }
            })
        }
    })
})


//EDIT ROUTE
router.get("/:subject/:id/edit", isAdmin, function (req, res) {
    Subject.findOne({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            console.log(err)
        } else {
            Course.findById(req.params.id, function (err, foundCourse) {
                if (err) {
                    res.redirect("/" + req.params.subject)
                } else {
                    res.render("editlecture.ejs", {subject: foundSubject, course: foundCourse})
                }
            })
        }
    })
})


//UPDATE ROUTE
router.put("/:subject/:id", function (req, res) {
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
router.delete("/:subject/:id", isAdmin, function (req, res) {
    Course.findByIdAndRemove(req.params.id, function (err, deletedCourse) {
        if (err) {
            console.log(err)
        } else {
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


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Sign in First")
    res.redirect("/signin");
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.redirect("/")
}


module.exports = router;