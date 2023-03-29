const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const users = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email Format is invalid!'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'password is required'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
    required: [true, 'Confirm password is required'],
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Your Confirm password must be same as the password',
    },
  },
  active: {
    type: Boolean,
    select: false,
    default: true
  },
  passwordChange: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});
users.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
users.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChange) {
    const changedTime = Date.parse(this.passwordChange) / 1000;
    console.log(JWTTimestamp , changedTime);
    return JWTTimestamp < changedTime;
  }
  return false;
};

users.pre(/^find/,function(next){
  this.find({ active: {$ne: false}});
  next();
})
users.methods.checkPassword = async function (userPassword, hashedPassword) {
  return await bcrypt.compare(userPassword, hashedPassword);
};
users.pre("save",function(next){
  if(!this.isModified("password") || this.isNew){
    return next()
  }
  this.passwordChange = Date.now() - 1000;
  console.log("Password change updated!")
  next();
})
users.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const Users = mongoose.model('Users', users);
module.exports = Users;
