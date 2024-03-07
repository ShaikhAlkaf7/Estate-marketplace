const express = require("express");
const {
  signUpController,
  signinController,
} = require("../controlless/authController");
const router = express.Router();

// route for signup
router.post("/signup", signUpController);
// route for signin
router.post("/signin", signinController);
module.exports = router;
