const mongoose = require('mongoose');
const admins = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true,"password is required"]
    }
});
const Admin = mongoose.model('Admin', admins, "admins");
module.exports = Admin;