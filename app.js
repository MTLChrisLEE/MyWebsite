/**
 * Created by Chris on 10/28/2017.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require('passport');
var LocalStrategy = require('passport-local');
;
var markdown = require("markdown").markdown;
var flash = require("connect-flash")

var Subject = require("./models/subject");
var Review = require("./models/review");
var Course = require("./models/course");
var Comment = require("./models/comment");
var User = require("./models/user");

var secret = require('./secret.js')

var seedDB = require("./seeds");

seedDB();


//Passport
app.use(require("express-session")({
    secret: secret.secret,
    resave: false,
    saveUninitializeed: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash())


var commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/auth"),
    reviewsRoutes = require("./routes/reviews"),
    subjectsRoutes = require("./routes/subjects"),
    lecturesRoutes = require("./routes/lectures");

mongoose.connect("mongodb://localhost/MTLChrisLEE");

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(authRoutes);
app.use("/courses",subjectsRoutes);
app.use("/reviews",reviewsRoutes);
app.use(lecturesRoutes);
app.use(commentRoutes);

//====================================//
//====================================//
//            RESTFUL ROUTES          //
//====================================//
//====================================//





//====================================//
//         ROUTES FOR Home       //
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
            }).limit(7)
        }
    }).limit(4)
})


app.get("/contact",function(req,res){
    res.render("contact.ejs");
});




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

app.listen(30000, process.env.IP, function () {
    console.log("CONNECTED")
})