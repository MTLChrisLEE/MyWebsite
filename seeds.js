/**
 * Created by Chris on 1/12/2018.
 */
var mongoose =  require("mongoose")

var Subject = require("./models/subject")
var Review = require("./models/review")
var Course = require("./models/course")
var Comment = require("./models/comment")

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


function seedDB() {


    Course.remove({}, function (err) {
        if (err) {
            console.log(err)
        }
        console.log("All courses are removed")
    });



    Review.remove({}, function (err) {
        if (err) {
            console.log(err)
        }
    })
    console.log("All reviews are removed")

    reviews.forEach(function(review){
        Review.create(review, function(err,subject){
            if(err){
                console.log(err)
            }else{
                console.log("A review is added")
            }
        })
    })


    Subject.remove({}, function (err) {
        if (err) {
            console.log(err)
        }
    })
    console.log("All reviews are removed")

    subjects.forEach(function(subject){
        Subject.create(subject, function(err,subject){
            if(err){
                console.log(err)
            }else{
                console.log("A subject is added")
            }
        })
    })

}

module.exports = seedDB;