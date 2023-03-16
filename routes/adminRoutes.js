const express = require('express');
const adminControllers = require('../controllers/adminControllers');
const adminRouters = express.Router();
adminRouters.route("/login").post(adminControllers.checkLogin).get(adminControllers.hintShower)
adminRouters.route("/flag").post(adminControllers.checkFlag).get(adminControllers.hintShower)
module.exports = adminRouters