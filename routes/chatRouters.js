const express = require("express");
const chatRouters = express.Router();
const chatControllers = require("./../controllers/chatControllers");
chatRouters.route("/").post(chatControllers.chat)
module.exports = chatRouters;