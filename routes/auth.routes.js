const express = require("express");
const {login,  signUp} = require("../controller/auth.controller.js");

const router = express.Router();

router.post("/login", login);

router.post("/signUp", signUp);

//router.post("/logout", logout);

module.exports = router;