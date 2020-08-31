const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { formatError } = require("../helpers/errors");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

// @desc Auth with Google
// @route GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "email", "profile"] })
);

// @desc Google auth callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
  }),
  (req, res, next) => {
    res.redirect("/");
  }
);

// @desc Register user
// @route /auth/register
router.get("/register", async (req, res, next) => {
  try {
    res.render("register", { title: "Register", name: "register" });
  } catch (err) {
    console.error(err);
  }
});

// @desc Register user
// @route /auth/register
router.post(
  "/register",
  [
    check("username")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("Field is should be up to 5 characters"),
    check("fullname")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("Field is should be up to 5 characters"),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("password", "Password must contain at least 6 characters").isLength({
      min: 6,
    }),
    check("password2", "Passwords do not match").equals("password"),
  ],
  async (req, res, next) => {
    try {
      let validationErrors = validationResult(req);
      if (validationErrors) {
        // Check for email
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          await validationErrors.errors.push({
            value: req.body.email,
            msg: "Email already exists",
            param: "email",
            location: "body",
          });
        }
        // Check for username
        user = await User.findOne({ userName: req.body.username });
        if (user) {
          await validationErrors.errors.push({
            value: req.body.email,
            msg: "Username already exists",
            param: "username",
            location: "body",
          });
        }
        let errors = formatError(validationErrors.errors);
        res.render("register", {
          title: "Register",
          name: "register",
          errors,
        });
        return;
      }
      // Generate Salt and Hash Password
      const salt = await bcrypt.genSalt(16);
      const hash = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        userName: req.body.username,
        fullName: req.body.fullname,
        email: req.body.email,
        password: hash,
      });

      console.log(newUser);
    } catch (err) {
      console.error(err);
    }
  }
);

// @desc LogIn user
// @route /auth/login
router.get("/login", async (req, res, next) => {
  res.render("login", { title: "Login", name: "login" });
});

// @desc Logout user
// @route /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
