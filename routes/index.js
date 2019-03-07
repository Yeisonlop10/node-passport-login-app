// Bring express in
const express = require("express");
// Create a variable router to use express.router
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');

// To create a route. I this case / refers to the home page, and with the arrow function it will render the 'welcome"
// layout on the home page.
router.get("/", (req, res) => res.render("welcome"));
// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => res.render("dashboard", {
  name: req.user.name
}));

// To export
module.exports = router;
