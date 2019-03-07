// Call express
const express = require("express");
// Call express ejs layouts
const expressLayouts = require("express-ejs-layouts");
// Bring in Mongoose
const mongoose = require("mongoose");
// Bring connect-flash
const flash = require("connect-flash");
// Bring Session
const session = require("express-session");
// Bring passport
const passport = require("passport");

// Initialize app with express
const app = express();

// Passport config
require("./config/passport")(passport);

// Connect to Database.
// 1. DB Config
const db = require("./config/keys").MongoURI;
// 2. Connect to Mongo. Using useNewUrlParser will avoid warnings
// and will return a promise
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected...")) //if promise accepted
  .catch(err => console.log(err)); //if promise rejected show the err

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser which is now part of express.
// To get data from the form in the form of body
app.use(express.urlencoded({ extended: true }));

//Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars. They come from flash and are useful to be called from everywhere
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
// "/" will use home page and will require the actions in ./routes/index
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));

// Create the PORT to run the app on. process.env.PORT in case of deployment or 5000 just to listen the port
const PORT = process.env.PORT || 5000;

// Make the app listen to the PORT
app.listen(PORT, console.log(`Server started on port ${PORT}`));
