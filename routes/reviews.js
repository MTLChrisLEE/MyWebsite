/**
 * Created by Chris on 3/17/2018.
 */
//====================================//
//         ROUTES FOR REVIEWS        //
//====================================//
var express = require('express')
var router = express.Router();

var Review = require("../models/review");
var markdown = require("markdown").markdown;


//INDEX ROUTE FOR REVIEWS
router.get("/", isLoggedIn, function (req, res) {
    var itemsPerPage = 6;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;


    Review.find({}).skip((itemsPerPage * pageNumber) - itemsPerPage).limit(itemsPerPage).exec(function (err, reviews) {
        Review.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("reviews.ejs", {reviews: reviews, current: pageNumber, pages: Math.ceil(count/itemsPerPage)})
            }
        })
    })
})


//NEW ROUTE FOR REVIEWS
router.get("/new", isAdmin, function (req, res) {
    res.render("newreview.ejs")
})


//POST ROUTE FOR REVIEWS
router.post("/", function (req, res) {
    Review.create(req.body.reviews, function (err, newReview) {
        if (err) {
            res.render("newreview.ejs")
        } else {
            res.redirect("/reviews")
        }
    })
})


//SHOW ROUTE FOR REVIEWS
router.get("/:id", isLoggedIn, function (req, res) {
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
router.get("/:id/edit", isAdmin, function (req, res) {
    Review.findById(req.params.id, function (err, foundReview) {
        if (err) {
            res.redirect("/reviews")
        } else {
            res.render("editreview.ejs", {review: foundReview})
        }
    })
})


//UPDATE ROUTE
router.put("/:id", function (req, res) {
    Review.findByIdAndUpdate(req.params.id, req.body.reviews, function (err, updatedReview) {
        if (err) {
            res.redirect("/reviews")
        } else {
            res.redirect("/reviews/" + req.params.id)
        }
    })
})


//DELETE ROUTE
router.delete("/:id", isAdmin, function (req, res) {
    Review.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log("ERROR: Cannot delete")
            console.log(err)
        } else {
            res.redirect("/reviews")
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