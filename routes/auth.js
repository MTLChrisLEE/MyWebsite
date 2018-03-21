/**
 * Created by Chris on 3/17/2018.
 */
//====================================//
//         ROUTES FOR Register        //
//====================================//
var express = require('express')
var router = express.Router();


var User = require("../models/user");
var passport = require('passport');
var secret = require('../secret.js')

router.get("/register", function (req, res) {
    res.render("signup.ejs")
})

router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username})
    if (req.body.username === process.env.ADMINID) {
        newUser.isAdmin = true;
        newUser.isRecruiter = true;
    }
    if (req.body.username === process.env.RECRUITERID) {
        newUser.isRecruiter = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                req.flash("error", err.message.toString())
                return res.redirect("/register")
            }
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to MTLChrisLEE " + user.username)
                res.redirect("/")
            })
        }
    )
})

//====================================//
//         ROUTES FOR LogIn locally   //
//====================================//


router.get("/signin", function (req, res) {
    res.render("login.ejs")
})

router.post("/signin",
    passport.authenticate("local",
        {
            successRedirect: "/",
            failureRedirect: "/signin",
            failureFlash: "Invalid username or password!"
        }),
    function (req, res) {
    }
)

//====================================//
//         ROUTES FOR Log Out        //
//====================================//


router.get("/signout", function (req, res) {
    req.logout();
    req.flash("success", "Logged out")
    res.redirect("/")
})

router.post("/signin",
    passport.authenticate("local",
        {
            successRedirect: "/",
            failureRedirect: "/signin"
        }),
    function (req, res) {

    }
)


module.exports = router;