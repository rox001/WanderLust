const express = require("express");

const router = express.Router();

const passport = require("passport");

const userController = require("../controllers/users.js");


// ==========================================
// SIGNUP FORM
// ==========================================

router.get(
    "/signup",
    userController.renderSignupForm
);


// ==========================================
// SIGNUP
// ==========================================

router.post(
    "/signup",
    userController.signup
);


// ==========================================
// LOGIN FORM
// ==========================================

router.get(
    "/login",
    userController.renderLoginForm
);


// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);


// ==========================================
// LOGOUT
// ==========================================

router.get(
    "/logout",
    userController.logout
);


module.exports = router;