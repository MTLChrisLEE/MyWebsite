/**
 * Created by Chris on 3/17/2018.
 */
//====================================//
//         ROUTES FOR SUBJECTS        //
//====================================//

var express = require('express')
var router = express.Router();

var Subject = require("../models/subject");

router.get("/", isLoggedIn, function (req, res) {
    Subject.find({}, function (err, subjects) {
        if (err) {
            console.log("Cannot load subjects from dbs")
        } else {
            res.render("courses.ejs", {subjects: subjects})
        }
    })
})


//NEW ROUTE FOR SUBJECTS
router.get("/new", isAdmin, function (req, res) {
    res.render("newcourse.ejs");
})


//POST ROUTE FOR SUBJECTS
router.post("/", isAdmin, function (req, res) {
    Subject.create(req.body.subjects, function (err, newSubject) {
        if (err) {
            res.render("newcourse.ejs")
        } else {
            res.redirect("/")
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



