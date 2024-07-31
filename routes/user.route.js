const express = require("express");
const {getUsersForSideBar, getAllUsersForSideBar} = require("../controller/user.controller.js");
const protectRoute = require("../middleware/protectedRouter.js");

const router = express.Router();

router.get("/getUsers", protectRoute, getUsersForSideBar);
router.get("/get-all-users", getAllUsersForSideBar);

module.exports = router;