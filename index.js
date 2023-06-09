const express = require("express");
const mongoose = require("mongoose");
const userroute = require("./routes/userroute");
const adminroute = require("./routes/adminroute");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv").config();
const path = require('path')
const User = require("./models/userModel");
const app = express();
app.set('view engine','ejs')
app.set('views', '/actions-runner/users/usermanagmentsystemwithauthentication/usermanagmentsystemwithauthentication/views');


const GoogleStrategy = require("passport-google-oauth20").Strategy;
app.use(express.static("public"));
app.use(
  session({
    secret: "Gursevaksingh",
    saveUninitialized: false,
    resave: false,
    cookie:{
      maxAge:2*1000
    }
  })
);
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
const ejs = require("ejs");

//Database connectivity
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then((result) => {
    if (result) {
      console.log("database connected successfully");
    }
  });
passport.use(new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/callback",
    },
    (accessToken, refreshtoken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((alluser) => {
        if (alluser) {
          return done(null, alluser);
        }
      });
      const user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
       
      });
     user.save().then(() => {
          console.log("user sign in with google successfully");
        }).catch((err) => {
          console.log(err.message);
        });
    }
  )
);
passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser((user, done) => {
  return done(null, user);
});
//user routes
app.get(
  "/auth/google",passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
  })
);
app.use("/", userroute);
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    req.session.User_Id = user._id;
    res.redirect("/home");
  }
});
//admin routes
app.use("/admin", adminroute.route);

app.listen(process.env.PORT, () => {
  console.log("server starts on port 3000");
});


