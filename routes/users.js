// Bring express in
const express = require("express");
// Create a variable router to use express.router
const router = express.Router();

// Bring in Bcrypt
const bcrypt = require("bcryptjs");

// Bring passport
const passport = require("passport");

// Bring in user model
const User = require("../models/User");

// To create a route. I this case / refers to the login page, and with the arrow function it will send a message
// to the login page.
router.get("/login", (req, res) => res.render("login"));

// To create the Register page.
router.get("/register", (req, res) => res.render("register"));

// Register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  // initialize an array
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //Check if passwords match
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check pass lenght
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    // If there are errors, then render register form again
    // and pass in the errors and data
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hash
            newUser.password = hash;
            // Save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login  handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Your are logged out");
  res.redirect("/users/login");
});

// To export
module.exports = router;
