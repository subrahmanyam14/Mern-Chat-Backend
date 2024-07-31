const express = require("express");
const {getMessages, sendMessage, deleteMessages} = require("../controller/message.controller.js");
const protectRoute = require("../middleware/protectedRouter.js");

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);

router.get("/getAllMessages/:id", protectRoute, getMessages);

router.delete("/deleteCoversation/:id", protectRoute, deleteMessages);

module.exports = router;