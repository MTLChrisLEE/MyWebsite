/**
 * Created by Chris on 3/17/2018.
 */
//====================================//
//         ROUTES FOR Comment         //
//====================================//

var express = require('express')
var router = express.Router();

var Subject = require("../models/subject");
var Course = require("../models/course");
var Comment = require("../models/comment");
var markdown = require("markdown").markdown;

router.post("/:subject/:id/comment", function (req, res) {
    Subject.findOne({name: req.params.subject}, function (err, theSubject) {
        if (err) {
            res.redirect("/")
            console.log(err)
        } else {
            Course.findById(req.params.id, function (err, thecourse) {
                if (err) {
                    res.redirect("/")
                } else {
                    Comment.create(req.body.comment, function (err, newcomment) {
                        if (err) {
                            res.redirect("/");
                        } else {
                            newcomment.content = markdown.toHTML(newcomment.content);
                            newcomment.username = req.user.username;
                            thecourse.comment.push(newcomment._id);
                            thecourse.save();
                            theSubject.save();
                            res.redirect("/" + theSubject.name + "/" + thecourse._id);
                        }
                    })
                }
            })
        }
    })
})


router.delete("/:subject/:id/:comment_id", function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, deletedCourse) {
        if (err) {
            console.log(err)
        } else {
            Course.updateOne({name: req.params.id},
                {
                    $pull: {comments: {_id: req.params.comment_id}}
                },
                function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        Subject.updateOne({name: req.params.subject},
                            function (err) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    res.redirect("/" + req.params.subject+"/"+req.params.id);
                                }
                            })
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