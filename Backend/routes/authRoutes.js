const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");

const {
  signup,
  login,
} = require("../controllers/authController");

/* ROUTES */

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;