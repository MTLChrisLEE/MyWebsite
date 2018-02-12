/**
 * Created by Chris on 2/11/2018.
 */
var express = require("express");
var router = express.Router();
var Subject = require("../models/subject")
var Course = require("../models/course")



//====================================//
//         ROUTES FOR COURSES         //
//====================================//




//INDEX ROUTE FOR COURSES
router.get("/:subject", isLoggedIn, function (req, res) {
    Subject.findOne({name: req.params.subject}).populate("courses").exec(function (err, foundSubject) {
        if (err) {
            console.log("Cannot find the subject")
            console.log(err)
        } else {
            if (err) {
                console.log(err);
            } else {
                res.render("template.ejs", {subjects: foundSubject, courses: foundSubject.courses})
            }
        }
    })
})


//NEW ROUTE FOR COURSE
router.get("/:subject/course/new",isAdmin, function (req, res) {
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


//SHOW ROUTE
router.get("/:subject/:id", isLoggedIn, function (req, res) {
    Subject.findOne({name: req.params.subject}, function (err, foundSubject) {
        if (err) {
            console.log(err)
        } else {
            Course.findById(req.params.id, function (err, foundCourse) {
                if (err) {
                    res.redirect("/reviews")
                } else {
                    foundCourse.content = markdown.toHTML(foundCourse.content)
                    console.log("====foundCourse====;");
                    console.log(foundCourse);
                    console.log("====foundCourse.comment====;");
                    console.log(foundCourse.comment);


                    Comment.find({_id:{$in:foundCourse.comment}},function(err,foundComments){
                        for(index in foundComments)
                        {
                            foundComments[index].content=markdown.toHTML(foundComments[index].content);
                            console.log("======foundComment.content")
                            console.log(foundComments[index].content)
                        }


                        res.render("showcourse.ejs", {subject: foundSubject, course: foundCourse, comments:foundComments})
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
                    res.render("editcourse.ejs", {subject: foundSubject, course: foundCourse})
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


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
}

function isAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.isAdmin){
        return next();
    }
    res.redirect("/")
}


module.exports = router;