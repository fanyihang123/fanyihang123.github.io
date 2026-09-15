var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");  //automatically require 'index.js'

//=============================
//Campgrounds Routes
//=============================

router.get("/", function(req, res) {
    Campground.find({}, function(err, allcamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allcamp});
            console.log("LOG: "+"All camps retrieved");
        }
    });
});

//Create a post
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    // var name = req.body.name;
    // var image = req.body.image;
    // var price = req.body.price;
    // var description = req.body.description;
    // var newCampground = {name: name, image: image, price: price, description: description};
    req.body.camp.author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body.camp, function(err, newCamp) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds"); //default is GET request.
            console.log("LOG: "+"New camp added"+newCamp);
        }
    });
});

//Show a post
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        // foundCampground is what we found with this unique id provided by MongoDB
        if (err || !foundCampground) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
            console.log("LOG: "+"Info shown: " + foundCampground.name);
        }
    });
});

//Edit a post
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Delete a post
router.delete("/:id", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    }); 
});

module.exports = router;