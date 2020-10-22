//router

var express = require("express");
var router = express.Router();
var Users = require("../model/user");

const { check, validationResult } = require("express-validator");

function enSureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/users/login");
  }
}

/* GET users listing. */

/*get profile page */
/* router.get("/profile", enSureAuthenticated, function (req, res, next) {
  res.render("profile/profile");
}); */
/*get register page */
/* router.get("/register", function (req, res, next) {
  res.render("user/register", { title: "register" });
}); */
/*get login page */
router.get("/login", function (req, res, next) {
  res.render("user/login", { title: "login" });
});
/*get logout page */
router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/");
});

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

//post login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: false,
    alert: "",
  }),
  function (req, res) {
    res.redirect("/home");
  }
);
passport.use(
  new LocalStrategy(function (username, password, done) {
    Users.getUserByName(username, function (err, user) {
      if (err) throw error;
      if (!user) {
        return done(null, false);
      }
      Users.comparePassword(password, user.password, function (err, isMatch) {
        if (err) return err;
        if (!isMatch) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      });
    });
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  Users.getUserById(id, function (err, user) {
    done(err, user);
  });
});

//post register
router.post(
  "/register",
  [
    check("email", "กรุณาป้อนอีเมล").isEmail(),
    check("name", "กรุณาป้อนชื่อของท่าน").not().isEmpty(),
    check("password", "กรุณาป้อนรหัสผ่าน").not().isEmpty(),
  ],
  function (req, res, next) {
    const result = validationResult(req);
    var error = result.errors;
    //Validation Data
    if (!result.isEmpty()) {
      //Return error to views
      res.render("user/register", {
        errors: error,
      });
    } else {
      //insert data
      var name = req.body.name;
      var password = req.body.password;
      var email = req.body.email;
      var newUser = new Users({
        name: name,
        password: password,
        email: email,
      });
      Users.createUser(newUser, function (err, user) {
        if (err) throw err;
      });
      res.location("/");
      res.redirect("/users/login");
    }
  }
);
// bcrypt
var bcrypt = require("bcryptjs");
var db = require("monk")(
  "mongodb+srv://pongpiti_1:boonyoung_1@cluster0-rbtdf.mongodb.net/loginDB?retryWrites=true&w=majority"
);

//post  update user
router.post("/profile", enSureAuthenticated, function (req, res, next) {
  var us = db.get("users");
  const myhash = async (mypass) => {
    const results = await bcrypt.hash(mypass, 10);
    return results;
  };
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  myhash(password).then((result) => {
    var bcrypass = result;
    if (password === "") {
      us.update(
        {
          _id: req.body.id,
        },
        {
          $set: {
            name: name,
            email: email,
          },
        },
        function (err, success) {
          if (err) {
            res.send(err);
          } else {
            res.location("/users/profile");
            res.redirect("/users/profile");
          }
        }
      );
    } else {
      us.update(
        {
          _id: req.body.id,
        },
        {
          $set: {
            name: name,
            email: email,
            password: bcrypass,
          },
        },
        function (err, success) {
          if (err) {
            res.send(err);
          } else {
            res.location("/users/profile");
            res.redirect("/users/profile");
          }
        }
      );
    }
  });
});
module.exports = router;
